'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Task, Member } from '@/lib/types';
import { TasksTab } from '@/components/tasks-tab';
import { ExpandedDateModal } from '@/components/expanded-date-modal';
import { CreateTaskDialog } from '@/components/dialogs/create-task-dialog';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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
import {
  format,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskService } from '@/services/task-service';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { toast } from 'sonner';
import { SectionSkeleton } from '@/components/ui/section-skeleton';

const CalendarGrid = dynamic(
  () => import('@/components/calendar-grid').then((mod) => mod.CalendarGrid),
  {
    loading: () => <div className="h-80 animate-pulse bg-muted rounded-xl" />,
    ssr: false,
  }
);

import { ColorDot } from '@/components/calendar-grid';

interface CreateTaskFormValues {
  title: string;
  dateType: 'date' | 'days';
  date?: Date;
  daysOfWeek?: string[];
  recurrence: 'once' | 'monthly' | 'yearly';
  assignedTo?: string;
}

export function CalendarSection() {
  const { user } = useAuth();
  const { family, refreshFamily } = useFamily();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const membersMap = useMemo(() => {
    if (!family) return new Map<string, Member>();
    return new Map(family.members.map((m) => [m.id, m]));
  }, [family]);

  const fetchTasks = useCallback(async () => {
    if (!family) return;
    try {
      setLoading(true);
      const data = await TaskService.getTasks();

      const mappedTasks: Task[] = data
        .filter((t) => t.assigned_to_user_id && membersMap.has(t.assigned_to_user_id))
        .map((t) => {
          const creatorMember = membersMap.get(t.assigned_to_user_id!)!;
          const color = creatorMember.color;
          const dateType = t.week_days ? 'days' : 'date';

          let frequency: Task['frequency'] = 'once';
          if (t.recurrence_type === 'daily') frequency = 'daily';
          else if (t.recurrence_type === 'weekly') frequency = 'weekly';
          else if (t.recurrence_type === 'monthly') frequency = 'monthly';

          // Detect validity from end_date
          let validity: Task['validity'] = 'once';
          if (t.end_date) {
            const endDate = new Date(t.end_date);
            if (endDate.getMonth() === 11 && endDate.getDate() >= 30) {
              validity = 'yearly';
            } else if (endDate.getDate() >= 27) {
              // Approximate end of month
              validity = 'monthly';
            }
          }

          return {
            id: t.id,
            title: t.title,
            dateType: dateType,
            date: t.due_date,
            endDate: t.end_date || undefined,
            frequency: frequency,
            validity: validity,
            recurrence_type: t.recurrence_type,
            creatorId: t.assigned_to_user_id || '',
            creatorColor: color,
            completed: t.status === 'completed',
            xp_reward: t.xp_reward || undefined,
            familyId: t.family_id,
            daysOfWeek: t.week_days ? t.week_days.split(',') : undefined,
            createdAt: t.created_at,
          };
        });

      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [family, membersMap]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const isTaskOnDay = useCallback((task: Task, day: Date) => {
    const dayOfWeek = day.getDay().toString();
    const startOfTodayDate = new Date();
    startOfTodayDate.setHours(0, 0, 0, 0);

    if (day < startOfTodayDate) return false;

    const startDate = new Date(task.date!);
    startDate.setHours(0, 0, 0, 0);
    if (day < startDate) return false;

    if (task.endDate) {
      const endDate = new Date(task.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (day > endDate) return false;
    }

    if (task.recurrence_type === 'none') return isSameDay(new Date(task.date!), day);
    if (task.recurrence_type === 'daily') return true;
    if (task.recurrence_type === 'weekly' && task.daysOfWeek)
      return task.daysOfWeek.includes(dayOfWeek);
    if (task.recurrence_type === 'monthly') return new Date(task.date!).getDate() === day.getDate();

    return false;
  }, []);

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth]);
  const daysInMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
      }),
    [monthStart, monthEnd]
  );

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    daysInMonth.forEach((day) => {
      const key = format(day, 'yyyy-MM-dd');
      const filtered = tasks.filter((t) => isTaskOnDay(t, day));
      if (filtered.length > 0) map.set(key, filtered);
    });
    return map;
  }, [tasks, daysInMonth, isTaskOnDay]);

  const getColorsForDay = useCallback(
    (day: Date): ColorDot[] => {
      const key = format(day, 'yyyy-MM-dd');
      const dayTasks = tasksByDay.get(key) || [];
      const colors = new Map<string, ColorDot>();
      dayTasks.forEach((task) => {
        const bg = task.creatorColor.bg;
        if (!colors.has(bg)) colors.set(bg, { bg, name: task.creatorColor.name });
      });
      return Array.from(colors.values());
    },
    [tasksByDay]
  );

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleCreateTask = async (data: CreateTaskFormValues) => {
    if (!family || !user) return;
    const due_date = data.date ? data.date.toISOString() : new Date().toISOString();
    let recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly' = 'none';
    if (data.dateType === 'days') recurrence_type = 'weekly';
    else if (data.recurrence === 'monthly') recurrence_type = 'monthly';

    let end_date = null;
    const baseDate = data.date || new Date();
    if (data.recurrence === 'once') {
      if (recurrence_type === 'weekly') {
        const eow = endOfWeek(baseDate, { weekStartsOn: 1 });
        eow.setHours(23, 59, 59, 999);
        end_date = eow.toISOString();
      } else {
        const eod = new Date(baseDate);
        eod.setHours(23, 59, 59, 999);
        end_date = eod.toISOString();
      }
    } else if (data.recurrence === 'monthly') {
      const eom = endOfMonth(baseDate);
      eom.setHours(23, 59, 59, 999);
      end_date = eom.toISOString();
    } else if (data.recurrence === 'yearly') {
      const yearEnd = new Date(baseDate.getFullYear(), 11, 31, 23, 59, 59, 999);
      end_date = yearEnd.toISOString();
    }

    try {
      await TaskService.createTask({
        title: data.title,
        family_id: family.id,
        assigned_to_user_id: data.assignedTo || user.id,
        recurrence_type: recurrence_type,
        week_days:
          data.dateType === 'days' && data.daysOfWeek ? data.daysOfWeek.join(',') : undefined,
        status: 'pending',
        due_date: due_date,
        end_date: end_date || undefined,
      });
      fetchTasks();
      setIsNewTaskOpen(false);
      toast.success('Tarea creada');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const handleSaveEdit = async (data: CreateTaskFormValues) => {
    if (!taskToEdit || !family) return;
    const due_date = data.date ? data.date.toISOString() : new Date().toISOString();
    let recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly' = 'none';
    if (data.dateType === 'days') recurrence_type = 'weekly';
    else if (data.recurrence === 'monthly') recurrence_type = 'monthly';

    let end_date = null;
    const baseDate = data.date || new Date();
    if (data.recurrence === 'once') {
      if (recurrence_type === 'weekly') {
        const eow = endOfWeek(baseDate, { weekStartsOn: 1 });
        eow.setHours(23, 59, 59, 999);
        end_date = eow.toISOString();
      } else {
        const eod = new Date(baseDate);
        eod.setHours(23, 59, 59, 999);
        end_date = eod.toISOString();
      }
    } else if (data.recurrence === 'monthly') {
      const eom = endOfMonth(baseDate);
      eom.setHours(23, 59, 59, 999);
      end_date = eom.toISOString();
    } else if (data.recurrence === 'yearly') {
      const yearEnd = new Date(baseDate.getFullYear(), 11, 31, 23, 59, 59, 999);
      end_date = yearEnd.toISOString();
    }

    try {
      await TaskService.updateTask(taskToEdit.id, {
        title: data.title,
        assigned_to_user_id: data.assignedTo,
        recurrence_type: recurrence_type,
        week_days:
          data.dateType === 'days' && data.daysOfWeek ? data.daysOfWeek.join(',') : undefined,
        status: taskToEdit.completed ? 'completed' : 'pending',
        due_date: due_date,
        end_date: end_date || undefined,
      });
      fetchTasks();
      setTaskToEdit(undefined);
      setIsNewTaskOpen(false);
      toast.success('Tarea actualizada');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleEditTask = (task: Task) => setTaskToEdit(task);

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await TaskService.deleteTask(taskToDelete);
        setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
        setTaskToDelete(null);
        toast.success('Tarea eliminada');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const handleToggleCompleted = async (taskId: string, completed: boolean) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed } : t)));
      await TaskService.updateTask(taskId, {
        status: completed ? 'completed' : 'pending',
      });
      refreshFamily();
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Error al cambiar estado');
      fetchTasks();
    }
  };

  if (loading && tasks.length === 0) return <SectionSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Calendario de Tareas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organiza las actividades y responsabilidades diarias de tu nido
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
          Nueva Tarea
        </Button>
      </div>

      <Tabs defaultValue="calendario" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="calendario" className="text-sm">
            Calendario de Tareas
          </TabsTrigger>
          <TabsTrigger value="mis-tareas" className="text-sm">
            Nuestras Tareas
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
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-sm capitalize">
                  {format(currentMonth, "MMMM 'de' yyyy", { locale: es })}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextMonth}
                  className="h-8 w-8 p-0"
                  aria-label="Mes siguiente"
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
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La tarea será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
