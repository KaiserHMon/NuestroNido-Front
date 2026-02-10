'use client';

import { useMemo, useState } from 'react';
import { Tarea, Miembro } from '@/lib/types';
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

interface TareasTabProps {
  tareas: Tarea[];
  miembros?: Miembro[];
  filtroInicial?: 'unicas' | 'recurrentes';
  onFiltroChange?: (filtro: 'unicas' | 'recurrentes') => void;
  onEditar?: (tarea: Tarea) => void;
  onEliminar?: (tareaId: string) => void;
  onToggleCompletada?: (tareaId: string, completada: boolean) => void;
}

export function TareasTab({
  tareas,
  miembros = [],
  filtroInicial = 'unicas',
  onFiltroChange,
  onEditar,
  onEliminar,
  onToggleCompletada: _onToggleCompletada,
}: TareasTabProps) {
  const [filtro, setFiltro] = useState<'unicas' | 'recurrentes'>(filtroInicial);
  const [usuarioFiltro, setUsuarioFiltro] = useState<string>('todos');

  const handleFiltro = (nuevoFiltro: 'unicas' | 'recurrentes') => {
    setFiltro(nuevoFiltro);
    onFiltroChange?.(nuevoFiltro);
  };

  const tareasFiltradas = useMemo(() => {
    return tareas
      .filter((tarea) => {
        // Filtro por tipo (Unica vs Recurrente)
        // Ahora 'unicas' son solo las de recurrence_type === 'none'
        const esRecurrente = tarea.recurrence_type !== 'none';
        
        if (filtro === 'unicas') {
          if (esRecurrente) return false;
        } else {
          if (!esRecurrente) return false;
        }

        // Filtro por usuario asignado
        if (usuarioFiltro !== 'todos') {
          if (tarea.creadorId !== usuarioFiltro) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort completed tasks to bottom
        if (a.completada !== b.completada) {
          return a.completada ? 1 : -1;
        }
        if (filtro === 'unicas') {
          // Sort by date if available
          if (a.fecha && b.fecha) {
            return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
          }
        }
        return (a.titulo || '').localeCompare(b.titulo || '');
      });
  }, [tareas, filtro, usuarioFiltro]);

  const contadores = useMemo(() => {
    return {
      total: tareasFiltradas.length,
    };
  }, [tareasFiltradas]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <Button
            size="sm"
            variant={filtro === 'unicas' ? 'default' : 'ghost'}
            onClick={() => handleFiltro('unicas')}
            className="text-xs sm:text-sm px-3"
          >
            Únicas
          </Button>
          <Button
            size="sm"
            variant={filtro === 'recurrentes' ? 'default' : 'ghost'}
            onClick={() => handleFiltro('recurrentes')}
            className="text-xs sm:text-sm px-3"
          >
            Recurrentes
          </Button>
        </div>

        <div className="w-full sm:w-auto min-w-[200px]">
          <Select value={usuarioFiltro} onValueChange={setUsuarioFiltro}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filtrar por miembro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los miembros</SelectItem>
              {miembros.map((miembro) => (
                <SelectItem key={miembro.id} value={miembro.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: miembro.color.bg }}
                    />
                    {miembro.nombre}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contador */}
      {contadores.total > 0 && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {usuarioFiltro !== 'todos' && <Filter className="w-3 h-3" />}
          <span className="font-medium text-foreground">
            {contadores.total} tarea{contadores.total > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Lista de tareas */}
      {tareasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/10">
          <p className="font-medium text-foreground">Sin tareas</p>
          <p className="text-sm text-muted-foreground mt-1">
            No hay tareas {filtro} {usuarioFiltro !== 'todos' ? 'asignadas a este miembro' : ''}
          </p>
          {usuarioFiltro !== 'todos' && (
            <Button
              variant="link"
              onClick={() => setUsuarioFiltro('todos')}
              className="mt-2 text-xs"
            >
              Ver tareas de todos
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <Card key={tarea.id} className={`border border-border bg-card transition-colors ${tarea.completada ? 'opacity-60' : ''}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
                  {/* Left side: Dot + Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: tarea.colorCreador.bg }}
                      title={`Asignada a ${tarea.colorCreador.nombre}`}
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className={`font-medium text-sm truncate text-foreground ${tarea.completada ? 'line-through text-muted-foreground' : ''}`}>
                        {tarea.titulo}
                      </h4>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {filtro === 'unicas' ? (
                          <span>
                            {tarea.fecha
                              ? format(new Date(tarea.fecha), "d 'de' MMMM", {
                                  locale: es,
                                })
                              : 'Sin fecha'}
                          </span>
                        ) : (
                          <div className="flex gap-1 items-center">
                            {tarea.tipoFecha === 'dias' && tarea.frecuencia === 'unica' && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5">
                                Semanal
                              </Badge>
                            )}
                            {tarea.frecuencia && tarea.frecuencia !== 'unica' && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 capitalize">
                                {tarea.frecuencia}
                              </Badge>
                            )}
                            {tarea.diasSemana ? (
                              tarea.diasSemana.map((d) => (
                                <Badge
                                  key={d}
                                  variant="outline"
                                  className="text-[10px] px-1 py-0 h-5"
                                >
                                  {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'][parseInt(d)]}
                                </Badge>
                              ))
                            ) : (
                              <span>Recurrente</span>
                            )}
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
