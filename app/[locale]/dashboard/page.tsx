'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

export default function DashboardOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/nido');
  }, [router]);

  return null;
}
