'use client';

import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Task } from '@/lib/types';
import { TasksTab } from '@/components/tasks-tab';
import { ExpandedDateModal } from '@/components/expanded-date-modal';
import { CreateTaskDialog } from '@/components/dialogs/create-task-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SectionSkeleton } from '@/components/ui/section-skeleton';
import { useCalendarManager } from '@/hooks/use-calendar-manager';

const CalendarGrid = dynamic(
  () => import('@/components/calendar-grid').then((mod) => mod.CalendarGrid),
  {
    loading: () => <div className="h-80 animate-pulse bg-muted rounded-xl" />,
    ssr: false,
  }
);

export function CalendarSection() {
  const t = useTranslations('Dashboard.calendar');
  const locale = useLocale();
  const dateLocale = locale === 'en' ? enUS : es;

  const {
    user,
    family,
    tasks,
    loading,
    currentMonth,
    selectedDate,
    setSelectedDate,
    isNewTaskOpen,
    setIsNewTaskOpen,
    taskToEdit,
    setTaskToEdit,
    taskToDelete,
    setTaskToDelete,
    monthStart,
    daysInMonth,
    getColorsForDay,
    nextMonth,
    prevMonth,
    handleCreateTask,
    handleSaveEdit,
    handleEditTask,
    handleDeleteTask,
    handleToggleCompleted,
    isTaskOnDay,
  } = useCalendarManager();

  if (loading && tasks.length === 0) return <SectionSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button
          className="bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 active:scale-95 sm:w-auto w-full"
          onClick={() => {
            setTaskToEdit(undefined);
            setIsNewTaskOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('new_task')}
        </Button>
      </div>

      <Tabs defaultValue="calendario" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="calendario" className="text-sm">
            {t('tab_calendar')}
          </TabsTrigger>
          <TabsTrigger value="mis-tareas" className="text-sm">
            {t('tab_my_tasks')}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="calendario"
          className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevMonth}
                  className="h-8 w-8 p-0"
                  aria-label={t('prev_month')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-sm capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextMonth}
                  className="h-8 w-8 p-0"
                  aria-label={t('next_month')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {family && family.members.length > 0 && (
                <div className="mb-3 pb-2 border-b border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {family.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-1 text-xs">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: member.color.bg }}
                        />
                        <span className="text-muted-foreground text-xs">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <CalendarGrid
                daysInMonth={daysInMonth}
                startOffset={monthStart.getDay()}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                getColorsForDay={getColorsForDay}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="mis-tareas"
          className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <TasksTab
                tasks={tasks}
                members={family?.members || []}
                initialFilter="unicas"
                onEdit={handleEditTask}
                onDelete={(id: string) => setTaskToDelete(id)}
                onToggleCompleted={handleToggleCompleted}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ExpandedDateModal
        date={selectedDate}
        tasks={selectedDate ? tasks.filter((t) => isTaskOnDay(t, selectedDate)) : []}
        members={family?.members || []}
        onClose={() => setSelectedDate(null)}
        onToggleCompleted={handleToggleCompleted}
        currentUserId={user?.id}
      />

      <CreateTaskDialog
        open={isNewTaskOpen || !!taskToEdit}
        onOpenChange={(open: boolean) => {
          if (!open) setTaskToEdit(undefined);
          setIsNewTaskOpen(open);
        }}
        onSubmit={taskToEdit ? handleSaveEdit : handleCreateTask}
        taskToEdit={
          taskToEdit
            ? {
                title: taskToEdit.title,
                dateType: taskToEdit.dateType || 'date',
                date: taskToEdit.date ? new Date(taskToEdit.date) : undefined,
                daysOfWeek: taskToEdit.daysOfWeek,
                recurrence: taskToEdit.validity || 'once',
                assignedTo: taskToEdit.creatorId,
              }
            : undefined
        }
        members={family?.members || []}
        currentUserId={user?.id}
      />

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

