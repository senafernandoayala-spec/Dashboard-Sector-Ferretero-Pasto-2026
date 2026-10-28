import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  UserCheck, 
  Building, 
  MapPin, 
  TrendingUp, 
  PieChart as PieChartIcon 
} from 'lucide-react';
import { DashboardStats } from '../types/ferreteria';

interface MetricCardsProps {
  stats: DashboardStats;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  const activeTotal = stats.totalRenovado2026 + stats.totalRenovado2025;
  const topBarrioName = stats.topBarrios.length > 0 ? stats.topBarrios[0].barrio : 'N/A';
  const topBarrioCount = stats.topBarrios.length > 0 ? stats.topBarrios[0].count : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Total Ferreterías */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Establecimientos
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {stats.total.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600 inline" />
            Empresas en Pasto (Base Cámara de Comercio)
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
      </div>

      {/* Card 2: Tasa de Renovación Activa (2025 - 2026) */}
      <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow-md transition flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Estatus Al Día (2025-2026)
            </p>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-black text-emerald-900">
              {activeTotal.toLocaleString()}
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {stats.porcentajeAlDia}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            {stats.totalRenovado2026} en 2026 • {stats.totalRenovado2025} en 2025
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Registros Pendientes o Vencidos */}
      <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Pendientes / Vencidos
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalVencidos.toLocaleString()}
          </h3>
          <p className="text-xs text-amber-700/90 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline" />
            Sin renovación registral reciente (&le;2024)
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Card 4: Top Barrio / Comuna Líder */}
      <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
            Principal Concentración
          </p>
          <h3 className="text-lg font-black text-slate-900 mt-1 truncate max-w-[170px]" title={topBarrioName}>
            {topBarrioName}
          </h3>
          <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 inline" />
            {topBarrioCount} ferreterías en este sector
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
          <MapPin className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
};
