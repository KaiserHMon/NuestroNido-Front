'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { NotesSection } from '@/components/notes-section';

export default function NotesPage() {
  return (
    <DashboardLayout activeSection="notes">
      <NotesSection />
    </DashboardLayout>
  );
}
