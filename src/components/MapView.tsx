import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FerreteriaRecord } from '../types/ferreteria';
import { MapPin, Building, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';

// Fix for default Leaflet icon paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Custom Pin Icon Creator
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 26px;
        height: 26px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
  });
};

const iconGreen = createCustomIcon('#39A900');  // 2026
const iconBlue = createCustomIcon('#2563EB');   // 2025
const iconOrange = createCustomIcon('#D97706'); // 2024
const iconRed = createCustomIcon('#EF4444');    // <=2023

interface MapViewProps {
  records: FerreteriaRecord[];
  onSelectStore: (store: FerreteriaRecord) => void;
}

// Recenter component to re-fit map bounds when records change
const RecenterMap: React.FC<{ records: FerreteriaRecord[] }> = ({ records }) => {
  const map = useMap();

  useEffect(() => {
    if (records.length > 0) {
      const validCoords = records
        .filter((r) => r.lat && r.lng)
        .map((r) => [r.lat!, r.lng!] as [number, number]);

      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    } else {
      map.setView([1.2136, -77.2811], 14);
    }
  }, [records, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ records, onSelectStore }) => {
  const mapCenter: [number, number] = [1.2136, -77.2811]; // Pasto, Nariño

  // Limit map markers if dataset is huge for performance (max 300 visible pins on map, or all if filtered)
  const displayRecords = records.length > 400 ? records.slice(0, 400) : records;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      
      {/* Map Header with Legend */}
      <div className="bg-slate-900 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Mapa de Localización de Ferreterías en San Juan de Pasto
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mostrando {displayRecords.length} ubicaciones georreferenciadas según filtros aplicados
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39A900] inline-block"></span>
            2026 Al Día
          </span>
          <span className="flex items-center gap-1.5 font-medium text-blue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block"></span>
            2025 Renovado
          </span>
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block"></span>
            2024 Pendiente
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block"></span>
            &le;2023 Inactivo
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="h-[520px] w-full relative z-10">
        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap records={displayRecords} />

          {displayRecords.map((store) => {
            if (!store.lat || !store.lng) return null;

            let icon = iconRed;
            if (store.ULT_AÑO_REN === 2026) icon = iconGreen;
            else if (store.ULT_AÑO_REN === 2025) icon = iconBlue;
            else if (store.ULT_AÑO_REN === 2024) icon = iconOrange;

            return (
              <Marker
                key={store.MATRICULA}
                position={[store.lat, store.lng]}
                icon={icon}
              >
                <Popup className="pasto-store-popup">
                  <div className="p-1 min-w-[220px]">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        MAT: #{store.MATRICULA}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          store.ULT_AÑO_REN === 2026
                            ? 'bg-emerald-100 text-emerald-800'
                            : store.ULT_AÑO_REN === 2025
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Año {store.ULT_AÑO_REN || 'N/A'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">
                      {store.RAZON_SOCIAL}
                    </h4>

                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mb-1">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{store.DIR_COMERCIAL}</span>
                    </p>

                    <p className="text-[11px] text-indigo-700 font-semibold mb-2">
                      Barrio: {store.BARRIO_COMERCIAL || 'San Juan de Pasto'}
                    </p>

                    <button
                      onClick={() => onSelectStore(store)}
                      className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1 px-2 rounded flex items-center justify-center gap-1 transition"
                    >
                      <span>Ver Ficha Completa</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
};
