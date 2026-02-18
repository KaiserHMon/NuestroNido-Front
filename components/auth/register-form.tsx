'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox as _Checkbox } from '@/components/ui/checkbox';
import { RegisterSchema, RegisterFormInputs } from '@/lib/validation';
import { useAuth } from '@/hooks/use-auth';
import { fetchClient } from '@/lib/api-client';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser, error: authError } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const response = await fetchClient<{ url: string }>('/api/v1/auth/login/google', {
        requiresAuth: false,
      });
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Error fetching Google login URL:', error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(RegisterSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password);
      onSuccess?.();
    } catch {
      // Handled by auth state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 h-10 bg-background hover:bg-muted text-foreground border-input"
        disabled={isSubmitting}
      >
        <GoogleIcon className="w-5 h-5" />
        <span className="font-medium">Continuar con Google</span>
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {authError ? (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-foreground font-medium">
            Nombre Completo
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Juan García"
              className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...register('name')}
              disabled={isSubmitting}
            />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
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

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-foreground font-medium">
            Contraseña
          </Label>
          <PasswordInput
            id="password"
            placeholder="Ingresa tu contraseña"
            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('password')}
            disabled={isSubmitting}
          />
          {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
          {!password ? (
            <p className="text-xs text-muted-foreground">
              Mínimo 8 caracteres, mayúsculas, números y símbolos
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="passwordConfirm" className="text-foreground font-medium">
            Confirmar Contraseña
          </Label>
          <PasswordInput
            id="passwordConfirm"
            placeholder="Confirma tu contraseña"
            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('passwordConfirm')}
            disabled={isSubmitting}
          />
          {errors.passwordConfirm && (
            <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-medium h-10 shadow-md shadow-primary/30 transition-all duration-300 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </Button>
      </form>
    </div>
  );
}
