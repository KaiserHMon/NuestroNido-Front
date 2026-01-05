'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { MiembrosSection } from '@/components/miembros-section';

export default function MiembrosPage() {
  return (
    <DashboardLayout activeSection="miembros">
      <MiembrosSection />
    </DashboardLayout>
  );
}
