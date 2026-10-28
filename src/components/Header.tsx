import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  FileText, 
  Clock, 
  RotateCcw, 
  BarChart3, 
  MapPin, 
  Table, 
  UserCheck, 
  Award, 
  Sparkles 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'metrics' | 'map' | 'table';
  setActiveTab: (tab: 'metrics' | 'map' | 'table') => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onOpenScheduleModal: () => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportExcel,
  onExportPDF,
  onOpenScheduleModal,
  onResetFilters,
  totalFilteredCount,
  totalCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-xl">
      {/* Top Banner with Cámara de Comercio & SENA Logos + Author Badge */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 px-4 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Institutional Logos Area */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            
            {/* Cámara de Comercio de Pasto Badge */}
            <div className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-blue-500/30 px-3.5 py-1.5 rounded-lg shadow-sm transition">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow ring-2 ring-blue-400/40 overflow-hidden">
                <img src="/assets/aistudio/logo-ccpasto_668bd77e.png" alt="Cámara de Comercio de Pasto" className="w-full h-full object-contain p-1" />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold tracking-wide text-blue-200 uppercase">Cámara de Comercio</p>
                <p className="text-[11px] text-amber-300/90 font-medium">de Pasto • Nariño</p>
              </div>
            </div>

            <div className="hidden sm:block text-slate-600 font-light text-xl">|</div>

            {/* SENA Centro Internacional de Producción Limpia Lope Badge with Real Logo */}
            <div className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg shadow-sm transition">
              <div className="w-8 h-8 rounded-full bg-[#39A900] flex items-center justify-center text-white font-black text-xs shadow ring-2 ring-emerald-400/40 overflow-hidden">
                <img src="/assets/aistudio/Logo_SENA_2026_5aebd4bb.jpeg" alt="Logo SENA" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-300">CIPL Lope SENA</p>
                <p className="text-[10px] text-emerald-100/80">Regional Nariño</p>
              </div>
            </div>

          </div>

          {/* Author Badge Requirement */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 via-slate-800/90 to-emerald-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-lg text-center md:text-right">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-200 tracking-tight">
                Elaborado por: <span className="text-white font-extrabold">Edgar Fernando Ayala Quitiaquez</span>
              </p>
              <p className="text-[10px] text-slate-300 flex items-center gap-1 justify-center md:justify-end">
                <UserCheck className="w-3 h-3 text-emerald-400 inline" />
                Instructor de Competitividad y Desarrollo Tecnológico
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Bar with App Title, Stats pill, Navigation & Export Actions */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Title & Filter Stats */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Dashboard del Sector Ferretero</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-medium">
                  San Juan de Pasto
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualización de métricas de rendimiento, distribución geográfica y estatus de renovación registral
            </p>
          </div>

          {/* Filter Status Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-200">
              {totalFilteredCount} <span className="text-slate-400 font-normal">/ {totalCount} registros</span>
            </span>
          </div>
        </div>

        {/* Action Controls & Tab Selector */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-center lg:justify-end">
          
          {/* View Mode Tabs */}
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'metrics'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Métricas
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Mapa Interactivo
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'table'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Directorio ({totalFilteredCount})
            </button>
          </div>

          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

          {/* Export & Programmed Reports Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportExcel}
              title="Exportar vista actual a Excel (.xlsx)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg shadow-sm transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>

            <button
              onClick={onExportPDF}
              title="Exportar reporte ejecutivo en PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg shadow-sm transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={onOpenScheduleModal}
              title="Configurar envíos de reportes programados"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-lg shadow-sm transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reporte Programado</span>
            </button>

            <button
              onClick={onResetFilters}
              title="Limpiar todos los filtros"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
