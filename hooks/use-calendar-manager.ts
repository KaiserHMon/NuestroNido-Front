'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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
import { Task, Member } from '@/lib/types';
import { TaskService } from '@/services/task-service';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { toast } from 'sonner';
import { ColorDot } from '@/components/calendar-grid';

export interface CreateTaskFormValues {
  title: string;
  dateType: 'date' | 'days';
  date?: Date;
  daysOfWeek?: string[];
  recurrence: 'once' | 'monthly' | 'yearly';
  assignedTo?: string;
}

export function useCalendarManager() {
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

          let validity: Task['validity'] = 'once';
          if (t.end_date) {
            const endDate = new Date(t.end_date);
            if (endDate.getMonth() === 11 && endDate.getDate() >= 30) {
              validity = 'yearly';
            } else if (endDate.getDate() >= 27) {
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

    const dayProps = daysInMonth.map((day) => ({
      date: day,
      key: format(day, 'yyyy-MM-dd'),
      dayOfWeek: day.getDay().toString(),
      dayOfMonth: day.getDate(),
      time: day.getTime(),
    }));

    const startOfTodayDate = new Date();
    startOfTodayDate.setHours(0, 0, 0, 0);
    const startOfTodayTime = startOfTodayDate.getTime();

    tasks.forEach((task) => {
      if (!task.date) return;

      const startDate = new Date(task.date);
      startDate.setHours(0, 0, 0, 0);
      const startTime = startDate.getTime();

      let endTime = Infinity;
      if (task.endDate) {
        const endDate = new Date(task.endDate);
        endDate.setHours(23, 59, 59, 999);
        endTime = endDate.getTime();
      }

      const taskRecurrence = task.recurrence_type;
      const taskDaysOfWeek = task.daysOfWeek;
      const taskDateDay = new Date(task.date).getDate();

      dayProps.forEach((dayProp) => {
        if (dayProp.time < startOfTodayTime) return;
        if (dayProp.time < startTime) return;
        if (dayProp.time > endTime) return;

        let isOnDay = false;
        if (taskRecurrence === 'none') {
          isOnDay = startTime === dayProp.time;
        } else if (taskRecurrence === 'daily') {
          isOnDay = true;
        } else if (taskRecurrence === 'weekly' && taskDaysOfWeek) {
          isOnDay = taskDaysOfWeek.includes(dayProp.dayOfWeek);
        } else if (taskRecurrence === 'monthly') {
          isOnDay = taskDateDay === dayProp.dayOfMonth;
        }

        if (isOnDay) {
          let list = map.get(dayProp.key);
          if (!list) {
            list = [];
            map.set(dayProp.key, list);
          }
          list.push(task);
        }
      });
    });

    return map;
  }, [tasks, daysInMonth]);

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

  return {
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
  };
}
