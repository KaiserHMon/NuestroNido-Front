'use client';

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export function RecoverPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.png" alt="NuestroNido Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif-custom italic">NuestroNido</h1>
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
