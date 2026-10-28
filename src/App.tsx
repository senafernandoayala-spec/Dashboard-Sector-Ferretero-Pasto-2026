import React, { useState, useMemo, useEffect } from 'react';
import rawData from '../public/assets/aistudio/Base_Ferreterias_Pasto_Final_3e82fb4e.json';
import { FerreteriaRecord, FilterState, DashboardStats, ScheduledReport } from './types/ferreteria';
import { enrichFerreteriaData, cleanBarrioName, cleanCiiuLabel } from './utils/pastoGeo';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MetricCards } from './components/MetricCards';
import { ChartsView } from './components/ChartsView';
import { MapView } from './components/MapView';
import { StoreTable } from './components/StoreTable';
import { ScheduledReportsModal } from './components/ScheduledReportsModal';
import { StoreDetailModal } from './components/StoreDetailModal';
import { exportToExcel, exportToPDF } from './utils/exportReports';
import { Award, CheckCircle2, Sparkles, MapPin, Building2, UserCheck } from 'lucide-react';

export default function App() {
  // Enrich dataset with coordinates and statuses
  const allStores: FerreteriaRecord[] = useMemo(() => {
    return enrichFerreteriaData(rawData as FerreteriaRecord[]);
  }, []);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    añoRenovacion: 'ALL',
    tipoRS: 'ALL',
    barrio: [],
    comunaSector: [],
    ciiuTipo: 'ALL',
    estadoRenovacion: 'ALL',
  });

  // UI Navigation Tabs
  const [activeTab, setActiveTab] = useState<'metrics' | 'map' | 'table'>('metrics');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<FerreteriaRecord | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter Change Handler
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    // Check if the value is a JSON stringified array
    if ((key === 'barrio' || key === 'comunaSector') && value.startsWith('[')) {
      setFilters((prev) => ({ ...prev, [key]: JSON.parse(value) }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      añoRenovacion: 'ALL',
      tipoRS: 'ALL',
      barrio: [],
      comunaSector: [],
      ciiuTipo: 'ALL',
      estadoRenovacion: 'ALL',
    });
  };

  // Available Filter Option Lists
  const availableBarrios = useMemo(() => {
    const barrioSet = new Set<string>();
    allStores.forEach((s) => {
      const bName = cleanBarrioName(s.BARRIO_COMERCIAL);
      if (bName && bName !== 'NO ESPECIFICADO') barrioSet.add(bName);
    });
    return Array.from(barrioSet).sort();
  }, [allStores]);

  const availableAños = useMemo(() => {
    const añoSet = new Set<number>();
    allStores.forEach((s) => {
      if (s.ULT_AÑO_REN) añoSet.add(s.ULT_AÑO_REN);
    });
    return Array.from(añoSet).sort((a, b) => b - a);
  }, [allStores]);

  const availableComunas = useMemo(() => {
    const comunaSet = new Set<string>();
    allStores.forEach((s) => {
      if (s.comunaOrSector) comunaSet.add(s.comunaOrSector);
    });
    return Array.from(comunaSet).sort();
  }, [allStores]);

  // Filter Data
  const filteredStores = useMemo(() => {
    return allStores.filter((store) => {
      // 1. Search Term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = store.RAZON_SOCIAL?.toLowerCase().includes(searchLower);
        const matchesOwner = `${store.NOMBRE_1 || ''} ${store.APELLIDO_1 || ''}`.toLowerCase().includes(searchLower);
        const matchesNit = store.NIT ? store.NIT.toString().includes(searchLower) : false;
        const matchesAddress = store.DIR_COMERCIAL?.toLowerCase().includes(searchLower);
        const matchesBarrio = store.BARRIO_COMERCIAL?.toLowerCase().includes(searchLower);

        if (!matchesName && !matchesOwner && !matchesNit && !matchesAddress && !matchesBarrio) {
          return false;
        }
      }

      // 2. Año Renovación
      if (filters.añoRenovacion !== 'ALL') {
        if (filters.añoRenovacion === 'ANTERIORES') {
          if (store.ULT_AÑO_REN && store.ULT_AÑO_REN >= 2024) return false;
        } else {
          if (String(store.ULT_AÑO_REN) !== filters.añoRenovacion) return false;
        }
      }

      // 3. Tipo RS
      if (filters.tipoRS !== 'ALL') {
        if (filters.tipoRS === 'PERSONA_NATURAL' && store.TIPO_RS !== 'PERSONA_NATURAL') return false;
        if (filters.tipoRS === 'NOMBRE_COMERCIAL' && store.TIPO_RS !== 'NOMBRE_COMERCIAL') return false;
        if (filters.tipoRS === 'JURIDICA' && (store.TIPO_RS === 'PERSONA_NATURAL' || store.TIPO_RS === 'NOMBRE_COMERCIAL')) return false;
      }

      // 4. Barrio
      if (filters.barrio.length > 0) {
        const cleanB = cleanBarrioName(store.BARRIO_COMERCIAL);
        if (!filters.barrio.includes(cleanB)) return false;
      }

      // 5. Comuna/Sector
      if (filters.comunaSector.length > 0) {
        if (!filters.comunaSector.includes(store.comunaOrSector || '')) return false;
      }

      // 6. CIIU Tipo
      if (filters.ciiuTipo !== 'ALL') {
        if (filters.ciiuTipo === 'G4752') {
          if (!store.CIIU_1?.includes('G4752')) return false;
        } else if (filters.ciiuTipo === 'G4663') {
          if (!store.CIIU_1?.includes('G4663')) return false;
        } else if (filters.ciiuTipo === 'OTROS') {
          if (store.CIIU_1?.includes('G4752') || store.CIIU_1?.includes('G4663')) return false;
        }
      }

      // 7. Estado Renovación Preset
      if (filters.estadoRenovacion !== 'ALL') {
        if (filters.estadoRenovacion === 'ACTIVO') {
          if (store.ULT_AÑO_REN !== 2026 && store.ULT_AÑO_REN !== 2025) return false;
        } else if (filters.estadoRenovacion === 'PENDIENTE') {
          if (store.ULT_AÑO_REN !== 2024) return false;
        } else if (filters.estadoRenovacion === 'INACTIVO') {
          if (store.ULT_AÑO_REN && store.ULT_AÑO_REN >= 2024) return false;
        }
      }

      return true;
    });
  }, [allStores, filters]);

  // Dynamic Statistics Calculation
  const stats: DashboardStats = useMemo(() => {
    const total = filteredStores.length;
    let totalRenovado2026 = 0;
    let totalRenovado2025 = 0;
    let totalVencidos = 0;

    let totalPersonaNatural = 0;
    let totalNombreComercial = 0;
    let totalJuridicaSAS = 0;

    const barrioMap: Record<string, number> = {};
    const anoMap: Record<string, number> = {};
    const tipoMap: Record<string, number> = {};
    const ciiuMap: Record<string, number> = {
      G4752: 0,
      G4663: 0,
      OTROS: 0,
    };

    filteredStores.forEach((s) => {
      // Estatus
      if (s.ULT_AÑO_REN === 2026) totalRenovado2026++;
      else if (s.ULT_AÑO_REN === 2025) totalRenovado2025++;
      else totalVencidos++;

      // Personería
      if (s.TIPO_RS === 'PERSONA_NATURAL') totalPersonaNatural++;
      else if (s.TIPO_RS === 'NOMBRE_COMERCIAL') totalNombreComercial++;
      else totalJuridicaSAS++;

      // Barrio
      const b = cleanBarrioName(s.BARRIO_COMERCIAL);
      if (b && b !== 'NO ESPECIFICADO') {
        barrioMap[b] = (barrioMap[b] || 0) + 1;
      }

      // Año
      const anoKey = s.ULT_AÑO_REN ? String(s.ULT_AÑO_REN) : 'Sin Registro';
      anoMap[anoKey] = (anoMap[anoKey] || 0) + 1;

      // Tipo RS
      const tipoKey =
        s.TIPO_RS === 'PERSONA_NATURAL'
          ? 'Persona Natural'
          : s.TIPO_RS === 'NOMBRE_COMERCIAL'
          ? 'Nombre Comercial'
          : 'Persona Jurídica (SAS / SA)';
      tipoMap[tipoKey] = (tipoMap[tipoKey] || 0) + 1;

      // CIIU
      if (s.CIIU_1?.includes('G4752')) ciiuMap.G4752++;
      else if (s.CIIU_1?.includes('G4663')) ciiuMap.G4663++;
      else ciiuMap.OTROS++;
    });

    const porcentajeAlDia = total > 0 ? Math.round(((totalRenovado2026 + totalRenovado2025) / total) * 100) : 0;

    // Sort Top Barrios
    const topBarrios = Object.entries(barrioMap)
      .map(([barrio, count]) => ({ barrio, count }))
      .sort((a, b) => b.count - a.count);

    // Sort Años
    const porAnoRenovacion = Object.entries(anoMap)
      .map(([ano, count]) => ({ ano, count }))
      .sort((a, b) => b.ano.localeCompare(a.ano));

    // Sort Tipos
    const porTipoRS = Object.entries(tipoMap).map(([tipo, count]) => ({ tipo, count }));

    // CIIU Format
    const porCIIU = [
      { ciiu: 'G4752', label: 'G4752 Minorista Ferretería', count: ciiuMap.G4752 },
      { ciiu: 'G4663', label: 'G4663 Mayorista Materiales', count: ciiuMap.G4663 },
      { ciiu: 'OTROS', label: 'Otras Actividades Conexas', count: ciiuMap.OTROS },
    ];

    return {
      total,
      totalRenovado2026,
      totalRenovado2025,
      totalVencidos,
      porcentajeAlDia,
      totalPersonaNatural,
      totalNombreComercial,
      totalJuridicaSAS,
      topBarrios,
      porAnoRenovacion,
      porTipoRS,
      porCIIU,
    };
  }, [filteredStores]);

  // Export Trigger Handlers
  const handleExportExcel = () => {
    exportToExcel(filteredStores, stats, filters);
    showToast('¡Archivo de Excel (.xlsx) generado exitosamente!');
  };

  const handleExportPDF = () => {
    exportToPDF(filteredStores, stats, filters);
    showToast('¡Reporte Ejecutivo PDF generado exitosamente!');
  };

  // Test Run Scheduled Report
  const handleTriggerTestReport = (report: ScheduledReport) => {
    if (report.formato === 'Excel' || report.formato === 'Ambos') {
      exportToExcel(filteredStores, stats, filters);
    }
    if (report.formato === 'PDF' || report.formato === 'Ambos') {
      exportToPDF(filteredStores, stats, filters);
    }
    showToast(`Prueba enviada para "${report.nombre}" a ${report.destinatarioEmail}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header with dual logos, author badge and navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredStores.length}
        totalCount={allStores.length}
      />

      {/* Search & Custom Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        availableBarrios={availableBarrios}
        availableAños={availableAños}
        availableComunas={availableComunas}
        totalResults={filteredStores.length}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* KPI Summary Cards */}
        <MetricCards stats={stats} />

        {/* Tab Views */}
        {activeTab === 'metrics' && (
          <div>
            {/* Recharts Graphical Visualizations */}
            <ChartsView stats={stats} />

            {/* Quick Preview Table of Filtered Data */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Muestra del Directorio Ferretero Filtrado
                </h3>
                <button
                  onClick={() => setActiveTab('table')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Ver Todos los {filteredStores.length} Registros &rarr;
                </button>
              </div>
              <StoreTable records={filteredStores} onSelectStore={setSelectedStore} />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div>
            <MapView records={filteredStores} onSelectStore={setSelectedStore} />
            <StoreTable records={filteredStores} onSelectStore={setSelectedStore} />
          </div>
        )}

        {activeTab === 'table' && (
          <div>
            <StoreTable records={filteredStores} onSelectStore={setSelectedStore} />
          </div>
        )}

      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow ring-2 ring-emerald-400/40 overflow-hidden">
              <img src="/assets/aistudio/Logo_SENA_2026_5aebd4bb.jpeg" alt="Logo SENA" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                Centro Internacional de Producción Limpia Lope SENA • Regional Nariño
              </p>
              <p className="text-[11px] text-slate-500">
                Cámara de Comercio de Pasto • Sistema Registral Empresarial
              </p>
            </div>
          </div>

          <div className="text-center md:text-right bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <p className="font-bold text-amber-300">
              Autor: Edgar Fernando Ayala Quitiaquez
            </p>
            <p className="text-[11px] text-slate-400">
              Instructor de Competitividad y Desarrollo Tecnológico
            </p>
          </div>

        </div>
      </footer>

      {/* Modal 1: Scheduled Reports */}
      <ScheduledReportsModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onTriggerTestReport={handleTriggerTestReport}
      />

      {/* Modal 2: Individual Store Detail Card */}
      <StoreDetailModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
      />

    </div>
  );
}
