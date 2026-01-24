'use client';

import { Tarea, Miembro } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isSameDay, isBefore, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface FechaExpandidaModalProps {
  fecha: Date | null;
  tareas: Tarea[];
  onClose: () => void;
  miembros?: Miembro[];
  onToggleCompletada?: (tareaId: string, completada: boolean) => void;
  currentUserId?: string;
}

export function FechaExpandidaModal({
  fecha,
  tareas,
  onClose,
  miembros = [],
  onToggleCompletada,
  currentUserId,
}: FechaExpandidaModalProps) {
  if (!fecha) return null;

  // Las tareas ya vienen filtradas desde el padre
  const tareasDelDia = tareas;

  const getNombreMiembro = (creadorId: string) => {
    if (!creadorId) return 'Sin asignar';
    const miembro = miembros.find((m) => m.id === creadorId);
    return miembro?.nombre || 'Desconocido';
  };

  const today = new Date();
  const isToday = fecha ? isSameDay(fecha, today) : false;
  const isPast = fecha ? isBefore(fecha, startOfToday()) : false;

  return (
    <Dialog open={!!fecha} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center">
            {format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalle de tareas para {format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {tareasDelDia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="font-medium text-foreground">Sin tareas</p>
              <p className="text-sm text-muted-foreground">No hay tareas para este día</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tareasDelDia.map((tarea) => {
                 const isAssignedToMe = currentUserId && tarea.creadorId === currentUserId;
                 
                 return (
                <div
                  key={tarea.id}
                  className={`p-3 rounded-lg border border-border bg-card/50 space-y-2 ${
                    tarea.completada || isPast ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      {isToday && isAssignedToMe && (
                        <Checkbox
                          checked={tarea.completada}
                          onCheckedChange={(c) => onToggleCompletada?.(tarea.id, !!c)}
                          className="mt-1 border-2 border-primary/70"
                        />
                      )}
                      <div className="flex items-start gap-2 flex-1">
                        {/* Dot de color */}
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: tarea.colorCreador.bg }}
                          title={tarea.colorCreador.nombre}
                        />
                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-semibold text-foreground text-sm break-words ${
                              tarea.completada || isPast ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {tarea.titulo}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Asignado a:{' '}
                            <span className="font-medium">{getNombreMiembro(tarea.creadorId)}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Estado */}
                    {tarea.completada && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs flex-shrink-0">
                        ✓
                      </Badge>
                    )}
                  </div>

                  {/* Detalles */}
                  <div className="flex items-center gap-2 flex-wrap text-xs px-10">
                    {tarea.frecuencia && tarea.frecuencia !== 'unica' && (
                      <Badge variant="secondary" className="capitalize">
                        {tarea.frecuencia}
                      </Badge>
                    )}
                    {tarea.diasSemana && tarea.diasSemana.length > 0 && (
                      <span className="text-muted-foreground">
                        {tarea.diasSemana
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
