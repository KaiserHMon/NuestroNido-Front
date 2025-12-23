'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
});

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Aquí iría la llamada a tu API para enviar el email de recuperación
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el email de recuperación');
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
            ✓ Email enviado exitosamente
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center">
          Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor revisa tu
          bandeja de entrada.
        </p>
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Login
        </Button>
      </div>
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
        <Label htmlFor="email" className="text-foreground font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('email')}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <p className="text-sm text-muted-foreground">
        Ingresa el email asociado a tu cuenta y te enviaremos un enlace para recuperar tu
        contraseña.
      </p>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            'Enviar Enlace'
          )}
        </Button>
      </div>
    </form>
  );
}
