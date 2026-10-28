import { FerreteriaRecord } from '../types/ferreteria';

// Base coordinates for Pasto comunas and sectors
const SECTOR_COORDINATES: Record<string, { lat: number; lng: number; comuna: string }> = {
  'CENTRO': { lat: 1.2138, lng: -77.2811, comuna: 'Comuna 1 - Centro' },
  'AMERICAS': { lat: 1.2105, lng: -77.2785, comuna: 'Comuna 1 - Centro/Américas' },
  'LAS AMERICAS': { lat: 1.2105, lng: -77.2785, comuna: 'Comuna 1 - Centro/Américas' },
  'SAN ANDRES': { lat: 1.2155, lng: -77.2830, comuna: 'Comuna 1 - San Andrés' },
  'BOMBONA': { lat: 1.2160, lng: -77.2780, comuna: 'Comuna 1 - Bomboná' },
  'LA PANADERIA': { lat: 1.2120, lng: -77.2790, comuna: 'Comuna 1 - La Panadería' },
  'NAVARRETE': { lat: 1.2088, lng: -77.2770, comuna: 'Comuna 1 - Navarrete' },
  
  'SAN IGNACIO': { lat: 1.2205, lng: -77.2815, comuna: 'Comuna 2 - San Ignacio' },
  'LAS CUADRAS': { lat: 1.2235, lng: -77.2825, comuna: 'Comuna 2 - Las Cuadras' },
  'LA AURORA': { lat: 1.2255, lng: -77.2800, comuna: 'Comuna 2 - La Aurora' },
  'MARIDIAZ': { lat: 1.2220, lng: -77.2845, comuna: 'Comuna 2 - Maridíaz' },
  'SAN FELIPE': { lat: 1.2185, lng: -77.2855, comuna: 'Comuna 2 - San Felipe' },
  
  'FATIMA': { lat: 1.2055, lng: -77.2740, comuna: 'Comuna 3 - Fátima' },
  'LAS LUNAS': { lat: 1.2040, lng: -77.2725, comuna: 'Comuna 3 - Las Lunas' },
  'LAS LUNAS I': { lat: 1.2040, lng: -77.2725, comuna: 'Comuna 3 - Las Lunas' },
  'LAS LUNAS II': { lat: 1.2025, lng: -77.2715, comuna: 'Comuna 3 - Las Lunas' },
  'JULIAN BUCHELI': { lat: 1.2075, lng: -77.2755, comuna: 'Comuna 3 - Julián Bucheli' },
  'EL RECUERDO': { lat: 1.2090, lng: -77.2760, comuna: 'Comuna 3 - El Recuerdo' },
  'EL PILAR': { lat: 1.2015, lng: -77.2705, comuna: 'Comuna 3 - El Pilar' },
  'AVENIDA BOYACA': { lat: 1.2065, lng: -77.2770, comuna: 'Comuna 3 - Av. Boyacá' },
  
  'SAN JOSE OBRERO': { lat: 1.2005, lng: -77.2680, comuna: 'Comuna 4 - San José Obrero' },
  'OBRERO': { lat: 1.2005, lng: -77.2680, comuna: 'Comuna 4 - San José Obrero' },
  'MERCEDARIO': { lat: 1.1985, lng: -77.2660, comuna: 'Comuna 4 - Mercedario' },
  'LORENZO DE ALDANA': { lat: 1.1995, lng: -77.2640, comuna: 'Comuna 4 - Lorenzo' },
  'LORENZO': { lat: 1.1995, lng: -77.2640, comuna: 'Comuna 4 - Lorenzo' },
  'SANTA BARBARA': { lat: 1.1970, lng: -77.2625, comuna: 'Comuna 4 - Santa Bárbara' },
  'CORAZON DE JESUS': { lat: 1.2020, lng: -77.2690, comuna: 'Comuna 4 - Corazón de Jesús' },
  
  'CHAPAL': { lat: 1.1945, lng: -77.2750, comuna: 'Comuna 5 - Chapal' },
  'CHAPAL I': { lat: 1.1945, lng: -77.2750, comuna: 'Comuna 5 - Chapal' },
  'LAS VIOLETAS': { lat: 1.1965, lng: -77.2730, comuna: 'Comuna 5 - Las Violetas' },
  'LAS VIOLETAS I': { lat: 1.1965, lng: -77.2730, comuna: 'Comuna 5 - Las Violetas' },
  'LAS VIOLETAS III': { lat: 1.1950, lng: -77.2720, comuna: 'Comuna 5 - Las Violetas' },
  'LA ROSA': { lat: 1.1925, lng: -77.2710, comuna: 'Comuna 5 - La Rosa' },
  'EL TEJAR': { lat: 1.1910, lng: -77.2680, comuna: 'Comuna 5 - El Tejar' },
  
  'TAMASAGRA': { lat: 1.1995, lng: -77.2905, comuna: 'Comuna 6 - Tamasagra' },
  'TAMASAGRA I': { lat: 1.1995, lng: -77.2905, comuna: 'Comuna 6 - Tamasagra' },
  'VILLA FLOR': { lat: 1.1970, lng: -77.2885, comuna: 'Comuna 6 - Villa Flor' },
  'VILLA FLOR I': { lat: 1.1970, lng: -77.2885, comuna: 'Comuna 6 - Villa Flor' },
  'VILLA FLOR II': { lat: 1.1955, lng: -77.2870, comuna: 'Comuna 6 - Villa Flor' },
  'CHAMBU': { lat: 1.1935, lng: -77.2855, comuna: 'Comuna 6 - Chambú' },
  'CHAMBU I': { lat: 1.1935, lng: -77.2855, comuna: 'Comuna 6 - Chambú' },
  'LA ESMERALDA': { lat: 1.2010, lng: -77.2880, comuna: 'Comuna 6 - La Esmeralda' },
  
  'PANDIACO': { lat: 1.2285, lng: -77.2890, comuna: 'Comuna 7 - Pandiaco' },
  'PALERMO': { lat: 1.2315, lng: -77.2875, comuna: 'Comuna 7 - Palermo' },
  'MORASURCO': { lat: 1.2345, lng: -77.2860, comuna: 'Comuna 7 - Morasurco' },
  'TOROBAJO': { lat: 1.2370, lng: -77.2920, comuna: 'Comuna 7 - Torobajo' },
  'ALTOS DE LA COLINA': { lat: 1.2260, lng: -77.2950, comuna: 'Comuna 7 - Altos de la Colina' },
  'LA COLINA': { lat: 1.2260, lng: -77.2950, comuna: 'Comuna 7 - La Colina' },

  'MIJITAYO': { lat: 1.2185, lng: -77.2965, comuna: 'Comuna 8 - Mijitayo' },
  'ANGANOY': { lat: 1.2145, lng: -77.3030, comuna: 'Comuna 8 - Anganoy' },
  'SAN DIEGO': { lat: 1.2110, lng: -77.2990, comuna: 'Comuna 8 - San Diego' },
  'SAN VICENTE': { lat: 1.2170, lng: -77.2930, comuna: 'Comuna 8 - San Vicente' },
  'MARILUZ III': { lat: 1.2225, lng: -77.2980, comuna: 'Comuna 8 - Mariluz' },
  'MARILUZ I': { lat: 1.2225, lng: -77.2980, comuna: 'Comuna 8 - Mariluz' },

  'CATAMBUCO': { lat: 1.1730, lng: -77.2890, comuna: 'Corregimiento - Catambuco' },
  'CAICEDO': { lat: 1.1730, lng: -77.2890, comuna: 'Corregimiento - Catambuco' },
  'OBONUCO': { lat: 1.2080, lng: -77.3110, comuna: 'Corregimiento - Obonuco' },
  'SALSIPUEDES': { lat: 1.2080, lng: -77.3110, comuna: 'Corregimiento - Obonuco' },
  'GENOY': { lat: 1.2580, lng: -77.3400, comuna: 'Corregimiento - Genoy' },
  'EL ENCANO': { lat: 1.1680, lng: -77.1510, comuna: 'Corregimiento - El Encano' },
  'EL ALJIBE': { lat: 1.1680, lng: -77.1510, comuna: 'Corregimiento - El Encano' },
  'BUESAQUILLO': { lat: 1.2280, lng: -77.2550, comuna: 'Corregimiento - Buesaquillo' },
  'SENA': { lat: 1.2280, lng: -77.2550, comuna: 'Corregimiento - Buesaquillo (SENA Lope)' },
  'BRICEÑO': { lat: 1.2250, lng: -77.3080, comuna: 'Corregimiento - Briceño/Mapachico' }
};

