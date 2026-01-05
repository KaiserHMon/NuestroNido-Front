'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { ListaSection } from '@/components/lista-section';

export default function ListaPage() {
  return (
    <DashboardLayout activeSection="lista">
      <ListaSection />
    </DashboardLayout>
  );
}
