'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginSchema, LoginFormInputs } from '@/lib/validation';
import { useAuth } from '@/hooks/use-auth';
import { fetchClient } from '@/lib/api-client';
import { useTranslations } from 'next-intl';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error: authError } = useAuth();
  const t = useTranslations('Auth.login');

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetchClient<{ url: string }>('/api/v1/auth/login/google', {
        requiresAuth: false,
      });
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No se recibió la URL de redirección');
      }
    } catch (error) {
      console.error('Error fetching Google login URL:', error);
      // We can use the already existing authError logic or just console.error
      // Let's assume the user might have deactivated it as mentioned.
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
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
        <span className="font-medium">{t('google_button')}</span>
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{t('or')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {authError ? (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-foreground font-medium">
            {t('email_label')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t('email_placeholder')}
              className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...register('email')}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-foreground font-medium">
            {t('password_label')}
          </Label>
          <PasswordInput
            id="password"
            placeholder={t('password_placeholder')}
            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('password')}
            disabled={isSubmitting}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-end text-xs mt-2">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-primary hover:underline font-medium disabled:text-muted-foreground disabled:cursor-not-allowed px-1"
            disabled={isSubmitting}
          >
            {t('forgot_password')}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-medium h-10 shadow-md shadow-primary/30 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </form>
    </div>
  );
}
