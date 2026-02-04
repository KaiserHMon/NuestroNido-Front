'use client';

import { useSearchParams } from 'next/navigation';
import { Bird } from 'lucide-react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export function RecoverPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bird className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">NuestroNido</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">Restablecer Contraseña</p>
        </div>

        <div className="bg-card rounded-lg shadow-md border border-border p-6 sm:p-8">
          <ResetPasswordForm token={token || undefined} />
        </div>

        <div className="text-center mt-6 text-xs sm:text-sm text-muted-foreground">
          <p>Tu contraseña será restablecida de forma segura</p>
        </div>
      </div>
    </div>
  );
}
