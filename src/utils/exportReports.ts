import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FerreteriaRecord, DashboardStats, FilterState } from '../types/ferreteria';
import { cleanBarrioName } from './pastoGeo';

const AUTHOR_NAME = 'Edgar Fernando Ayala Quitiaquez';
const AUTHOR_ROLE = 'Instructor de Competitividad y Desarrollo Tecnológico';
const INSTITUTION = 'Cámara de Comercio de Pasto & SENA Regional Nariño';

export function exportToExcel(records: FerreteriaRecord[], stats: DashboardStats, filters: FilterState) {
  // Sheet 1: Detailed Store Records
  const storeData = records.map((r) => ({
    'Matrícula': r.MATRICULA,
    'Razón Social / Establecimiento': r.RAZON_SOCIAL,
    'Propietario / Representante': `${r.NOMBRE_1 || ''} ${r.APELLIDO_1 || ''}`.trim() || 'N/A',
    'NIT / Cédula': r.NIT ? Math.floor(r.NIT) : 'N/A',
    'Último Año Renovado': r.ULT_AÑO_REN || 'N/A',
    'Estado Matricular': r.estadoRenovacion || 'N/A',
    'Dirección Comercial': r.DIR_COMERCIAL,
    'Barrio Comercial': cleanBarrioName(r.BARRIO_COMERCIAL),
    'Comuna / Sector': r.comunaOrSector || 'Pasto',
    'Correo Electrónico': r.EMAIL_COMERCIAL,
    'Actividad Principal (CIIU)': r.CIIU_1 || 'G4752',
    'Tipo de Registro': r.TIPO_RS,
  }));

  const worksheet = XLSX.utils.json_to_sheet(storeData);

  // Sheet 2: Executive Summary & KPIs
  const summaryData = [
    { 'Métrica / Indicador': 'Entidad Emisora', 'Valor': INSTITUTION },
    { 'Métrica / Indicador': 'Elaborado por', 'Valor': `${AUTHOR_NAME} - ${AUTHOR_ROLE}` },
    { 'Métrica / Indicador': 'Fecha de Generación', 'Valor': new Date().toLocaleString('es-CO') },
    { 'Métrica / Indicador': 'Total Ferreterías Filtradas', 'Valor': records.length },
    { 'Métrica / Indicador': 'Total Renovadas Al Día (2025-2026)', 'Valor': stats.totalRenovado2026 + stats.totalRenovado2025 },
    { 'Métrica / Indicador': 'Tasa de Renovación Activa', 'Valor': `${stats.porcentajeAlDia}%` },
    { 'Métrica / Indicador': 'Ferreterías Pendientes / Vencidas', 'Valor': stats.totalVencidos },
    { 'Métrica / Indicador': 'Filtro Búsqueda Aplicado', 'Valor': filters.searchTerm || 'Ninguno' },
    { 'Métrica / Indicador': 'Filtro Año Renovación', 'Valor': filters.añoRenovacion },
    { 'Métrica / Indicador': 'Filtro Comuna/Sector', 'Valor': filters.comunaSector },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen Ejecutivo');
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Directorio Ferreterias');

  // Trigger download
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Reporte_Ferreterias_Pasto_${dateStr}.xlsx`);
}

export function exportToPDF(records: FerreteriaRecord[], stats: DashboardStats, filters: FilterState) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Colors
  const navyColor: [number, number, number] = [15, 23, 42]; // #0F172A
  const senaGreen: [number, number, number] = [57, 169, 0];  // #39A900

  // Title Banner Background
  doc.setFillColor(...navyColor);
  doc.rect(0, 0, 210, 32, 'F');

  // Accent Line
  doc.setFillColor(...senaGreen);
  doc.rect(0, 32, 210, 2, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('REPORTE EXECUTIVO SECTOR FERRETERO - PASTO', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Cámara de Comercio de Pasto • SENA Regional Nariño (CIPL Lope)', 14, 18);

  doc.setFontSize(8);
  doc.setTextColor(253, 230, 138); // Gold text
  doc.text(`Elaborado por: ${AUTHOR_NAME} - ${AUTHOR_ROLE}`, 14, 25);

  doc.setTextColor(203, 213, 225);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 150, 25);

  // Executive Summary Card Section
  let currentY = 40;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 34, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMEN DE RENDIMIENTO DEL SECTOR', 18, currentY + 7);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`• Total Establecimientos: ${records.length} de ${stats.total}`, 18, currentY + 14);
  doc.text(`• Tasa Renovación Activa (2025-2026): ${stats.porcentajeAlDia}% (${stats.totalRenovado2026 + stats.totalRenovado2025} locales)`, 18, currentY + 20);
  doc.text(`• Pendientes / Vencidos: ${stats.totalVencidos} ferreterías`, 18, currentY + 26);

  const topBarrio = stats.topBarrios.length > 0 ? `${stats.topBarrios[0].barrio} (${stats.topBarrios[0].count})` : 'N/A';
  doc.text(`• Barrio con Mayor Densidad: ${topBarrio}`, 105, currentY + 14);
  doc.text(`• Filtro Aplicado Año: ${filters.añoRenovacion}`, 105, currentY + 20);
  doc.text(`• Filtro Comuna/Sector: ${filters.comunaSector}`, 105, currentY + 26);

  currentY += 40;

  // Table Columns & Rows (Limit rows if too long for PDF preview, e.g. top 100)
  const pdfRecords = records.slice(0, 150);

  const tableColumn = [
    'Matrícula',
    'Razón Social / Establecimiento',
    'NIT',
    'Barrio',
    'Dirección',
    'Año Ren.'
  ];

  const tableRows = pdfRecords.map((r) => [
    `#${r.MATRICULA}`,
    r.RAZON_SOCIAL,
    r.NIT ? Math.floor(r.NIT).toString() : 'N/A',
    cleanBarrioName(r.BARRIO_COMERCIAL),
    r.DIR_COMERCIAL,
    r.ULT_AÑO_REN || 'N/A'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { top: 38, bottom: 15, left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Cámara de Comercio de Pasto & SENA Regional Nariño • Generado por ${AUTHOR_NAME}`,
        14,
        287
      );
      doc.text(`Página ${data.pageNumber} de ${pageCount}`, 180, 287);
    }
  });

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`Reporte_Ferreterias_Pasto_${dateStr}.pdf`);
}
