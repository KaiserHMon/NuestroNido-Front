'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tarea } from '@/lib/types';
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

  const fetchTareas = useCallback(async () => {
    if (!familia) return;
    try {
      setLoading(true);
      const data = await TaskService.getTasks() as unknown as ApiTask[];

      const mappedTareas: Tarea[] = data.map((t) => {
        const creatorMember =
          familia.miembros.find((m) => m.id === t.assigned_to_user_id) ||
          familia.miembros.find((m) => m.id === t.assigned_user?.id); // or fallback

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

        return {
          id: t.id,
          titulo: t.title,
          tipoFecha: 'fecha', // Defaulting as API structure for recurrence is different
          fecha: t.due_date
            ? format(new Date(t.due_date), 'yyyy-MM-dd')
            : t.created_at
              ? format(new Date(t.created_at), 'yyyy-MM-dd')
              : undefined,
          // Mapping recurrence
          frecuencia: t.recurrence_type === 'unique' ? 'unica' : 'semanal', // Simplification
          creadorId: t.assigned_to_user_id || '',
          colorCreador: color,
          completada: t.status === 'completed',
          familiaId: t.family_id,
          diasSemana: t.week_days ? [t.week_days] : undefined, // week_days is string in schema?
        };
      });

      setTareas(mappedTareas);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [familia]);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const isTareaOnDay = (tarea: Tarea, dia: Date) => {
    const diaISO = format(dia, 'yyyy-MM-dd');
    const diaSemana = dia.getDay().toString(); // 0 (Domingo) - 6 (Sábado)

    if (tarea.tipoFecha === 'dias' && tarea.diasSemana) {
      return tarea.diasSemana.includes(diaSemana);
    }

    if (tarea.fecha) {
      if (tarea.frecuencia === 'mensual') {
        const [, , day] = tarea.fecha.split('-').map(Number);
        return day === dia.getDate();
      }
      if (tarea.frecuencia === 'anual') {
        const [, month, day] = tarea.fecha.split('-').map(Number);
        return day === dia.getDate() && month - 1 === dia.getMonth();
      }
      return tarea.fecha === diaISO;
    }
    // Fallback if we use created_at as date
    if (tarea.fecha) return tarea.fecha === diaISO;
    return false;
  };

  const getColoresParaDia = (dia: Date): ColorDot[] => {
    const tareasDelDia = tareas.filter((tarea) => isTareaOnDay(tarea, dia));

    const colores = new Map<string, ColorDot>();
    tareasDelDia.forEach((tarea) => {
      const key = tarea.colorCreador.bg;
      if (!colores.has(key)) {
        colores.set(key, tarea.colorCreador);
      }
    });

    return Array.from(colores.values());
  };

  const avanzarMes = () => setMesActual(addMonths(mesActual, 1));
  const retrocederMes = () => setMesActual(subMonths(mesActual, 1));

  const handleCrearTarea = async (data: CrearTareaData) => {
    if (!familia || !usuario) return;

    let fechaStr = null;
    if (data.fecha) {
      fechaStr = format(data.fecha, 'yyyy-MM-dd');
    }

    try {
      await TaskService.create({
        title: data.titulo,
        family_id: familia.id,
        assigned_to_user_id: data.asignadoA || usuario.id,
        recurrence_type: data.recurrencia === 'unica' ? 'unique' : 'recurring',
        week_days: data.diasSemana ? data.diasSemana[0] : undefined, // Schema says string
        status: 'pending',
        due_date: data.recurrencia === 'unica' ? fechaStr : null,
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

    let fechaStr = null;
    if (data.fecha) {
      fechaStr = format(data.fecha, 'yyyy-MM-dd');
    }

    try {
      await TaskService.update(tareaAEditar.id, {
        title: data.titulo,
        assigned_to_user_id: data.asignadoA,
        recurrence_type: data.recurrencia === 'unica' ? 'unique' : 'recurring',
        week_days: data.diasSemana ? data.diasSemana[0] : undefined, // Schema says string
        status: tareaAEditar.completada ? 'completed' : 'pending', // Preserve status
        due_date: data.recurrencia === 'unica' ? fechaStr : null,
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

  const primerDiaMes = startOfMonth(mesActual);
  const ultimoDiaMes = endOfMonth(mesActual);
  const diasDelMes = eachDayOfInterval({
    start: primerDiaMes,
    end: ultimoDiaMes,
  });

  if (loading && tareas.length === 0) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Calendario de Tareas</h2>
        <Button
          className="bg-primary hover:bg-primary/90"
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

        <TabsContent value="calendario" className="space-y-4">
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={retrocederMes} className="h-8 w-8 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <CardTitle className="text-sm capitalize">
                  {format(mesActual, "MMMM 'de' yyyy", { locale: es })}
                </CardTitle>

                <Button variant="ghost" size="sm" onClick={avanzarMes} className="h-8 w-8 p-0">
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

                  return (
                    <button
                      key={dia.toISOString()}
                      onClick={() => setFechaSeleccionada(dia)}
                      className={`h-24 sm:h-28 rounded-sm border transition-all relative flex flex-col items-start justify-start p-1.5
                        ${
                          esSeleccionada
                            ? 'border-primary bg-primary/10 scale-105'
                            : esHoy
                              ? 'border-primary/50 bg-primary/5'
                              : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }
                      `}
                    >
                      <div className="text-center w-full text-xs font-bold text-foreground leading-tight">
                        {format(dia, 'd')}
                      </div>

                      {coloresDelDia.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 w-full justify-start">
                          {coloresDelDia.slice(0, 4).map((color, idx) => (
                            <div
                              key={`${color.bg}-${idx}`}
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color.bg }}
                              title={`Tarea de ${color.nombre}`}
                            />
                          ))}
                          {coloresDelDia.length > 4 && (
                            <span className="text-[10px] text-muted-foreground leading-none self-center">
                              +
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mis-tareas" className="space-y-4">
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
                recurrencia: (tareaAEditar.frecuencia || 'unica') as any,
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
