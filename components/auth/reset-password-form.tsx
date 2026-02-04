'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';
import Link from 'next/link';

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetPasswordInputs = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    if (!token) {
      setError('Token inválido o expirado');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al restablecer la contraseña');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            ✓ Contraseña restablecida exitosamente
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center">
          Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión con tu nueva contraseña.
        </p>
        <Link href="/login" className="block">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            Ir al Login
          </Button>
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          El enlace de recuperación es inválido o ha expirado.
          <Link
            href="/login?tab=forgot-password"
            className="block text-primary hover:underline mt-2"
          >
            Solicitar un nuevo enlace de recuperación
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground font-medium">
          Nueva Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('password')}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground font-medium">
          Confirmar Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('confirmPassword')}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Actualizando...
          </>
        ) : (
          'Actualizar Contraseña'
        )}
      </Button>

      <Link href="/login" className="block">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </Link>
    </form>
  );
}
