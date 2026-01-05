/**
 * Tipos y interfaces compartidas para la aplicación NuestroNido
 */

// ============ AUTENTICACIÓN ============
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  familiaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsuarioSession extends Usuario {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  familia?: Familia;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  passwordConfirm: string;
  aceptaTerminos: boolean;
}

export interface RegisterResponse {
  success: boolean;
  usuario: Usuario;
  token: string;
  familia?: Familia;
}

// ============ COLORES ============
export interface ColorMiembro {
  id: string;
  nombre: string;
  bg: string;
  text: string;
  accent: string;
  wcagContrast: number;
}

// ============ FAMILIA ============
export interface Familia {
  id: string;
  nombre: string;
  codigoInvitacion: string;
  creadorId: string;
  miembros: Miembro[];
  plan: 'free' | 'pro';
  maxMiembros?: number;
  maxNotas?: number;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearFamiliaRequest {
  nombre: string;
}

export interface CrearFamiliaResponse {
  success: boolean;
  familia: Familia;
  codigoInvitacion: string;
}

export interface UnirseAFamiliaRequest {
  codigoInvitacion: string;
}

export interface UnirseAFamiliaResponse {
  success: boolean;
  familia: Familia;
  miembro: Miembro;
}

export interface ValidarCodigoRequest {
  codigo: string;
}

export interface ValidarCodigoResponse {
  valido: boolean;
  nombreFamilia?: string;
  miembrosActuales?: number;
  maxMiembros?: number;
  error?: string;
}

export interface ActualizarFamiliaRequest {
  nuevoNombre: string;
}

export interface ActualizarFamiliaResponse {
  success: boolean;
  familia: Familia;
}

export interface EliminarFamiliaRequest {
  confirmacionTexto: string;
}

export interface EliminarFamiliaResponse {
  success: boolean;
  mensaje: string;
}

// ============ MIEMBROS ============
export interface Miembro {
  id: string;
  nombre: string;
  color: ColorMiembro;
  puntos: number;
  rolId: 'creador' | 'miembro';
  familiaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearMiembroRequest {
  nombre: string;
  familiaId: string;
}

export interface EliminarMiembroRequest {
  miembroId: string;
  nuevoCreadorId?: string;
  motivo?: string;
}

export interface EliminarMiembroResponse {
  success: boolean;
  message: string;
  familiaActualizada?: {
    miembros: Miembro[];
    nuevoCreador?: Miembro;
  };
}

// ============ NOTAS ============
export interface Nota {
  id: string;
  contenido: string;
  colorCreador: ColorMiembro;
  fechaCreacion: string; // ISO string
  prioridad?: 'baja' | 'media' | 'alta';
  completado: boolean;
  miembrosAsignados?: string[];
  familiaId: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha: string; // ISO date: "2025-12-10"
  hora?: string; // Opcional: "14:30"
  creadorId: string; // ID del miembro que creó
  colorCreador: ColorMiembro; // Color del creador
  prioridad?: 'baja' | 'media' | 'alta';
  completada: boolean;
  miembrosAsignados?: string[];
  familiaId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearNotaRequest {
  titulo: string;
  contenido: string;
  fecha: Date;
  membrosAsignados: string[];
  prioritad?: 'low' | 'medium' | 'high';
}

export interface ActualizarNotaRequest {
  titulo?: string;
  contenido?: string;
  fecha?: Date;
  membrosAsignados?: string[];
  prioritad?: 'low' | 'medium' | 'high';
  completada?: boolean;
}

// ============ CALENDARIO ============
export interface EventoCalendario {
  id: string;
  notaId: string;
  titulo: string;
  fecha: Date;
  colorMiembro: ColorMiembro;
  nombreMiembro: string;
}

// ============ LEADERBOARD ============
export interface LeaderboardEntry {
  puesto: number;
  miembro: {
    id: string;
    nombre: string;
    color: ColorMiembro;
  };
  puntos: number;
  nivel: {
    numero: number;
    nombre: string;
    progresoActual: number;
    puntosParaSiguiente: number;
  };
  distintivo?: 'oro' | 'plata' | 'bronce';
}

export interface ResumenJugadorEnLeaderboard {
  posicionActual: number;
  totalMiembros: number;
  puntos: number;
  puntosParaSubirUnPuesto: number;
  posicionAnterior?: number;
}

// ============ ERRORES ============
export interface AppError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// ============ API GENÉRICA ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
  message?: string;
}

// ============ CONTEXTO DE AUTENTICACIÓN ============
export interface AuthContextType {
  usuario: Usuario | null;
  familia: Familia | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  crearFamilia: (nombre: string) => Promise<void>;
  unirseAFamilia: (codigo: string) => Promise<void>;
}
