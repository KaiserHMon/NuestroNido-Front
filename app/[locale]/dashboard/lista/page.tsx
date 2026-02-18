'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { ListSection } from '@/components/list-section';

export default function ListPage() {
  return (
    <DashboardLayout activeSection="list">
      <ListSection />
    </DashboardLayout>
  );
}
