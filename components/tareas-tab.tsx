'use client';

import { useMemo, useState } from 'react';
import { Tarea } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface TareasTabProps {
  tareas: Tarea[];
  usuarioId?: string;
  filtroInicial?: 'dia' | 'semana' | 'mes' | 'año';
  onFiltroChange?: (filtro: 'dia' | 'semana' | 'mes' | 'año') => void;
  onEditar?: (tarea: Tarea) => void;
  onEliminar?: (tareaId: string) => void;
  onToggleCompletada?: (tareaId: string, completada: boolean) => void;
}

export function TareasTab({
  tareas,
  usuarioId,
  filtroInicial = 'semana',
  onFiltroChange,
  onEditar,
  onEliminar,
  onToggleCompletada,
}: TareasTabProps) {
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes' | 'año'>(filtroInicial);

  const handleFiltro = (nuevoFiltro: 'dia' | 'semana' | 'mes' | 'año') => {
    setFiltro(nuevoFiltro);
    onFiltroChange?.(nuevoFiltro);
  };

  const rangoFechas = useMemo(() => {
    const hoy = new Date();

    switch (filtro) {
      case 'dia':
        return { inicio: hoy, fin: hoy };
      case 'semana':
        return {
          inicio: startOfWeek(hoy, { weekStartsOn: 0 }),
          fin: endOfWeek(hoy, { weekStartsOn: 0 }),
        };
      case 'mes':
        return {
          inicio: startOfMonth(hoy),
          fin: endOfMonth(hoy),
        };
      case 'año':
        return {
          inicio: startOfYear(hoy),
          fin: endOfYear(hoy),
        };
    }
  }, [filtro]);

  const isTareaInRange = (tarea: Tarea, start: Date, end: Date) => {
      // Avoid mutating original dates
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);

      // Logic to check if a task occurs within the date range
      // If simple date match (unica)
      if (tarea.tipoFecha === 'fecha' && tarea.fecha) {
           if (tarea.frecuencia === 'unica') {
               // Parse explicit components to avoid timezone ambiguity
               const [year, month, day] = tarea.fecha.split('-').map(Number);
               const fechaTarea = new Date(year, month - 1, day);
               
               // Compare with range
               return fechaTarea >= startDate && fechaTarea <= endDate;
           }
           
           if (tarea.frecuencia === 'mensual') {
               const dayOfMonth = parseInt(tarea.fecha.split('-')[2]);
               // Check if any month in range has this day
               // Simplified: Iterate days in range?
               // Or better: Check if range covers the day.
               // For 'mes' view it's easy. For 'semana' view, check if dayOfMonth is in the week.
               // We can use eachDayOfInterval for short ranges.
               if (endDate.getTime() - startDate.getTime() < 1000 * 60 * 60 * 24 * 40) { // Up to ~month
                   const days = eachDayOfInterval({ start: startDate, end: endDate });
                   return days.some(d => d.getDate() === dayOfMonth);
               } else {
                   // Annual range always includes all days of month (except 31st etc)
                   return true; 
               }
           }

           if (tarea.frecuencia === 'anual') {
               const [_, month, day] = tarea.fecha.split('-').map(Number);
               // Check if start year -> end year contains this month/day
               const startYear = startDate.getFullYear();
               const endYear = endDate.getFullYear();
               for (let y = startYear; y <= endYear; y++) {
                   const tDate = new Date(y, month - 1, day);
                   if (tDate >= startDate && tDate <= endDate) return true;
               }
               return false;
           }
      }

      if (tarea.tipoFecha === 'dias' && tarea.diasSemana) {
          // Check if range contains any of the weekdays
          // For short ranges iterate days
           if (endDate.getTime() - startDate.getTime() < 1000 * 60 * 60 * 24 * 60) {
               const days = eachDayOfInterval({ start: startDate, end: endDate });
               return days.some(d => tarea.diasSemana?.includes(d.getDay().toString()));
           }
           // For long ranges (year), it definitely contains all weekdays
           return true;
      }

      return false;
  };

  const tareasFiltradas = useMemo(() => {
    return tareas
      .filter((tarea) => {
        if (usuarioId && tarea.creadorId !== usuarioId) {
          return false;
        }
        return isTareaInRange(tarea, rangoFechas.inicio, rangoFechas.fin);
      })
      .sort((a, b) => {
        // Sort logic is tricky for recurring tasks. 
        // We might want to sort by title or just creation if no specific date instance.
        // Or "next occurrence".
        // For simplicity, sort by creation or title.
        return (a.titulo || '').localeCompare(b.titulo || '');
      });
  }, [tareas, usuarioId, rangoFechas]);

  const contadores = useMemo(() => {
    return {
      pendientes: tareasFiltradas.filter((t) => !t.completada).length,
      completadas: tareasFiltradas.filter((t) => t.completada).length,
    };
  }, [tareasFiltradas]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['dia', 'semana', 'mes', 'año'] as const).map((f) => (
            <Button
                key={f}
                size="sm"
                variant={filtro === f ? 'default' : 'outline'}
                onClick={() => handleFiltro(f)}
                className={filtro === f ? 'bg-primary hover:bg-primary/90' : ''}
            >
                {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
        ))}
      </div>

      {/* Contador */}
      {(contadores.pendientes > 0 || contadores.completadas > 0) && (
        <div className="text-sm text-muted-foreground">
          {contadores.pendientes > 0 && (
            <span className="font-medium text-foreground">
              {contadores.pendientes} pendiente{contadores.pendientes > 1 ? 's' : ''}
            </span>
          )}
          {contadores.pendientes > 0 && contadores.completadas > 0 && ', '}
          {contadores.completadas > 0 && (
            <span className="text-muted-foreground">
              {contadores.completadas} completada{contadores.completadas > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Lista de tareas */}
      {tareasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="font-medium text-foreground">Sin tareas</p>
          <p className="text-sm text-muted-foreground">
            {usuarioId ? `No tienes tareas en este periodo` : `No hay tareas en este periodo`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <Card
              key={tarea.id}
              className={`border border-border bg-card transition-colors ${tarea.completada ? 'opacity-60 bg-muted/20' : ''}`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
                  {/* Left side: Dot + Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: tarea.colorCreador.bg }}
                      title={tarea.colorCreador.nombre}
                    />
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4
                        className={`font-medium text-sm truncate ${
                          tarea.completada ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {tarea.titulo}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {tarea.tipoFecha === 'fecha' && tarea.fecha ? (
                              <span>
                                {format(new Date(tarea.fecha + 'T12:00:00'), "d MMM", { locale: es })}
                                {tarea.frecuencia !== 'unica' && ` (${tarea.frecuencia})`}
                              </span>
                          ) : (
                              <span>
                                  {tarea.diasSemana?.map(d => ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][parseInt(d)]).join(', ')}
                              </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Checkbox 
                        checked={tarea.completada}
                        onCheckedChange={(checked) => onToggleCompletada?.(tarea.id, checked as boolean)}
                        className="h-6 w-6 border-2 border-primary/50 data-[state=checked]:border-primary"
                    />
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEditar?.(tarea)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onEliminar?.(tarea.id)}
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
