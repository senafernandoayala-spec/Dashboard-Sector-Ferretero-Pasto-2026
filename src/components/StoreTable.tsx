import React, { useState } from 'react';
import { FerreteriaRecord } from '../types/ferreteria';
import { cleanBarrioName, cleanCiiuLabel } from '../utils/pastoGeo';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Eye, 
  Mail, 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';

interface StoreTableProps {
  records: FerreteriaRecord[];
  onSelectStore: (store: FerreteriaRecord) => void;
}

export const StoreTable: React.FC<StoreTableProps> = ({ records, onSelectStore }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<keyof FerreteriaRecord>('RAZON_SOCIAL');
  const [sortAsc, setSortAsc] = useState(true);

  // Sorting
  const sortedRecords = [...records].sort((a, b) => {
    let valA = a[sortField] ?? '';
    let valB = b[sortField] ?? '';

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: keyof FerreteriaRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      
      {/* Table Top Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Directorio de Establecimientos Ferreteros
          </h3>
          <p className="text-xs text-slate-500">
            {records.length} registros listados según los criterios seleccionados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 font-medium">Filas por página:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-600"
          >
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
              <th className="p-3 text-center">Matrícula</th>
              <th className="p-3 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('RAZON_SOCIAL')}>
                <div className="flex items-center gap-1">
                  <span>Razón Social</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('NIT')}>
                <div className="flex items-center gap-1">
                  <span>NIT</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('BARRIO_COMERCIAL')}>
                <div className="flex items-center gap-1">
                  <span>Barrio / Sector</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Dirección</th>
              <th className="p-3 cursor-pointer hover:bg-slate-200 text-center" onClick={() => handleSort('ULT_AÑO_REN')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Últ. Renovación</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 text-center">Tipo Persona</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                  No se encontraron ferreterías que coincidan con los filtros aplicados.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((store) => (
                <tr
                  key={store.MATRICULA}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => onSelectStore(store)}
                >
                  <td className="p-3 text-center font-mono font-bold text-slate-500">
                    #{store.MATRICULA}
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    {store.RAZON_SOCIAL}
                    {store.NOMBRE_1 && (
                      <span className="block text-[11px] font-normal text-slate-500">
                        Prop: {store.NOMBRE_1} {store.APELLIDO_1 || ''}
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-600">
                    {store.NIT ? Math.floor(store.NIT) : 'N/A'}
                  </td>
                  <td className="p-3 font-semibold text-indigo-900">
                    {cleanBarrioName(store.BARRIO_COMERCIAL)}
                  </td>
                  <td className="p-3 text-slate-600 max-w-[200px] truncate" title={store.DIR_COMERCIAL}>
                    {store.DIR_COMERCIAL}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                        store.ULT_AÑO_REN === 2026
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : store.ULT_AÑO_REN === 2025
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : store.ULT_AÑO_REN === 2024
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {store.ULT_AÑO_REN === 2026 ? (
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {store.ULT_AÑO_REN || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded text-[10px]">
                      {store.TIPO_RS === 'PERSONA_NATURAL'
                        ? 'Natural'
                        : store.TIPO_RS === 'NOMBRE_COMERCIAL'
                        ? 'Nom. Comercial'
                        : 'Jurídica'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStore(store);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Ver Ficha Detallada"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Mostrando <span className="font-bold">{startIndex + 1}</span> a{' '}
          <span className="font-bold">{Math.min(startIndex + pageSize, sortedRecords.length)}</span> de{' '}
          <span className="font-bold">{sortedRecords.length}</span> registros
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-semibold">
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
