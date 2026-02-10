/**
 * Tipos y interfaces compartidas para la aplicación NuestroNido
 */

// ============ AUTENTICACIÓN ============
export interface Level {
  id?: string;
  name: string;
  level_number: number;
  required_progress: number;
  image_url?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email?: string;
  familiaId?: string;
  color?: ColorMiembro;
  experience_points: number;
  nivel?: Level;
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
  experience_points: number;
  nivel?: Level;
  rolId: 'creador' | 'miembro' | 'member';
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
  title: string | null;
  content: string | null;
  family_id: string;
  user_id: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  user: {
    id: string;
    name: string;
    experience_points: number;
    level?: Level;
    color?: {
      id: string;
      name: string;
      bg: string;
    };
  };
}

export interface CrearNotaRequest {
  title: string;
  content: string;
  family_id: string;
}

export interface ActualizarNotaRequest {
  title?: string;
  content?: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  tipoFecha?: 'fecha' | 'dias';
  fecha?: string; // ISO 8601 string: due_date
  endDate?: string; // ISO 8601 string: end_date
  diasSemana?: string[]; // ["1", "3"] para Lunes y Miércoles
  hora?: string; // Opcional: "14:30"
  creadorId: string;
  colorCreador: ColorMiembro;
  prioridad?: 'baja' | 'media' | 'alta';
  frecuencia?: 'unica' | 'diaria' | 'semanal' | 'mensual' | 'anual';
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly';
  completada: boolean;
  miembrosAsignados?: string[];
  familiaId: string;
  createdAt?: string;
  updatedAt?: string;
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
    imageUrl?: string;
  };
  experience_points: number;
  nivel: Level;
  nextLevel?: Level; // To help calculate progress
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
  details?: Record<string, unknown>;
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
  levels: Level[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  crearFamilia: (nombre: string) => Promise<void>;
  unirseAFamilia: (codigo: string) => Promise<void>;
  unirsePorLink: (token: string) => Promise<void>;
  actualizarFamilia: (familiaId: string, nombre: string) => Promise<void>;
  eliminarFamilia: (familiaId: string) => Promise<void>;
  refreshFamily: () => Promise<void>;
}
