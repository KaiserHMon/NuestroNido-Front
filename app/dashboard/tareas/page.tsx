'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { CalendarioSection } from '@/components/calendario-section';

export default function CalendarioPage() {
  return (
    <DashboardLayout activeSection="calendario">
      <CalendarioSection />
    </DashboardLayout>
  );
}
