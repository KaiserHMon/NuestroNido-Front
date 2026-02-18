import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .min(1, 'La contraseña es requerida'),
});

export const RegisterSchema = z
  .object({
    name: z
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

export const CreateFamilySchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim()
    .min(1, 'El nombre es requerido'),
});

export const JoinFamilySchema = z.object({
  invitationCode: z
    .string()
    .min(6, 'El código debe tener al menos 6 caracteres')
    .max(8, 'El código no puede exceder 8 caracteres')
    .toUpperCase()
    .min(1, 'El código es requerido'),
});

export const UpdateFamilySchema = z.object({
  newName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim()
    .min(1, 'El nombre es requerido'),
});

export const DeleteFamilySchema = z
  .object({
    confirmationText: z.string().min(1, 'Debes confirmar escribiendo el nombre de la familia'),
    familyName: z.string(),
  })
  .refine((data) => data.confirmationText === data.familyName, {
    message: 'El nombre de la familia no coincide',
    path: ['confirmationText'],
  });

export type CreateFamilyFormInputs = z.infer<typeof CreateFamilySchema>;
export type JoinFamilyFormInputs = z.infer<typeof JoinFamilySchema>;
export type UpdateFamilyFormInputs = z.infer<typeof UpdateFamilySchema>;
export type DeleteFamilyFormInputs = z.infer<typeof DeleteFamilySchema>;

export const CreateMemberSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim()
    .min(1, 'El nombre es requerido'),
});

export type CreateMemberFormInputs = z.infer<typeof CreateMemberSchema>;

export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(50, 'El título no puede exceder 50 caracteres'),
  content: z
    .string()
    .min(1, 'El contenido es requerido')
    .max(500, 'El contenido no puede exceder 500 caracteres'),
});

export type CreateNoteFormInputs = z.infer<typeof CreateNoteSchema>;

export const validatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
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

export const validateInvitationCodeFormat = (code: string): boolean => {
  const regex = /^[A-Z0-9]{6,8}$/;
  return regex.test(code.toUpperCase());
};

export const generateInvitationCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 7;
  const array = new Uint32Array(length);
  globalThis.crypto.getRandomValues(array);

  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(array[i] % characters.length);
  }
  return code;
};