// Deterministic Pseudo-Random Generator based on Matricula
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function enrichFerreteriaData(rawList: FerreteriaRecord[]): FerreteriaRecord[] {
  return rawList.map((item) => {
    const barrioRaw = item.BARRIO_COMERCIAL ? item.BARRIO_COMERCIAL.toUpperCase() : '';
    const dirRaw = item.DIR_COMERCIAL ? item.DIR_COMERCIAL.toUpperCase() : '';
    
    // Determine status
    let estadoRenovacion: FerreteriaRecord['estadoRenovacion'] = 'Inactivo (≤2023)';
    if (item.ULT_AÑO_REN === 2026) {
      estadoRenovacion = 'Al Día (2026)';
    } else if (item.ULT_AÑO_REN === 2025) {
      estadoRenovacion = 'Renovado (2025)';
    } else if (item.ULT_AÑO_REN === 2024) {
      estadoRenovacion = 'Pendiente (2024)';
    }

    // Determine base coordinate & Comuna
    let baseLoc = { lat: 1.2136, lng: -77.2811, comuna: 'Comuna Central' };
    
    let matched = false;
    for (const [key, coords] of Object.entries(SECTOR_COORDINATES)) {
      if (barrioRaw.includes(key) || dirRaw.includes(key)) {
        baseLoc = coords;
        matched = true;
        break;
      }
    }

    if (!matched) {
      if (barrioRaw.includes('LUNAS') || dirRaw.includes('LUNAS')) {
        baseLoc = SECTOR_COORDINATES['LAS LUNAS'];
      } else if (barrioRaw.includes('SANTIAGO') || dirRaw.includes('SANTIAGO')) {
        baseLoc = { lat: 1.2100, lng: -77.2820, comuna: 'Comuna 1 - Santiago' };
      } else if (barrioRaw.includes('AMERICA') || dirRaw.includes('AMERICA')) {
        baseLoc = SECTOR_COORDINATES['LAS AMERICAS'];
      }
    }

    // Add tiny deterministic dispersion so markers in same barrio don't stack completely
    const seed = item.MATRICULA || 12345;
    const offsetLat = (pseudoRandom(seed) - 0.5) * 0.006;
    const offsetLng = (pseudoRandom(seed + 99) - 0.5) * 0.006;

    return {
      ...item,
      lat: Number((baseLoc.lat + offsetLat).toFixed(5)),
      lng: Number((baseLoc.lng + offsetLng).toFixed(5)),
      comunaOrSector: baseLoc.comuna,
      estadoRenovacion
    };
  });
}

// Clean string for barrio display
export function cleanBarrioName(rawBarrio: string | null): string {
  if (!rawBarrio) return 'NO ESPECIFICADO';
  // Standard format in JSON is "00606 - CENTRO"
  const parts = rawBarrio.split('-');
  if (parts.length > 1) {
    return parts[1].trim();
  }
  return rawBarrio.trim();
}

// Clean CIIU label
export function cleanCiiuLabel(ciiu: string | null): string {
  if (!ciiu) return 'OTRAS ACTIVIDADES';
  const match = ciiu.match(/^([A-Z0-9]+)\s*\*\*\s*(.*)/);
  if (match) {
    return `${match[1]} - ${match[2].toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}`;
  }
  return ciiu;
}
