'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, ShoppingCart, StickyNote, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const t = useTranslations('Dashboard');

  const shortcuts = [
    {
      title: t('shortcuts.members.title'),
      description: t('shortcuts.members.description'),
      icon: Users,
      href: '/dashboard/miembros' as const,
      color: 'bg-primary text-primary-foreground',
    },
    {
      icon: Calendar,
      title: t('shortcuts.tasks.title'),
      description: t('shortcuts.tasks.description'),
      href: '/dashboard/tareas' as const,
      color: 'bg-primary text-primary-foreground',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: t('shortcuts.shopping.title'),
      description: t('shortcuts.shopping.description'),
      icon: ShoppingCart,
      href: '/dashboard/lista' as const,
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: t('shortcuts.notes.title'),
      description: t('shortcuts.notes.description'),
      icon: StickyNote,
      href: '/dashboard/notas' as const,
      color: 'bg-primary text-primary-foreground',
    },
  ];

  return (
    <DashboardLayout activeSection="overview">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('welcome', { name: user?.name || '' })}
          </h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                aria-label={`${shortcut.title}: ${shortcut.description}`}
              >
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                  <CardHeader className="pb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${shortcut.color} flex items-center justify-center mb-2`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base">{shortcut.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      {shortcut.description}
                    </p>
                    <div className="flex items-center text-primary text-xs font-medium">
                      {t('open')} <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
