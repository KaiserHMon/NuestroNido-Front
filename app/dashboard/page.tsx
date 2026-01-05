'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, ShoppingCart, StickyNote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const shortcuts = [
    {
      title: 'Miembros',
      description: 'Gestiona los miembros de tu familia',
      icon: Users,
      href: '/dashboard/miembros',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Calendario',
      description: 'Eventos y fechas importantes',
      icon: Calendar,
      href: '/dashboard/calendario',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Lista',
      description: 'Tareas y compras pendientes',
      icon: ShoppingCart,
      href: '/dashboard/lista',
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'Notas',
      description: 'Notas y apuntes familiares',
      icon: StickyNote,
      href: '/dashboard/notas',
      color: 'bg-purple-500/10 text-purple-600',
    },
  ];

  return (
    <DashboardLayout activeSection="overview">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Bienvenido</h2>
          <p className="text-muted-foreground">Selecciona una sección para empezar</p>
        </div>

        {/* Grid de Secciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link key={shortcut.href} href={shortcut.href}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
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
                      Abrir <ArrowRight className="w-3 h-3 ml-1" />
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
