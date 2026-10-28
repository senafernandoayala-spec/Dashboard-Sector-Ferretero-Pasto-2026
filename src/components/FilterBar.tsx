import React from 'react';
import { Search, Filter, X, RefreshCw, CheckCircle2, AlertCircle, Building, MapPin } from 'lucide-react';
import { FilterState } from '../types/ferreteria';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  availableBarrios: string[];
  availableAños: number[];
  availableComunas: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableBarrios,
  availableAños,
  availableComunas,
  totalResults,
}) => {
  const isFiltered =
    filters.searchTerm !== '' ||
    filters.añoRenovacion !== 'ALL' ||
    filters.tipoRS !== 'ALL' ||
    filters.barrio.length > 0 ||
    filters.comunaSector.length > 0 ||
    filters.ciiuTipo !== 'ALL' ||
    filters.estadoRenovacion !== 'ALL';

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm p-4 sticky top-[110px] z-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        
        {/* Top Row: Search Input + Active Filters Indicator */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Razón Social, NIT, Propietario, Dirección..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 placeholder-slate-400"
            />
            {filters.searchTerm && (
              <button
                onClick={() => onFilterChange('searchTerm', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick presets & Clear Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden md:inline">
              Filtros Rápidos:
            </span>
            <button
              onClick={() => onFilterChange('estadoRenovacion', filters.estadoRenovacion === 'ACTIVO' ? 'ALL' : 'ACTIVO')}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition whitespace-nowrap flex items-center gap-1 ${
                filters.estadoRenovacion === 'ACTIVO'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Al Día (2025-2026)</span>
            </button>

            <button
              onClick={() => onFilterChange('ciiuTipo', filters.ciiuTipo === 'G4752' ? 'ALL' : 'G4752')}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition whitespace-nowrap flex items-center gap-1 ${
                filters.ciiuTipo === 'G4752'
                  ? 'bg-blue-100 border-blue-300 text-blue-800 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building className="w-3 h-3 text-blue-600" />
              <span>Minoristas (G4752)</span>
            </button>

            {isFiltered && (
              <button
                onClick={onReset}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full border border-rose-200 transition flex items-center gap-1 whitespace-nowrap"
              >
                <RefreshCw className="w-3 h-3" />
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Select Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          
          {/* Año de Renovación */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Año Renovación
            </label>
            <select
              value={filters.añoRenovacion}
              onChange={(e) => onFilterChange('añoRenovacion', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 text-slate-800"
            >
              <option value="ALL">Todos los Años</option>
              {availableAños.map((ano) => (
                <option key={ano} value={String(ano)}>
                  Año {ano}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Registro (RS) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tipo de Persona / RS
            </label>
            <select
              value={filters.tipoRS}
              onChange={(e) => onFilterChange('tipoRS', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 text-slate-800"
            >
              <option value="ALL">Todos los Tipos</option>
              <option value="PERSONA_NATURAL">Persona Natural</option>
              <option value="NOMBRE_COMERCIAL">Nombre Comercial</option>
              <option value="JURIDICA">Persona Jurídica (SAS / SA)</option>
            </select>
          </div>

          {/* Comuna / Sector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Comuna / Zona</label>
            <div className="relative group">
              <div className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 cursor-pointer truncate hover:bg-white focus-within:ring-2 focus-within:ring-blue-600">
                {filters.comunaSector.length === 0 ? 'Todas las Comunas' : `${filters.comunaSector.length} seleccionadas`}
              </div>
              <div className="absolute top-full left-0 w-full bg-white border border-slate-300 rounded-lg shadow-xl hidden group-hover:block z-50 max-h-48 overflow-y-auto">
                {availableComunas.map((c) => (
                  <label key={c} className="flex items-center gap-2 p-2 hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={filters.comunaSector.includes(c)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...filters.comunaSector, c]
                          : filters.comunaSector.filter((val) => val !== c);
                        onFilterChange('comunaSector', JSON.stringify(newValues));
                      }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Barrio Comercial */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Barrio Comercial</label>
            <div className="relative group">
              <div className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 cursor-pointer truncate hover:bg-white focus-within:ring-2 focus-within:ring-blue-600">
                {filters.barrio.length === 0 ? 'Todos los Barrios' : `${filters.barrio.length} seleccionados`}
              </div>
              <div className="absolute top-full left-0 w-full bg-white border border-slate-300 rounded-lg shadow-xl hidden group-hover:block z-50 max-h-48 overflow-y-auto">
                {availableBarrios.map((b) => (
                  <label key={b} className="flex items-center gap-2 p-2 hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={filters.barrio.includes(b)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...filters.barrio, b]
                          : filters.barrio.filter((val) => val !== b);
                        onFilterChange('barrio', JSON.stringify(newValues));
                      }}
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Clasificación CIIU */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Clasificación CIIU
            </label>
            <select
              value={filters.ciiuTipo}
              onChange={(e) => onFilterChange('ciiuTipo', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 text-slate-800"
            >
              <option value="ALL">Todas las Actividades CIIU</option>
              <option value="G4752">G4752 - Comercio al por menor Ferretería</option>
              <option value="G4663">G4663 - Comercio al por mayor Materiales</option>
              <option value="OTROS">Otras Actividades Especializadas</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
