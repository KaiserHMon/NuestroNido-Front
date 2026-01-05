'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { NotasSection } from '@/components/notas-section';

export default function NotasPage() {
  return (
    <DashboardLayout activeSection="notas">
      <NotasSection />
    </DashboardLayout>
  );
}
