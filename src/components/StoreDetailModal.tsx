import React from 'react';
import { FerreteriaRecord } from '../types/ferreteria';
import { cleanBarrioName, cleanCiiuLabel } from '../utils/pastoGeo';
import { 
  X, 
  Building2, 
  MapPin, 
  Mail, 
  Calendar, 
  Award, 
  FileCheck, 
  User, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface StoreDetailModalProps {
  store: FerreteriaRecord | null;
  onClose: () => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({ store, onClose }) => {
  if (!store) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-600 px-2 py-0.5 rounded text-white">
                Matrícula #{store.MATRICULA}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  store.ULT_AÑO_REN === 2026
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : store.ULT_AÑO_REN === 2025
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                Renovado {store.ULT_AÑO_REN || 'N/A'}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white leading-snug">
              {store.RAZON_SOCIAL}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-800 text-xs">
          
          {/* Propietario / Representante */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Propietario / Persona</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600 inline" />
                {store.NOMBRE_1 ? `${store.NOMBRE_1} ${store.APELLIDO_1 || ''}` : 'Persona Jurídica'}
              </p>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">NIT / Cédula</span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                {store.NIT ? Math.floor(store.NIT).toLocaleString('es-CO') : 'Sin NIT'}
              </p>
            </div>
          </div>

          {/* Ubicación Comercial */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Ubicación Comercial (Pasto, Nariño)
            </h4>

            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1.5">
              <p className="flex items-center gap-2 text-slate-800 font-semibold">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{store.DIR_COMERCIAL}</span>
              </p>
              <p className="text-indigo-900 font-medium pl-6">
                Barrio: <strong className="font-bold">{cleanBarrioName(store.BARRIO_COMERCIAL)}</strong>
              </p>
              <p className="text-slate-500 text-[11px] pl-6">
                Sector / Comuna: {store.comunaOrSector || 'San Juan de Pasto (52001)'}
              </p>
            </div>
          </div>

          {/* Actividades Económicas CIIU */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Clasificación CIIU & Actividad Registrada
            </h4>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">CIIU Principal (CIIU 1):</span>
                <p className="font-bold text-slate-900 leading-tight">
                  {cleanCiiuLabel(store.CIIU_1)}
                </p>
              </div>

              {store.ACTIVIDAD && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Descripción de Actividad Comercial:</span>
                  <p className="text-slate-700 leading-relaxed font-normal bg-white p-2 rounded border border-slate-200">
                    {store.ACTIVIDAD}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contacto & Sello Registral */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Correo Comercial:</span>
              <a
                href={`mailto:${store.EMAIL_COMERCIAL}`}
                className="text-blue-700 hover:underline font-bold flex items-center gap-1 mt-0.5"
              >
                <Mail className="w-3.5 h-3.5" />
                {store.EMAIL_COMERCIAL}
              </a>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 block">Tipo de Registro:</span>
              <span className="font-bold text-slate-800">
                {store.TIPO_RS}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 italic">
            Fuente: Base Registral Cámara de Comercio de Pasto
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs transition"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};
