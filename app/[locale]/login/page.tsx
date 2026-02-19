'use client';

import { Suspense } from 'react';
import { Bird } from 'lucide-react';
import { AuthPageContent } from '@/components/auth/auth-page-content';
import { useTranslations } from 'next-intl';

function LoginPageLoading() {
  const t = useTranslations('Auth.common');
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
          <Bird className="w-8 h-8 text-primary-foreground animate-bounce" />
        </div>
        <p className="text-foreground">{t('loading')}</p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <AuthPageContent />
    </Suspense>
  );
}
