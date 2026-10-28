import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Mail, FileText, FileSpreadsheet, Plus, Trash2, CheckCircle2, Play } from 'lucide-react';
import { ScheduledReport } from '../types/ferreteria';

interface ScheduledReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestReport: (report: ScheduledReport) => void;
}

export const ScheduledReportsModal: React.FC<ScheduledReportsModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestReport,
}) => {
  const [schedules, setSchedules] = useState<ScheduledReport[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [frecuencia, setFrecuencia] = useState<ScheduledReport['frecuencia']>('Semanal');
  const [formato, setFormato] = useState<ScheduledReport['formato']>('Ambos');
  const [successMsg, setSuccessMsg] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('scheduled_ferreteria_reports');
    if (saved) {
      try {
        setSchedules(JSON.parse(saved));
      } catch (e) {
        setSchedules(getInitialSchedules());
      }
    } else {
      const initial = getInitialSchedules();
      setSchedules(initial);
      localStorage.setItem('scheduled_ferreteria_reports', JSON.stringify(initial));
    }
  }, [isOpen]);

  const getInitialSchedules = (): ScheduledReport[] => [
    {
      id: 'sch-1',
      nombre: 'Reporte Semanal de Estado Registral',
      destinatarioEmail: 'camara.pasto@camarapasto.org.co',
      frecuencia: 'Semanal',
      formato: 'Ambos',
      filtroAplicado: 'Todos los registros (Pasto)',
      proximaEntrega: 'Lunes proximo, 08:00 AM',
      estado: true,
      creadoEn: '2026-10-20',
    },
    {
      id: 'sch-2',
      nombre: 'Informe Mensual de Competitividad SENA Lope',
      destinatarioEmail: 'sena.fernandoayala@gmail.com',
      frecuencia: 'Mensual',
      formato: 'PDF',
      filtroAplicado: 'Ferreterías Activas 2026',
      proximaEntrega: '1 de Noviembre, 07:00 AM',
      estado: true,
      creadoEn: '2026-10-22',
    },
  ];

  const saveSchedules = (updated: ScheduledReport[]) => {
    setSchedules(updated);
    localStorage.setItem('scheduled_ferreteria_reports', JSON.stringify(updated));
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) return;

    const newReport: ScheduledReport = {
      id: `sch-${Date.now()}`,
      nombre: nombre.trim(),
      destinatarioEmail: email.trim(),
      frecuencia,
      formato,
      filtroAplicado: 'Filtro Actual del Dashboard',
      proximaEntrega: 'Programada automáticamente',
      estado: true,
      creadoEn: new Date().toISOString().split('T')[0],
    };

    saveSchedules([newReport, ...schedules]);
    setNombre('');
    setEmail('');
    setSuccessMsg('¡Programación de reporte guardada con éxito!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleToggleStatus = (id: string) => {
    const updated = schedules.map((s) => (s.id === id ? { ...s, estado: !s.estado } : s));
    saveSchedules(updated);
  };

  const handleDelete = (id: string) => {
    const updated = schedules.filter((s) => s.id !== id);
    saveSchedules(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Programación de Reportes Automáticos
              </h3>
              <p className="text-xs text-slate-300">
                Cámara de Comercio de Pasto & SENA Regional Nariño
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">

          {/* Form to Add New Schedule */}
          <form onSubmit={handleAddSchedule} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              Nueva Programación de Envío
            </h4>

            {successMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nombre del Reporte</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Consolidado Mensual Ferreterías"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Correo Destinatario</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@camarapasto.org.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Frecuencia</label>
                <select
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Diario">Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestral">Trimestral</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Formato Adjunto</label>
                <select
                  value={formato}
                  onChange={(e) => setFormato(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="PDF">PDF Ejecutivo</option>
                  <option value="Excel">Excel (.xlsx)</option>
                  <option value="Ambos">Ambos Formatos (PDF + Excel)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow transition"
              >
                Activar Programación Automática
              </button>
            </div>
          </form>

          {/* List of Scheduled Reports */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Reportes Programados Activos ({schedules.length})
            </h4>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {schedules.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No hay reportes programados actualmente.
                </p>
              ) : (
                schedules.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{s.nombre}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.estado ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {s.estado ? 'Activo' : 'Pausado'}
                        </span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                          {s.frecuencia} • {s.formato}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>Destino: {s.destinatarioEmail}</span>
                      </p>

                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Próxima entrega: {s.proximaEntrega}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onTriggerTestReport(s)}
                        title="Probar envío ahora"
                        className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Play className="w-3 h-3" />
                        <span>Probar</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(s.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition ${
                          s.estado ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {s.estado ? 'Pausar' : 'Activar'}
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
