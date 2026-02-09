'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Tarea, Miembro } from '@/lib/types';
import { TareasTab } from '@/components/tareas-tab';
import { FechaExpandidaModal } from '@/components/fecha-expandida-modal';
import { CrearTareaDialog } from '@/components/dialogs/crear-tarea-dialog';
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
  eachDayOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  addMonths,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskService } from '@/services/task-service';
import { useAuth } from '@/hooks/use-auth';
import { useFamilia } from '@/hooks/use-familia';
import { toast } from 'sonner';
import { SectionSkeleton } from '@/components/ui/section-skeleton';

interface ColorDot {
  bg: string;
  nombre: string;
}

interface ApiTask {
  id: string;
  title: string;
  due_date: string | null;
  created_at: string;
  assigned_to_user_id?: string;
  assigned_user?: { id: string };
  status: string;
  family_id: string;
  week_days?: string;
  recurrence_type: string;
}

interface CrearTareaData {
  titulo: string;
  tipoFecha?: 'fecha' | 'dias';
  fecha?: Date;
  asignadoA?: string;
  recurrencia: string;
  diasSemana?: string[];
}

export function CalendarioSection() {
  const { usuario } = useAuth();
  const { familia, cargarFamiliaGuardada } = useFamilia();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [isNuevaTareaOpen, setIsNuevaTareaOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState<Tarea | undefined>(undefined);
  const [tareaAEliminar, setTareaAEliminar] = useState<string | null>(null);

  const miembrosMap = useMemo(() => {
    if (!familia) return new Map<string, Miembro>();
    return new Map(familia.miembros.map((m) => [m.id, m]));
  }, [familia]);

  const fetchTareas = useCallback(async () => {
    if (!familia) return;
    try {
      setLoading(true);
      const data = await TaskService.getTasks() as unknown as ApiTask[];

      const mappedTareas: Tarea[] = data.map((t) => {
        const creatorMember = miembrosMap.get(t.assigned_to_user_id || '') || 
                             miembrosMap.get(t.assigned_user?.id || '');

        const color = creatorMember
          ? creatorMember.color
          : {
              id: 'temp',
              nombre: 'Gris',
              bg: '#9CA3AF',
              text: '#FFFFFF',
              accent: '#9CA3AF',
              wcagContrast: 4.5,
            };

        // Determine tipoFecha based on presence of due_date vs week_days
        const tipoFecha = t.week_days ? 'dias' : 'fecha';

        // Map recurrence type correctly
        let frecuencia: Tarea['frecuencia'] = 'unica';
        if (t.recurrence_type === 'monthly') frecuencia = 'mensual';
        else if (t.recurrence_type === 'yearly') frecuencia = 'anual';
        else if (t.recurrence_type === 'weekly' || t.week_days) frecuencia = 'semanal';
        else if (t.recurrence_type === 'daily') frecuencia = 'diaria';
        else if (t.recurrence_type === 'recurring' && !t.week_days) frecuencia = 'mensual'; // Fallback for old data
        
        return {
          id: t.id,
          titulo: t.title,
          tipoFecha: tipoFecha, 
          fecha: t.due_date
            ? format(new Date(t.due_date), 'yyyy-MM-dd')
            : undefined,
          frecuencia: frecuencia,
          creadorId: t.assigned_to_user_id || '',
          colorCreador: color,
          completada: t.status === 'completed',
          familiaId: t.family_id,
          diasSemana: t.week_days ? t.week_days.split(',') : undefined,
          createdAt: t.created_at,
        };
      });

      setTareas(mappedTareas);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [familia, miembrosMap]);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const isTareaOnDay = useCallback((tarea: Tarea, dia: Date) => {
    const diaISO = format(dia, 'yyyy-MM-dd');
    const diaSemana = dia.getDay().toString();
    
    // User requested to hide past tasks (que ya paso su dia)
    const startOfTodayDate = new Date();
    startOfTodayDate.setHours(0, 0, 0, 0);

    if (dia < startOfTodayDate) {
      return false;
    }

    if (tarea.tipoFecha === 'dias' && tarea.diasSemana) {
      const matchesDay = tarea.diasSemana.includes(diaSemana);
      if (!matchesDay) return false;

      // Limit by recurrence period based on creation date
      const createdDate = tarea.createdAt ? new Date(tarea.createdAt) : new Date();
      
      if (tarea.frecuencia === 'unica') {
        // Only same week (shown as semanal)
        return isSameWeek(dia, createdDate, { locale: es, weekStartsOn: 1 });
      }
      if (tarea.frecuencia === 'mensual') {
        // Only same month
        return isSameMonth(dia, createdDate);
      }
      if (tarea.frecuencia === 'anual') {
        // Only same year
        return isSameYear(dia, createdDate);
      }
      return true;
    }

    if (tarea.fecha) {
      // For 'fecha' type, recurrence is disabled, only show on specific day
      return tarea.fecha === diaISO;
    }
    return false;
  }, []);

  const primerDiaMes = useMemo(() => startOfMonth(mesActual), [mesActual]);
  const ultimoDiaMes = useMemo(() => endOfMonth(mesActual), [mesActual]);
  const diasDelMes = useMemo(() => eachDayOfInterval({
    start: primerDiaMes,
    end: ultimoDiaMes,
  }), [primerDiaMes, ultimoDiaMes]);

  // Index tasks by date for O(1) day lookups
  const tareasPorDia = useMemo(() => {
    const map = new Map<string, Tarea[]>();
    diasDelMes.forEach(dia => {
      const key = format(dia, 'yyyy-MM-dd');
      const filtered = tareas.filter(t => isTareaOnDay(t, dia));
      if (filtered.length > 0) map.set(key, filtered);
    });
    return map;
  }, [tareas, diasDelMes, isTareaOnDay]);

  const getColoresParaDia = useCallback((dia: Date): ColorDot[] => {
    const key = format(dia, 'yyyy-MM-dd');
    const tareasDelDia = tareasPorDia.get(key) || [];

    const colores = new Map<string, ColorDot>();
    tareasDelDia.forEach((tarea) => {
      const bg = tarea.colorCreador.bg;
      if (!colores.has(bg)) {
        colores.set(bg, tarea.colorCreador);
      }
    });

    return Array.from(colores.values());
  }, [tareasPorDia]);

  const avanzarMes = () => setMesActual(addMonths(mesActual, 1));
  const retrocederMes = () => setMesActual(subMonths(mesActual, 1));

  const handleCrearTarea = async (data: CrearTareaData) => {
    if (!familia || !usuario) return;

    let due_date = null;
    if (data.tipoFecha === 'fecha' && data.fecha) {
      due_date = data.fecha.toISOString();
    }

    // Determine recurrence_type string for backend
    let recurrence_type = 'unique';
    if (data.tipoFecha === 'dias') {
      recurrence_type = 'weekly';
    } else if (data.recurrencia === 'mensual') {
      recurrence_type = 'monthly';
    } else if (data.recurrencia === 'anual') {
      recurrence_type = 'yearly';
    }

    try {
      await TaskService.create({
        title: data.titulo,
        family_id: familia.id,
        assigned_to_user_id: data.asignadoA || usuario.id,
        recurrence_type: recurrence_type,
        week_days: data.tipoFecha === 'dias' && data.diasSemana ? data.diasSemana.join(',') : undefined,
        status: 'pending',
        due_date: due_date,
      });
      fetchTareas();
      setIsNuevaTareaOpen(false);
      toast.success('Tarea creada');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const handleGuardarEdicion = async (data: CrearTareaData) => {
    if (!tareaAEditar || !familia) return;

    let due_date = null;
    if (data.tipoFecha === 'fecha' && data.fecha) {
      due_date = data.fecha.toISOString();
    }

    // Determine recurrence_type string for backend
    let recurrence_type = 'unique';
    if (data.tipoFecha === 'dias') {
      recurrence_type = 'weekly';
    } else if (data.recurrencia === 'mensual') {
      recurrence_type = 'monthly';
    } else if (data.recurrencia === 'anual') {
      recurrence_type = 'yearly';
    }

    try {
      await TaskService.update(tareaAEditar.id, {
        title: data.titulo,
        assigned_to_user_id: data.asignadoA,
        recurrence_type: recurrence_type,
        week_days: data.tipoFecha === 'dias' && data.diasSemana ? data.diasSemana.join(',') : undefined,
        status: tareaAEditar.completada ? 'completed' : 'pending',
        due_date: due_date,
      });
      fetchTareas();
      setTareaAEditar(undefined);
      setIsNuevaTareaOpen(false);
      toast.success('Tarea actualizada');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleEditarTarea = (tarea: Tarea) => {
    setTareaAEditar(tarea);
    // setIsNuevaTareaOpen(true); // Handled by dialog prop
  };

  const handleEliminarTarea = async () => {
    if (tareaAEliminar) {
      try {
        await TaskService.delete(tareaAEliminar);
        setTareas((prev) => prev.filter((t) => t.id !== tareaAEliminar));
        setTareaAEliminar(null);
        toast.success('Tarea eliminada');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const handleToggleCompletada = async (tareaId: string, completada: boolean) => {
    try {
      // Optimistic update
      setTareas((prev) => prev.map((t) => (t.id === tareaId ? { ...t, completada } : t)));

      await TaskService.update(tareaId, {
        status: completada ? 'completed' : 'pending',
      });
      
      cargarFamiliaGuardada();
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Error al cambiar estado');
      fetchTareas(); // Revert on error
    }
  };

  if (loading && tareas.length === 0) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Calendario de Tareas</h2>
        <Button
          className="bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
          onClick={() => {
            setTareaAEditar(undefined);
            setIsNuevaTareaOpen(true);
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

        <TabsContent value="calendario" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={retrocederMes} className="h-8 w-8 p-0" aria-label="Mes anterior">
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <CardTitle className="text-sm capitalize">
                  {format(mesActual, "MMMM 'de' yyyy", { locale: es })}
                </CardTitle>

                <Button variant="ghost" size="sm" onClick={avanzarMes} className="h-8 w-8 p-0" aria-label="Mes siguiente">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-3">
              {familia && familia.miembros.length > 0 && (
                <div className="mb-3 pb-2 border-b border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {familia.miembros.map((miembro) => (
                      <div key={miembro.id} className="flex items-center gap-1 text-xs">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: miembro.color.bg }}
                        />
                        <span className="text-muted-foreground text-xs">{miembro.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-7 gap-0.5 mb-2">
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((dia) => (
                  <div
                    key={dia}
                    className="text-center text-xs font-semibold text-muted-foreground p-1"
                  >
                    {dia}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({
                  length: primerDiaMes.getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-sm p-1 bg-muted/20" />
                ))}

                {diasDelMes.map((dia) => {
                  const coloresDelDia = getColoresParaDia(dia);
                  const esHoy = isSameDay(dia, new Date());
                  const esSeleccionada = fechaSeleccionada && isSameDay(dia, fechaSeleccionada);
                  const tieneEventos = coloresDelDia.length > 0;
                  const label = `${format(dia, "d 'de' MMMM", { locale: es })}, ${
                    coloresDelDia.length
                  } ${coloresDelDia.length === 1 ? 'tarea' : 'tareas'}`;

                  return (
                    <button
                      key={dia.toISOString()}
                      onClick={() => setFechaSeleccionada(dia)}
                      aria-label={label}
                      className={`
                        min-h-[48px] sm:h-28 rounded-md transition-all relative flex flex-col items-center sm:items-start justify-center sm:justify-start p-1 sm:p-2 border
                        ${
                          esSeleccionada
                            ? 'border-primary ring-1 ring-primary bg-primary/10 scale-[1.02] z-10'
                            : esHoy
                              ? 'border-primary/40 bg-primary/5'
                              : 'border-transparent sm:border-border hover:bg-muted/50'
                        }
                        ${tieneEventos && !esSeleccionada ? 'sm:bg-primary/5' : ''}
                      `}
                    >
                      <div 
                        className={`
                          text-sm sm:text-xs font-bold leading-none mb-1
                          ${esHoy ? 'text-primary' : 'text-foreground'}
                          ${esSeleccionada ? 'text-primary' : ''}
                        `} 
                        aria-hidden="true"
                      >
                        {format(dia, 'd')}
                      </div>

                      {tieneEventos ? (
                        <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-auto sm:mt-1 w-full justify-center sm:justify-start overflow-hidden" aria-hidden="true">
                          {coloresDelDia.slice(0, 4).map((color, idx) => (
                            <div
                              key={`${color.bg}-${idx}`}
                              className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color.bg }}
                            />
                          ))}
                          {coloresDelDia.length > 4 ? (
                            <span className="text-[8px] sm:text-[10px] text-muted-foreground leading-none self-center font-bold">
                              +
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="h-1.5 sm:h-2.5" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mis-tareas" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
                            <TareasTab 
                              tareas={tareas} 
                              miembros={familia?.miembros || []}
                              filtroInicial="unicas"
                              onEditar={handleEditarTarea}
              
                onEliminar={(id) => setTareaAEliminar(id)}
                onToggleCompletada={handleToggleCompletada}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FechaExpandidaModal
        fecha={fechaSeleccionada}
        tareas={fechaSeleccionada ? tareas.filter((t) => isTareaOnDay(t, fechaSeleccionada)) : []}
        miembros={familia?.miembros || []}
        onClose={() => setFechaSeleccionada(null)}
        onToggleCompletada={handleToggleCompletada}
        currentUserId={usuario?.id}
      />

      <CrearTareaDialog
        open={isNuevaTareaOpen || !!tareaAEditar}
        onOpenChange={(open) => {
          if (!open) setTareaAEditar(undefined);
          setIsNuevaTareaOpen(open);
        }}
        onSubmit={tareaAEditar ? handleGuardarEdicion : handleCrearTarea}
        tareaAEditar={
          tareaAEditar
            ? {
                titulo: tareaAEditar.titulo,
                tipoFecha: tareaAEditar.tipoFecha || 'fecha',
                fecha: tareaAEditar.fecha ? new Date(tareaAEditar.fecha + 'T12:00:00') : undefined,
                diasSemana: tareaAEditar.diasSemana,
                recurrencia: (tareaAEditar.frecuencia === 'semanal' || !tareaAEditar.frecuencia ? 'unica' : tareaAEditar.frecuencia) as 'unica' | 'mensual' | 'anual',
                asignadoA: tareaAEditar.creadorId,
              }
            : undefined
        }
        miembros={familia?.miembros || []}
        usuarioActualId={usuario?.id}
      />

      <AlertDialog open={!!tareaAEliminar} onOpenChange={() => setTareaAEliminar(null)}>
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
              onClick={handleEliminarTarea}
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
