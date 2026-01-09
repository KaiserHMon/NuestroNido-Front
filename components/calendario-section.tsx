'use client';

import { useEffect, useState } from 'react';
import { Familia, Tarea, Usuario } from '@/lib/types';
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
} from "@/components/ui/alert-dialog";
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

interface ColorDot {
  bg: string;
  nombre: string;
}

export function CalendarioSection() {
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [isNuevaTareaOpen, setIsNuevaTareaOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tareaAEditar, setTareaAEditar] = useState<Tarea | undefined>(undefined);
  const [tareaAEliminar, setTareaAEliminar] = useState<string | null>(null);

  useEffect(() => {
    // Cargar familia, usuario y tareas desde localStorage
    const familiaGuardada = localStorage.getItem('familia');
    const usuarioGuardado = localStorage.getItem('usuario');
    const tareasGuardadas = localStorage.getItem('tareas');

    if (familiaGuardada) {
      try {
        Promise.resolve().then(() => {
          setFamilia(JSON.parse(familiaGuardada));
        });
      } catch (error) {
        console.error('Error loading familia:', error);
      }
    }

    if (usuarioGuardado) {
      try {
        Promise.resolve().then(() => {
          setUsuario(JSON.parse(usuarioGuardado));
        });
      } catch (error) {
        console.error('Error loading usuario:', error);
      }
    }

    if (tareasGuardadas) {
      try {
        Promise.resolve().then(() => {
          setTareas(JSON.parse(tareasGuardadas));
        });
      } catch (error) {
        console.error('Error loading tareas:', error);
      }
    } else {
        // Datos mock iniciales si no hay tareas
        const tareasMock: Tarea[] = [
          {
            id: 'tarea-1',
            titulo: 'Comprar verduras',
            tipoFecha: 'fecha',
            fecha: format(new Date(), 'yyyy-MM-dd'),
            creadorId: 'miembro-1', // Placeholder
            colorCreador: {
              id: 'color-azul-mock',
              nombre: 'Azul',
              bg: '#3B82F6',
              text: '#FFFFFF',
              accent: '#6EA1F9',
              wcagContrast: 4.5,
            },
            frecuencia: 'unica',
            completada: false,
            familiaId: 'familia-1',
          },
        ];
        Promise.resolve().then(() => {
            // Only set if we really have no tasks and valid familia/usuario later
            // For now just keep empty or let the above catch handle it.
            // Simplified for this context.
        });
    }

    Promise.resolve().then(() => {
      setLoading(false);
    });
  }, []);

  // Update localStorage when tasks change
  useEffect(() => {
    if (!loading && tareas.length > 0) {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }
  }, [tareas, loading]);


  const isTareaOnDay = (tarea: Tarea, dia: Date) => {
    const diaISO = format(dia, 'yyyy-MM-dd');
    const diaSemana = dia.getDay().toString(); // 0 (Domingo) - 6 (Sábado)

    if (tarea.tipoFecha === 'dias' && tarea.diasSemana) {
        return tarea.diasSemana.includes(diaSemana);
    }

    if (tarea.fecha) {
         if (tarea.frecuencia === 'mensual') {
             // Check day of month
             // Parse tarea.fecha (yyyy-MM-dd)
             const [year, month, day] = tarea.fecha.split('-').map(Number);
             // dia.getDate() matches day
             return day === dia.getDate();
         }
         if (tarea.frecuencia === 'anual') {
             const [year, month, day] = tarea.fecha.split('-').map(Number);
             // dia.getDate() and dia.getMonth() (0-11) match
             // month in string is 1-12
             return day === dia.getDate() && (month - 1) === dia.getMonth();
         }
         // Unica
         return tarea.fecha === diaISO;
    }
    return false;
  };

  const getColoresParaDia = (dia: Date): ColorDot[] => {
    const tareasDelDia = tareas.filter((tarea) => isTareaOnDay(tarea, dia));

    // Devolver colores únicos
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

  const handleCrearTarea = (data: any) => {
    if (!familia || !usuario) return;

    let fechaStr = undefined;
    if (data.fecha) {
        fechaStr = format(data.fecha, 'yyyy-MM-dd');
    }

    const nuevaTarea: Tarea = {
      id: `tarea-${Date.now()}`,
      titulo: data.titulo,
      descripcion: data.descripcion,
      tipoFecha: data.tipoFecha,
      fecha: fechaStr,
      diasSemana: data.diasSemana,
      creadorId: usuario.id,
      colorCreador: familia.miembros.find((m) => m.id === usuario.id)?.color || {
        id: 'temp',
        nombre: 'Gris',
        bg: '#9CA3AF',
        text: '#FFFFFF',
        accent: '#9CA3AF',
        wcagContrast: 4.5
      },
      frecuencia: data.recurrencia, 
      completada: false,
      familiaId: familia.id,
    };

    const nuevasTareas = [...tareas, nuevaTarea];
    setTareas(nuevasTareas);
    setIsNuevaTareaOpen(false);
  };

  const handleGuardarEdicion = (data: any) => {
      if (!tareaAEditar) return;

      let fechaStr = undefined;
      if (data.fecha) {
        fechaStr = format(data.fecha, 'yyyy-MM-dd');
      }

      const tareasActualizadas = tareas.map(t => {
          if (t.id === tareaAEditar.id) {
              return {
                  ...t,
                  titulo: data.titulo,
                  descripcion: data.descripcion,
                  tipoFecha: data.tipoFecha,
                  fecha: fechaStr,
                  diasSemana: data.diasSemana,
                  frecuencia: data.recurrencia,
              };
          }
          return t;
      });

      setTareas(tareasActualizadas);
      setTareaAEditar(undefined);
      setIsNuevaTareaOpen(false);
  };

  const handleEditarTarea = (tarea: Tarea) => {
      setTareaAEditar(tarea);
      // setIsNuevaTareaOpen(true); // Will be handled by the dialog usage
  };

  const handleEliminarTarea = () => {
      if (tareaAEliminar) {
          setTareas(tareas.filter(t => t.id !== tareaAEliminar));
          setTareaAEliminar(null);
      }
  };
  
  const handleToggleCompletada = (tareaId: string, completada: boolean) => {
      setTareas(tareas.map(t => t.id === tareaId ? { ...t, completada } : t));
  };

  // Obtener los días del mes actual
  const primerDiaMes = startOfMonth(mesActual);
  const ultimoDiaMes = endOfMonth(mesActual);
  const diasDelMes = eachDayOfInterval({
    start: primerDiaMes,
    end: ultimoDiaMes,
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Calendario</h2>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Calendario</h2>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => {
            setTareaAEditar(undefined);
            setIsNuevaTareaOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      <Tabs defaultValue="calendario" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="calendario" className="text-sm">
            Calendario
          </TabsTrigger>
          <TabsTrigger value="mis-tareas" className="text-sm">
            Mis Tareas
          </TabsTrigger>
        </TabsList>

        {/* TAB: CALENDARIO */}
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
              {/* Leyenda de colores */}
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

              {/* Encabezados de días */}
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

              {/* Grid de días */}
              <div className="grid grid-cols-7 gap-0.5">
                {/* Días vacíos */}
                {Array.from({
                  length: primerDiaMes.getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-sm p-1 bg-muted/20" />
                ))}

                {/* Días del mes */}
                {diasDelMes.map((dia) => {
                  const coloresDelDia = getColoresParaDia(dia);
                  const esHoy = isSameDay(dia, new Date());
                  const esSeleccionada = fechaSeleccionada && isSameDay(dia, fechaSeleccionada);

                  return (
                    <button
                      key={dia.toISOString()}
                      onClick={() => setFechaSeleccionada(dia)}
                      className={`h-24 sm:h-32 rounded-sm border transition-all relative flex flex-col items-start justify-start p-1.5
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

                      {/* Indicadores de color - Puntos más grandes */}
                      {coloresDelDia.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 w-full justify-start">
                          {coloresDelDia.slice(0, 4).map((color, idx) => (
                            <div
                              key={`${color.bg}-${idx}`}
                              className="w-3 h-3 rounded-full flex-shrink-0" // Increased size
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

        {/* TAB: MIS TAREAS */}
        <TabsContent value="mis-tareas" className="space-y-4">
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <TareasTab 
                tareas={tareas} 
                usuarioId={usuario?.id} 
                filtroInicial="semana"
                onEditar={handleEditarTarea}
                onEliminar={(id) => setTareaAEliminar(id)}
                onToggleCompletada={handleToggleCompletada}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de fecha expandida */}
      <FechaExpandidaModal
        fecha={fechaSeleccionada}
        tareas={fechaSeleccionada ? tareas.filter(t => isTareaOnDay(t, fechaSeleccionada)) : []}
        miembros={familia?.miembros || []}
        onClose={() => setFechaSeleccionada(null)}
      />

      {/* Dialog Nueva/Editar Tarea */}
      <CrearTareaDialog 
        open={isNuevaTareaOpen || !!tareaAEditar} 
        onOpenChange={(open) => {
            if (!open) setTareaAEditar(undefined);
            setIsNuevaTareaOpen(open);
        }}
        onSubmit={tareaAEditar ? handleGuardarEdicion : handleCrearTarea}
        tareaAEditar={tareaAEditar ? {
            titulo: tareaAEditar.titulo,
            tipoFecha: tareaAEditar.tipoFecha || 'fecha',
            fecha: tareaAEditar.fecha ? new Date(tareaAEditar.fecha + 'T12:00:00') : undefined,
            diasSemana: tareaAEditar.diasSemana,
            recurrencia: tareaAEditar.frecuencia as any
        } : undefined}
      />

      {/* Dialog Confirmar Eliminación */}
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
            <AlertDialogAction onClick={handleEliminarTarea} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
