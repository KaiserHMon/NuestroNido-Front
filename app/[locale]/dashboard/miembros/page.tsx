'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { MembersSection } from '@/components/members-section';

export default function MembersPage() {
  return (
    <DashboardLayout activeSection="members">
      <MembersSection />
    </DashboardLayout>
  );
}
