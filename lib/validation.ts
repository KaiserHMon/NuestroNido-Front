/**
 * Validaciones y esquemas para formularios usando Zod
 */

import { z } from 'zod';

// ============ AUTENTICACIÓN ============
export const LoginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .min(1, 'La contraseña es requerida'),
});

export const RegisterSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .trim()
      .min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido').min(1, 'El email es requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .min(1, 'La contraseña es requerida'),
    passwordConfirm: z.string().min(1, 'Confirmar contraseña es requerido'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  });

export type LoginFormInputs = z.infer<typeof LoginSchema>;
export type RegisterFormInputs = z.infer<typeof RegisterSchema>;

// ============ FAMILIA ============
export const CrearFamiliaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim()
    .min(1, 'El nombre es requerido'),
});

export const UnirseAFamiliaSchema = z.object({
  codigoInvitacion: z
    .string()
    .min(6, 'El código debe tener al menos 6 caracteres')
    .max(8, 'El código no puede exceder 8 caracteres')
    .toUpperCase()
    .min(1, 'El código es requerido'),
});

export const ActualizarFamiliaSchema = z.object({
  nuevoNombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim()
    .min(1, 'El nombre es requerido'),
});

export const EliminarFamiliaSchema = z
  .object({
    confirmacionTexto: z.string().min(1, 'Debes confirmar escribiendo el nombre de la familia'),
    nombreFamilia: z.string(),
  })
  .refine((data) => data.confirmacionTexto === data.nombreFamilia, {
    message: 'El nombre de la familia no coincide',
    path: ['confirmacionTexto'],
  });

export type CrearFamiliaFormInputs = z.infer<typeof CrearFamiliaSchema>;
export type UnirseAFamiliaFormInputs = z.infer<typeof UnirseAFamiliaSchema>;
export type ActualizarFamiliaFormInputs = z.infer<typeof ActualizarFamiliaSchema>;
export type EliminarFamiliaFormInputs = z.infer<typeof EliminarFamiliaSchema>;

// ============ MIEMBROS ============
export const CrearMiembroSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim()
    .min(1, 'El nombre es requerido'),
});

export type CrearMiembroFormInputs = z.infer<typeof CrearMiembroSchema>;

// ============ NOTAS ============
export const CrearNotaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  contenido: z
    .string()
    .min(1, 'El contenido es requerido')
    .max(5000, 'El contenido no puede exceder 5000 caracteres'),
  fecha: z.date().min(new Date(), 'La fecha debe ser en el futuro o hoy'),
  membrosAsignados: z.array(z.string()).optional(),
  prioritad: z.enum(['low', 'medium', 'high']).optional(),
});

export type CrearNotaFormInputs = z.infer<typeof CrearNotaSchema>;

// ============ VALIDACIONES PERSONALIZADAS ============
/**
 * Validar fortaleza de contraseña
 * Retorna: 'weak' | 'medium' | 'strong'
 */
export const validarFortalezaContraseña = (password: string): 'weak' | 'medium' | 'strong' => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'medium';
  return 'strong';
};

/**
 * Validar formato de código de invitación
 */
export const validarFormatoCodigoInvitacion = (codigo: string): boolean => {
  const regex = /^[A-Z0-9]{6,8}$/;
  return regex.test(codigo.toUpperCase());
};

/**
 * Generar código de invitación aleatorio
 */
export const generarCodigoInvitacion = (): string => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  const longitud = 7;

  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  return codigo;
};
