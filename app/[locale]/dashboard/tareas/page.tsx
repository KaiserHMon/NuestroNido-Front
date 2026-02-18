'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { CalendarSection } from '@/components/calendar-section';

export default function CalendarPage() {
  return (
    <DashboardLayout activeSection="calendar">
      <CalendarSection />
    </DashboardLayout>
  );
}
