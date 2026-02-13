'use client';

import { Task, Member } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isSameDay, isBefore, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExpandedDateModalProps {
  date: Date | null;
  tasks: Task[];
  onClose: () => void;
  members?: Member[];
  onToggleCompleted?: (taskId: string, completed: boolean) => void;
  currentUserId?: string;
}

export function ExpandedDateModal({
  date,
  tasks,
  onClose,
  members = [],
  onToggleCompleted,
  currentUserId,
}: ExpandedDateModalProps) {
  if (!date) return null;

  const dayTasks = tasks;

  const getMemberName = (creatorId: string) => {
    if (!creatorId) return 'Sin asignar';
    const member = members.find((m) => m.id === creatorId);
    return member?.name || 'Desconocido';
  };

  const today = new Date();
  const isToday = date ? isSameDay(date, today) : false;
  const isPast = date ? isBefore(date, startOfToday()) : false;

  return (
    <Dialog open={!!date} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center">
            {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalle de tareas para {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {dayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="font-medium text-foreground">Sin tareas</p>
              <p className="text-sm text-muted-foreground">No hay tareas para este día</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dayTasks.map((task) => {
                 const isAssignedToMe = currentUserId && task.creatorId === currentUserId;
                 
                 return (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border border-border bg-card/50 space-y-2 ${
                    task.completed || isPast ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      {isToday && isAssignedToMe && (
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(c) => onToggleCompleted?.(task.id, !!c)}
                          className="mt-1 border-2 border-primary/70"
                        />
                      )}
                      <div className="flex items-start gap-2 flex-1">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: task.creatorColor.bg }}
                          title={task.creatorColor.name}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-semibold text-foreground text-sm break-words ${
                              task.completed || isPast ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Asignado a:{' '}
                            <span className="font-medium">{getMemberName(task.creatorId)}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {task.completed && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs flex-shrink-0">
                        ✓
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs px-10">
                    {task.dateType === 'days' && task.frequency === 'once' && (
                      <Badge variant="secondary" className="capitalize">
                        Semanal
                      </Badge>
                    )}
                    {task.frequency && task.frequency !== 'once' && (
                      <Badge variant="secondary" className="capitalize">
                        {task.frequency}
                      </Badge>
                    )}
                    {task.daysOfWeek && task.daysOfWeek.length > 0 && (
                      <span className="text-muted-foreground">
                        {task.daysOfWeek
                          .map(
                            (d) =>
                              [
                                'Domingo',
                                'Lunes',
                                'Martes',
                                'Miércoles',
                                'Jueves',
                                'Viernes',
                                'Sábado',
                              ][parseInt(d)]
                          )
                          .join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
