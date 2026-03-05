'use client';

import { useMemo, useState } from 'react';
import { Task, Member } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TasksTabProps {
  tasks: Task[];
  members?: Member[];
  initialFilter?: 'unicas' | 'recurrentes';
  onFilterChange?: (filter: 'unicas' | 'recurrentes') => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleCompleted?: (taskId: string, completed: boolean) => void;
}

export function TasksTab({
  tasks,
  members = [],
  initialFilter = 'unicas',
  onFilterChange,
  onEdit,
  onDelete,
  onToggleCompleted: _onToggleCompleted,
}: TasksTabProps) {
  const [filter, setFilter] = useState<'unicas' | 'recurrentes'>(initialFilter);
  const [userFilter, setUserFilter] = useState<string>('todos');

  const handleFilter = (newFilter: 'unicas' | 'recurrentes') => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Filtro por tipo (Unica vs Recurrente)
        const isRecurrent = task.recurrence_type !== 'none';

        if (filter === 'unicas') {
          if (isRecurrent) return false;
        } else {
          if (!isRecurrent) return false;
        }

        // Filtro por usuario asignado
        if (userFilter !== 'todos') {
          if (task.creatorId !== userFilter) return false;
        }

        return true;
      })
      .map((task) => {
        const dateObj = task.date ? new Date(task.date) : null;
        return {
          ...task,
          dateTimestamp: dateObj ? dateObj.getTime() : 0,
          formattedDate: dateObj
            ? format(dateObj, "d 'de' MMMM", {
                locale: es,
              })
            : 'Sin fecha',
        };
      })
      .sort((a, b) => {
        // Sort completed tasks to bottom
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        if (filter === 'unicas') {
          // Sort by date if available
          if (a.date && b.date) {
            return a.dateTimestamp - b.dateTimestamp;
          }
        }
        return (a.title || '').localeCompare(b.title || '');
      });
  }, [tasks, filter, userFilter]);

  const counters = useMemo(() => {
    return {
      total: filteredTasks.length,
    };
  }, [filteredTasks]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <Button
            size="sm"
            variant={filter === 'unicas' ? 'default' : 'ghost'}
            onClick={() => handleFilter('unicas')}
            className="text-xs sm:text-sm px-3"
          >
            Únicas
          </Button>
          <Button
            size="sm"
            variant={filter === 'recurrentes' ? 'default' : 'ghost'}
            onClick={() => handleFilter('recurrentes')}
            className="text-xs sm:text-sm px-3"
          >
            Recurrentes
          </Button>
        </div>

        <div className="w-full sm:w-auto min-w-[200px]">
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filtrar por miembro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los miembros</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: member.color.bg }}
                    />
                    {member.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contador */}
      {counters.total > 0 && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {userFilter !== 'todos' && <Filter className="w-3 h-3" />}
          <span className="font-medium text-foreground">
            {counters.total} tarea{counters.total > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/10">
          <p className="font-medium text-foreground">Sin tareas</p>
          <p className="text-sm text-muted-foreground mt-1">
            No hay tareas {filter} {userFilter !== 'todos' ? 'asignadas a este miembro' : ''}
          </p>
          {userFilter !== 'todos' && (
            <Button variant="link" onClick={() => setUserFilter('todos')} className="mt-2 text-xs">
              Ver tareas de todos
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`border border-border bg-card transition-colors ${task.completed ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
                  {/* Left side: Dot + Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: task.creatorColor.bg }}
                      title={`Asignada a ${task.creatorColor.name}`}
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4
                        className={`font-medium text-sm truncate text-foreground ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {filter === 'unicas' ? (
                          <span className="flex items-center">{task.formattedDate}</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {task.frequency && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-5 font-medium"
                              >
                                {task.frequency === 'once'
                                  ? 'Puntual'
                                  : task.frequency === 'daily'
                                    ? 'Diaria'
                                    : task.frequency === 'weekly'
                                      ? 'Semanal'
                                      : task.frequency === 'monthly'
                                        ? 'Mensual'
                                        : task.frequency === 'yearly'
                                          ? 'Anual'
                                          : task.frequency}
                              </Badge>
                            )}
                            <div className="flex gap-1">
                              {task.daysOfWeek &&
                                task.daysOfWeek.map((d) => (
                                  <Badge
                                    key={d}
                                    variant="outline"
                                    className="text-[10px] px-1 py-0 h-5 font-normal border-muted-foreground/30"
                                  >
                                    {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'][parseInt(d)]}
                                  </Badge>
                                ))}
                            </div>
                            {!task.daysOfWeek && !task.frequency && <span>Recurrente</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit?.(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete?.(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
