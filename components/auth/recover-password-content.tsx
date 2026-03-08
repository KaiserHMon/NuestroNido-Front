'use client';

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { useTranslations } from 'next-intl';

export function RecoverPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('Auth.reset_password');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/nuestro-nido-logo.png" alt="NuestroNido Logo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">{t('title')}</p>
        </div>

        <div className="bg-card rounded-lg shadow-md border border-border p-6 sm:p-8">
          <ResetPasswordForm token={token || undefined} />
        </div>

        <div className="text-center mt-6 text-xs sm:text-sm text-muted-foreground">
          <p>{t('subtitle')}</p>
        </div>
      </div>
    </div>
  );
}
