'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ResetPasswordFormProps {
  token: string | null | undefined;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Auth.reset_password');

  const resetPasswordSchema = z
    .object({
      password: z.string().min(8, t('password_min_length')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwords_mismatch'),
      path: ['confirmPassword'],
    });

  type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleFormSubmit = async (data: ResetPasswordInputs) => {
    if (!token) {
      setError(t('invalid_token'));
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
        throw new Error(errorData.message || t('error_generic'));
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{t('success_title')}</AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center">{t('success_message')}</p>
        <Link href="/login" className="block">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            {t('go_to_login')}
          </Button>
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {t('invalid_token')}
          <Link
            href={{
              pathname: '/login',
              query: { tab: 'forgot-password' },
            }}
            className="block text-primary hover:underline mt-2"
          >
            {t('request_new')}
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground font-medium">
          {t('new_password_label')}
        </Label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          className="bg-background border-input text-foreground placeholder:text-muted-foreground"
          {...register('password')}
          disabled={isSubmitting}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground font-medium">
          {t('confirm_password_label')}
        </Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••"
          className="bg-background border-input text-foreground placeholder:text-muted-foreground"
          {...register('confirmPassword')}
          disabled={isSubmitting}
        />
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
            {t('submitting')}
          </>
        ) : (
          t('submit')
        )}
      </Button>

      <Link href="/login" className="block">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('go_to_login')}
        </Button>
      </Link>
    </form>
  );
}
