import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { DashboardStats } from '../types/ferreteria';
import { Building2, PieChart as PieChartIcon, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';

interface ChartsViewProps {
  stats: DashboardStats;
}

const COLORS = ['#39A900', '#2563EB', '#D97706', '#EF4444', '#8B5CF6', '#06B6D4'];

export const ChartsView: React.FC<ChartsViewProps> = ({ stats }) => {
  // Format CIIU stats for display
  const ciiuData = stats.porCIIU.map((item) => ({
    name: item.label,
    value: item.count,
  }));

  // Format Status stats
  const statusData = [
    { name: 'Al Día (2026)', value: stats.totalRenovado2026, color: '#39A900' },
    { name: 'Renovado (2025)', value: stats.totalRenovado2025, color: '#2563EB' },
    { name: 'Pendiente (2024)', value: stats.porAnoRenovacion.find(a => a.ano === '2024')?.count || 0, color: '#D97706' },
    { name: 'Inactivo (≤2023)', value: stats.totalVencidos - (stats.porAnoRenovacion.find(a => a.ano === '2024')?.count || 0), color: '#EF4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Chart 1: Renovación por Año */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Año de Última Renovación Matricular
                </h3>
                <p className="text-xs text-slate-500">
                  Distribución de establecimientos según su último año renovado
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.porAnoRenovacion} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="ano" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} establecimientos`, 'Cantidad']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]}>
                  {stats.porAnoRenovacion.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.ano === '2026'
                          ? '#39A900'
                          : entry.ano === '2025'
                          ? '#2563EB'
                          : entry.ano === '2024'
                          ? '#D97706'
                          : '#EF4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#39A900]"></span> 2026 (Al día)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span> 2025 (Renovado)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> 2024 (Pendiente)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span> ≤2023 (Inactivo)</span>
        </div>
      </div>

      {/* Chart 2: Top 10 Barrios con Mayor Concentración */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Top 10 Barrios con Mayor Densidad Ferretera
              </h3>
              <p className="text-xs text-slate-500">
                Barrios con mayor concentración de locales comerciales
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stats.topBarrios.slice(0, 10)}
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  dataKey="barrio"
                  type="category"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={100}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} locales`, 'Ferreterías']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#39A900" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 text-center font-medium">
          Sectores clave: Centro, Fátima, Las Lunas, Las Américas y San Andrés concentran el mayor flujo comercial.
        </p>
      </div>

      {/* Chart 3: Tipo de Personería / Registro */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Distribución por Tipo de Registro (TIPO_RS)
              </h3>
              <p className="text-xs text-slate-500">
                Persona Natural vs Nombre Comercial vs Personas Jurídicas/SAS
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.porTipoRS}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="tipo"
                  label={(props: any) => `${props.tipo || props.name} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {stats.porTipoRS.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} establecimientos`, 'Total']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Persona Natural: {stats.totalPersonaNatural}</span>
          <span className="font-semibold text-slate-800">Nombre Comercial: {stats.totalNombreComercial}</span>
          <span className="font-semibold text-slate-800">SAS/Jurídica: {stats.totalJuridicaSAS}</span>
        </div>
      </div>

      {/* Chart 4: Clasificación por Actividad CIIU */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Estructura por Tipo de Actividad Económica (CIIU)
              </h3>
              <p className="text-xs text-slate-500">
                Comercio Minorista (G4752) vs Comercio Mayorista (G4663) vs Actividades Conexas
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ciiuData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {ciiuData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} empresas`, 'Total']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 text-center font-medium">
          El sector está compuesto predominantemente por establecimientos minoristas especializados en ferretería y pintura.
        </p>
      </div>

    </div>
  );
};
