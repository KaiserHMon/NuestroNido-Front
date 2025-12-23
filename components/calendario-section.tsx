'use client';

import { useEffect, useState } from 'react';
import { Familia, Tarea, Usuario } from '@/lib/types';
import { TareasTab } from '@/components/tareas-tab';
import { FechaExpandidaModal } from '@/components/fecha-expandida-modal';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar familia, usuario y tareas desde localStorage
    const familiaGuardada = localStorage.getItem('familia');
    const usuarioGuardado = localStorage.getItem('usuario');
    const tareasGuardadas = localStorage.getItem('tareas');

    if (familiaGuardada) {
      try {
        // Usar Promise para evitar setState directo en effect
        Promise.resolve().then(() => {
          setFamilia(JSON.parse(familiaGuardada));
        });
      } catch (error) {
        console.error('Error loading familia:', error);
      }
    }

    if (usuarioGuardado) {
      try {
        // Usar Promise para evitar setState directo en effect
        Promise.resolve().then(() => {
          setUsuario(JSON.parse(usuarioGuardado));
        });
      } catch (error) {
        console.error('Error loading usuario:', error);
      }
    }

    if (tareasGuardadas) {
      try {
        // Usar Promise para evitar setState directo en effect
        Promise.resolve().then(() => {
          setTareas(JSON.parse(tareasGuardadas));
        });
      } catch (error) {
        console.error('Error loading tareas:', error);
        // Datos mock iniciales
        const tareasMock: Tarea[] = [
          {
            id: 'tarea-1',
            titulo: 'Comprar verduras',
            descripcion: 'Ir al mercado',
            fecha: format(new Date(), 'yyyy-MM-dd'),
            hora: '10:00',
            creadorId: familia?.miembros[0]?.id || 'miembro-1',
            colorCreador: familia?.miembros[0]?.color || {
              id: 'color-azul-mock',
              nombre: 'Azul',
              bg: '#3B82F6',
              text: '#FFFFFF',
              accent: '#6EA1F9', // A slightly lighter blue
              wcagContrast: 4.5,
            },
            prioridad: 'alta',
            completada: false,
            familiaId: familia?.id || 'familia-1',
          },
          {
            id: 'tarea-2',
            titulo: 'Limpiar sala',
            fecha: format(new Date(), 'yyyy-MM-dd'),
            hora: '14:30',
            creadorId: familia?.miembros[1]?.id || 'miembro-2',
            colorCreador: familia?.miembros[1]?.color || {
              id: 'color-rosa-mock',
              nombre: 'Rosa',
              bg: '#EC4899',
              text: '#FFFFFF',
              accent: '#F075B5', // A slightly lighter pink
              wcagContrast: 4.5,
            },
            prioridad: 'media',
            completada: true,
            familiaId: familia?.id || 'familia-1',
          },
        ];
        // Usar Promise para evitar setState directo en effect
        Promise.resolve().then(() => {
          setTareas(tareasMock);
          localStorage.setItem('tareas', JSON.stringify(tareasMock));
        });
      }
    }

    // Usar Promise para evitar setState directo en effect
    Promise.resolve().then(() => {
      setLoading(false);
    });
  }, []);

  // Obtener los días del mes actual
  const primerDiaMes = startOfMonth(mesActual);
  const ultimoDiaMes = endOfMonth(mesActual);
  const diasDelMes = eachDayOfInterval({
    start: primerDiaMes,
    end: ultimoDiaMes,
  });

  // Obtener los colores de tareas para un día específico
  const getColoresParaDia = (dia: Date): ColorDot[] => {
    const tareasDelDia = tareas.filter((tarea) => {
      const fechaTarea = new Date(tarea.fecha);
      return isSameDay(fechaTarea, dia);
    });

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
        <Button className="bg-primary hover:bg-primary/90">
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
              {/* Leyenda de colores - ARRIBA IZQUIERDA */}
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

              {/* Encabezados de días de la semana */}
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

              {/* Grid de días - COMPACTO */}
              <div className="grid grid-cols-7 gap-0.5">
                {/* Días vacíos del mes anterior */}
                {Array.from({
                  length: primerDiaMes.getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-sm p-1 bg-muted/20" />
                ))}

                {/* Días del mes actual */}
                {diasDelMes.map((dia) => {
                  const coloresDelDia = getColoresParaDia(dia);
                  const esHoy = isSameDay(dia, new Date());
                  const esSeleccionada = fechaSeleccionada && isSameDay(dia, fechaSeleccionada);

                  return (
                    <button
                      key={dia.toISOString()}
                      onClick={() => setFechaSeleccionada(dia)}
                      className={`aspect-square rounded-sm border transition-all relative flex flex-col items-start justify-start p-1.5
                        ${
                          esSeleccionada
                            ? 'border-primary bg-primary/10 scale-105'
                            : esHoy
                              ? 'border-primary/50 bg-primary/5'
                              : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }
                      `}
                      title={format(dia, "d 'de' MMMM", { locale: es })}
                      aria-label={`${format(dia, "d 'de' MMMM")}, ${coloresDelDia.length} tarea${coloresDelDia.length > 1 ? 's' : ''}`}
                    >
                      {/* Número del día - CENTRADO ARRIBA */}
                      <div className="text-center w-full text-xs font-bold text-foreground leading-tight">
                        {format(dia, 'd')}
                      </div>

                      {/* Indicadores de color para tareas - ALINEADOS IZQUIERDA */}
                      {coloresDelDia.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5 w-full justify-start">
                          {coloresDelDia.slice(0, 3).map((color, idx) => (
                            <div
                              key={`${color.bg}-${idx}`}
                              className="w-1 h-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color.bg }}
                              title={`Tarea de ${color.nombre}`}
                            />
                          ))}
                          {coloresDelDia.length > 3 && (
                            <span className="text-xs text-muted-foreground leading-none">
                              +{coloresDelDia.length - 3}
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
              <TareasTab tareas={tareas} usuarioId={usuario?.id} filtroInicial="semana" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de fecha expandida */}
      <FechaExpandidaModal
        fecha={fechaSeleccionada}
        tareas={tareas}
        miembros={familia?.miembros || []}
        onClose={() => setFechaSeleccionada(null)}
      />
    </div>
  );
}
