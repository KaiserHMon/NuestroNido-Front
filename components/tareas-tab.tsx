'use client';

import { useMemo, useState } from 'react';
import { Tarea } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface TareasTabProps {
  tareas: Tarea[];
  usuarioId?: string;
  filtroInicial?: 'dia' | 'semana' | 'mes';
  onFiltroChange?: (filtro: 'dia' | 'semana' | 'mes') => void;
}

export function TareasTab({
  tareas,
  usuarioId,
  filtroInicial = 'semana',
  onFiltroChange,
}: TareasTabProps) {
  // Estado local para filtro si no se pasa callback
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes'>(filtroInicial);

  const handleFiltro = (nuevoFiltro: 'dia' | 'semana' | 'mes') => {
    setFiltro(nuevoFiltro);
    onFiltroChange?.(nuevoFiltro);
  };

  // Calcular rango de fechas según filtro
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
    }
  }, [filtro]);

  // Filtrar tareas por usuario y rango
  const tareasFiltradas = useMemo(() => {
    return tareas
      .filter((tarea) => {
        // Si se especifica usuarioId, filtrar por creador
        if (usuarioId && tarea.creadorId !== usuarioId) {
          return false;
        }

        // Filtrar por rango de fechas
        const fechaTarea = new Date(tarea.fecha);
        return fechaTarea >= rangoFechas.inicio && fechaTarea <= rangoFechas.fin;
      })
      .sort((a, b) => {
        // Ordenar por fecha
        const diff = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        if (diff !== 0) return diff;

        // Si misma fecha, ordenar por hora
        if (a.hora && b.hora) {
          return a.hora.localeCompare(b.hora);
        }
        return 0;
      });
  }, [tareas, usuarioId, rangoFechas, filtro]);

  // Contar tareas
  const contadores = useMemo(() => {
    return {
      pendientes: tareasFiltradas.filter((t) => !t.completada).length,
      completadas: tareasFiltradas.filter((t) => t.completada).length,
    };
  }, [tareasFiltradas]);

  const getPriorityColor = (prioridad?: 'baja' | 'media' | 'alta') => {
    switch (prioridad) {
      case 'alta':
        return 'bg-destructive/10 text-destructive';
      case 'media':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'baja':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (prioridad?: 'baja' | 'media' | 'alta') => {
    switch (prioridad) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return '-';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={filtro === 'dia' ? 'default' : 'outline'}
          onClick={() => handleFiltro('dia')}
          className={filtro === 'dia' ? 'bg-primary hover:bg-primary/90' : ''}
        >
          Día
        </Button>
        <Button
          size="sm"
          variant={filtro === 'semana' ? 'default' : 'outline'}
          onClick={() => handleFiltro('semana')}
          className={filtro === 'semana' ? 'bg-primary hover:bg-primary/90' : ''}
        >
          Semana
        </Button>
        <Button
          size="sm"
          variant={filtro === 'mes' ? 'default' : 'outline'}
          onClick={() => handleFiltro('mes')}
          className={filtro === 'mes' ? 'bg-primary hover:bg-primary/90' : ''}
        >
          Mes
        </Button>
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
            {usuarioId ? `No tienes tareas en este ${filtro}` : `No hay tareas en este ${filtro}`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <Card
              key={tarea.id}
              className={`border border-border bg-card ${tarea.completada ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
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
                          tarea.completada ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {tarea.titulo}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tarea.fecha), "d 'de' MMMM", {
                          locale: es,
                        })}
                        {tarea.hora && `, ${tarea.hora}`}
                      </p>
                    </div>
                  </div>

                  {/* Estado */}
                  {tarea.completada && (
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs flex-shrink-0">
                      ✓
                    </Badge>
                  )}
                </div>

                {/* Prioridad y descripción */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {tarea.prioridad && (
                    <Badge variant="outline" className={getPriorityColor(tarea.prioridad)}>
                      {getPriorityLabel(tarea.prioridad)}
                    </Badge>
                  )}
                  {tarea.descripcion && (
                    <p className="text-muted-foreground line-clamp-1">{tarea.descripcion}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
