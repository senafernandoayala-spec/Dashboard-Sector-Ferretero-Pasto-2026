export interface FerreteriaRecord {
  MATRICULA: number;
  RAZON_SOCIAL: string;
  NOMBRE_1: string | null;
  APELLIDO_1: string | null;
  NIT: number | null;
  ULT_AÑO_REN: number | null;
  DIR_COMERCIAL: string;
  BARRIO_COMERCIAL: string | null;
  MUN_COMERCIAL: string;
  EMAIL_COMERCIAL: string;
  CIIU_1: string | null;
  CIIU_2: string | null;
  CIIU_3: string | null;
  CIIU_4: string | null;
  ACTIVIDAD: string | null;
  TIPO_RS: 'PERSONA_NATURAL' | 'NOMBRE_COMERCIAL' | string;
  // Computed properties
  lat?: number;
  lng?: number;
  comunaOrSector?: string;
  estadoRenovacion?: 'Al Día (2026)' | 'Renovado (2025)' | 'Pendiente (2024)' | 'Inactivo (≤2023)';
}

export interface FilterState {
  searchTerm: string;
  añoRenovacion: string; // 'ALL' | '2026' | '2025' | '2024' | '2023' | 'ANTERIORES'
  tipoRS: string; // 'ALL' | 'PERSONA_NATURAL' | 'NOMBRE_COMERCIAL' | 'JURIDICA'
  barrio: string[]; // Changed to string[]
  comunaSector: string[]; // Changed to string[]
  ciiuTipo: string; // 'ALL' | 'G4752' | 'G4663' | 'OTROS'
  estadoRenovacion: string; // 'ALL' | 'ACTIVO' | 'PENDIENTE' | 'INACTIVO'
}

export interface ScheduledReport {
  id: string;
  nombre: string;
  destinatarioEmail: string;
  frecuencia: 'Diario' | 'Semanal' | 'Mensual' | 'Trimestral';
  formato: 'PDF' | 'Excel' | 'Ambos';
  filtroAplicado: string;
  proximaEntrega: string;
  estado: boolean;
  creadoEn: string;
}

export interface DashboardStats {
  total: number;
  totalRenovado2026: number;
  totalRenovado2025: number;
  totalVencidos: number;
  porcentajeAlDia: number;
  totalPersonaNatural: number;
  totalNombreComercial: number;
  totalJuridicaSAS: number;
  topBarrios: { barrio: string; count: number }[];
  porAnoRenovacion: { ano: string; count: number }[];
  porTipoRS: { tipo: string; count: number }[];
  porCIIU: { ciiu: string; label: string; count: number }[];
}
