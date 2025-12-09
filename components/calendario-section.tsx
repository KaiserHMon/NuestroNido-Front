"use client"

import { useState, useEffect, useCallback, ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Check, X, ChevronLeft, ChevronRight, Bird } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Miembro } from "./miembros-section"

interface Tarea {
  id: string
  titulo: string
  tipo: string
  miembroId: string
  fecha: string
  recurrente: boolean
  diaSemana?: number
  completada: boolean
}

const TIPOS_ACTIVIDAD = ["Limpieza", "Cocina", "Compras", "Lavandería", "Jardín", "Mascotas", "Mantenimiento", "Otro"]

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export function CalendarioSection() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mesActual, setMesActual] = useState(new Date())
  const [vistaCalendario, setVistaCalendario] = useState(true)
  const [lastActionMsg, setLastActionMsg] = useState("")

  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    tipo: "",
    miembroId: "",
    fecha: "",
    recurrente: false,
    diaSemana: 1,
  })

  useEffect(() => {
    const storedTareas = localStorage.getItem("nuestronido-tareas")
    const storedMiembros = localStorage.getItem("nuestronido-miembros")

    if (storedTareas) {
      setTareas(JSON.parse(storedTareas))
    }
    if (storedMiembros) {
      setMiembros(JSON.parse(storedMiembros))
    }
  }, [])

  useEffect(() => {
    if (tareas.length > 0) {
      localStorage.setItem("nuestronido-tareas", JSON.stringify(tareas))
    }
  }, [tareas])

  const agregarTarea = useCallback(() => {
    if (nuevaTarea.titulo && nuevaTarea.tipo && nuevaTarea.miembroId) {
      const tarea: Tarea = {
        id: Date.now().toString(),
        titulo: nuevaTarea.titulo.slice(0, 200),
        tipo: nuevaTarea.tipo,
        miembroId: nuevaTarea.miembroId,
        fecha: nuevaTarea.recurrente ? "" : nuevaTarea.fecha,
        recurrente: nuevaTarea.recurrente,
        diaSemana: nuevaTarea.recurrente ? nuevaTarea.diaSemana : undefined,
        completada: false,
      }

      setTareas((prev) => [...prev, tarea])
      setNuevaTarea({ titulo: "", tipo: "", miembroId: "", fecha: "", recurrente: false, diaSemana: 1 })
      setDialogOpen(false)
      setLastActionMsg("Tarea creada")
      setTimeout(() => setLastActionMsg(""), 1500)
    }
  }, [nuevaTarea])

  const completarTarea = useCallback((tareaId: string) => {
    setTareas((prev) =>
      prev.map((t) => {
        if (t.id === tareaId && !t.completada) {
          const miembrosActualizados = miembros.map((m) => (m.id === t.miembroId ? { ...m, puntos: m.puntos + 10 } : m))
          setMiembros(miembrosActualizados)
          localStorage.setItem("nuestronido-miembros", JSON.stringify(miembrosActualizados))

          return { ...t, completada: true }
        }
        return t
      }),
    )
    setLastActionMsg("Tarea completada")
    setTimeout(() => setLastActionMsg(""), 1500)
  }, [miembros])

  const descompletarTarea = useCallback((tareaId: string) => {
    setTareas((prev) =>
      prev.map((t) => {
        if (t.id === tareaId && t.completada) {
          const miembrosActualizados = miembros.map((m) =>
            m.id === t.miembroId ? { ...m, puntos: Math.max(0, m.puntos - 10) } : m,
          )
          setMiembros(miembrosActualizados)
          localStorage.setItem("nuestronido-miembros", JSON.stringify(miembrosActualizados))

          return { ...t, completada: false }
        }
        return t
      }),
    )
    setLastActionMsg("Tarea revertida")
    setTimeout(() => setLastActionMsg(""), 1500)
  }, [miembros])

  const eliminarTarea = useCallback((tareaId: string) => {
    setTareas((prev) => prev.filter((t) => t.id !== tareaId))
    setLastActionMsg("Tarea eliminada")
    setTimeout(() => setLastActionMsg(""), 1500)
  }, [])

  const getMiembro = useCallback((miembroId: string) => {
    return miembros.find((m) => m.id === miembroId)
  }, [miembros])

  const tareasRecurrentes = tareas.filter((t) => t.recurrente)
  const tareasUnicas = tareas
    .filter((t) => !t.recurrente)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  const getTareasDelDia = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split("T")[0]
    const diaSemana = fecha.getDay()

    return tareas.filter((tarea) => {
      if (tarea.recurrente) {
        return tarea.diaSemana === diaSemana
      }
      return tarea.fecha === fechaStr
    })
  }

  const getDiasDelMes = () => {
    const año = mesActual.getFullYear()
    const mes = mesActual.getMonth()
    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)
    const diasPrevios = primerDia.getDay()

    const dias: (Date | null)[] = []

    for (let i = 0; i < diasPrevios; i++) {
      dias.push(null)
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(año, mes, dia))
    }

    return dias
  }

  const cambiarMes = (direccion: number) => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + direccion, 1))
  }

  const esHoy = (fecha: Date) => {
    const hoy = new Date()
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Calendario de Tareas</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Organiza las tareas del hogar</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
                  variant="outline"
                  onClick={() => setVistaCalendario(!vistaCalendario)}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                  aria-label={vistaCalendario ? "Cambiar a vista lista" : "Cambiar a vista calendario"}
                  title={vistaCalendario ? "Cambiar a vista lista" : "Cambiar a vista calendario"}
                >
            {vistaCalendario ? "Ver Lista" : "Ver Calendario"}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 text-xs sm:text-sm h-9 sm:h-10" disabled={miembros.length === 0}>
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
                <DialogDescription>Asigna una tarea a un miembro de la familia</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título de la tarea</Label>
                  <Input
                    id="titulo"
                    placeholder="Ej: Lavar los platos"
                    value={nuevaTarea.titulo}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de actividad</Label>
                  <Select
                    value={nuevaTarea.tipo}
                    onValueChange={(value) => setNuevaTarea({ ...nuevaTarea, tipo: value })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_ACTIVIDAD.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="miembro">Asignar a</Label>
                  <Select
                    value={nuevaTarea.miembroId}
                    onValueChange={(value) => setNuevaTarea({ ...nuevaTarea, miembroId: value })}
                  >
                    <SelectTrigger id="miembro">
                      <SelectValue placeholder="Selecciona un miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      {miembros.map((miembro) => (
                        <SelectItem key={miembro.id} value={miembro.id}>
                          {miembro.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recurrente"
                      checked={nuevaTarea.recurrente}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, recurrente: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="recurrente" className="cursor-pointer">
                      Tarea recurrente semanal
                    </Label>
                  </div>
                </div>

                {nuevaTarea.recurrente ? (
                  <div className="space-y-2">
                    <Label htmlFor="diaSemana">Día de la semana</Label>
                    <Select
                      value={nuevaTarea.diaSemana.toString()}
                      onValueChange={(value) => setNuevaTarea({ ...nuevaTarea, diaSemana: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="diaSemana">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIAS_SEMANA.map((dia, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {dia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={nuevaTarea.fecha}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, fecha: e.target.value })}
                    />
                  </div>
                )}

                <Button onClick={agregarTarea} className="w-full">
                  Crear Tarea
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {miembros.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Primero agrega miembros en la sección de Miembros para poder crear tareas
            </p>
          </CardContent>
        </Card>
      )}

      {miembros.length > 0 && vistaCalendario && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg sm:text-xl">
                {mesActual.toLocaleDateString("es-ES", { month: "long", year: "numeric" }).charAt(0).toUpperCase() +
                  mesActual.toLocaleDateString("es-ES", { month: "long", year: "numeric" }).slice(1)}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => cambiarMes(-1)}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  aria-label="Mes anterior"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => cambiarMes(1)}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  aria-label="Mes siguiente"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
            <CardDescription>
              <div className="flex items-center gap-2 sm:gap-4 mt-2 overflow-x-auto pb-2 scrollbar-hide">
                <span className="text-xs whitespace-nowrap">Puntos por miembro:</span>
                {miembros.map((miembro) => (
                  <div key={miembro.id} className="flex items-center gap-1 whitespace-nowrap">
                    <div
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${miembro.color.bg}`}
                    />
                    <span className="text-xs">{miembro.nombre}</span>
                  </div>
                ))}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((dia) => (
                <div
                  key={dia}
                  className="text-center text-[10px] sm:text-sm font-semibold text-foreground py-1 sm:py-2"
                >
                  {dia}
                </div>
              ))}
              {getDiasDelMes().map((fecha, index) => {
                if (!fecha) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const tareasDelDia = getTareasDelDia(fecha)
                const esHoyDia = esHoy(fecha)

                return (
                  <div
                    key={fecha.toISOString()}
                    className={`aspect-square border rounded-md sm:rounded-lg p-1 sm:p-2 ${
                      esHoyDia ? "bg-accent/30 border-accent" : "bg-card border-border"
                    } hover:bg-muted transition-colors`}
                  >
                    <div className="text-[10px] sm:text-sm font-medium text-foreground mb-0.5 sm:mb-1">
                      {fecha.getDate()}
                    </div>
                    <div className="flex flex-wrap gap-0.5 sm:gap-1">
                      {tareasDelDia.map((tarea) => {
                        const miembro = getMiembro(tarea.miembroId)
                        return (
                          <div
                            key={tarea.id}
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${miembro?.color.bg} ${
                              tarea.completada ? "opacity-40" : ""
                            }`}
                            title={`${tarea.titulo} - ${miembro?.nombre} ${tarea.recurrente ? "(Recurrente)" : ""}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {miembros.length > 0 && !vistaCalendario && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bird className="w-5 h-5" aria-hidden="true" />
                Tareas Únicas
              </CardTitle>
              <CardDescription>Tareas programadas para fechas específicas</CardDescription>
            </CardHeader>
            <CardContent>
              {tareasUnicas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay tareas únicas programadas</p>
              ) : (
                <div className="space-y-3">
                  {tareasUnicas.map((tarea) => {
                    const miembro = getMiembro(tarea.miembroId)
                    return (
                      <div
                        key={tarea.id}
                        className={`p-3 rounded-lg border ${tarea.completada ? "bg-muted/50 opacity-60" : "bg-card"}`}
                      >
                        <div className="flex items-start gap-3">
                          <Button
                            size="icon"
                            variant={tarea.completada ? "secondary" : "outline"}
                            className="shrink-0 mt-1"
                            onClick={() => (tarea.completada ? descompletarTarea(tarea.id) : completarTarea(tarea.id))}
                            aria-label={tarea.completada ? `Desmarcar ${tarea.titulo}` : `Marcar ${tarea.titulo} como completada`}
                            title={tarea.completada ? `Desmarcar ${tarea.titulo}` : `Marcar ${tarea.titulo} como completada`}
                          >
                            {tarea.completada ? <Check className="w-4 h-4" aria-hidden="true" /> : <div className="w-4 h-4" />}
                          </Button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className={`font-medium ${tarea.completada ? "line-through" : ""}`}>
                                  {tarea.titulo}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">
                                    {tarea.tipo}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(tarea.fecha).toLocaleDateString("es-ES", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="shrink-0"
                                onClick={() => eliminarTarea(tarea.id)}
                                aria-label={`Eliminar tarea ${tarea.titulo}`}
                                title={`Eliminar tarea ${tarea.titulo}`}
                              >
                                <X className="w-4 h-4" aria-hidden="true" />
                              </Button>
                            </div>
                            {miembro && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-6 h-6 bg-card rounded-full flex items-center justify-center">
                                  <Bird className={`w-4 h-4 ${miembro.color.text}`} aria-hidden="true" />
                                </div>
                                <span className="text-sm text-muted-foreground">{miembro.nombre}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bird className="w-5 h-5" aria-hidden="true" />
                Tareas Recurrentes
              </CardTitle>
              <CardDescription>Tareas que se repiten cada semana</CardDescription>
            </CardHeader>
            <CardContent>
              {tareasRecurrentes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay tareas recurrentes</p>
              ) : (
                <div className="space-y-3">
                  {tareasRecurrentes.map((tarea) => {
                    const miembro = getMiembro(tarea.miembroId)
                    return (
                      <div
                        key={tarea.id}
                        className={`p-3 rounded-lg border ${tarea.completada ? "bg-muted/50 opacity-60" : "bg-card"}`}
                      >
                        <div className="flex items-start gap-3">
                          <Button
                            size="icon"
                            variant={tarea.completada ? "secondary" : "outline"}
                            className="shrink-0 mt-1"
                            onClick={() => (tarea.completada ? descompletarTarea(tarea.id) : completarTarea(tarea.id))}
                          >
                            {tarea.completada ? <Check className="w-4 h-4" aria-hidden="true" /> : <div className="w-4 h-4" />}
                          </Button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className={`font-medium ${tarea.completada ? "line-through" : ""}`}>
                                  {tarea.titulo}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">
                                    {tarea.tipo}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Cada {DIAS_SEMANA[tarea.diaSemana || 0]}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="shrink-0"
                                onClick={() => eliminarTarea(tarea.id)}
                              >
                                <X className="w-4 h-4" aria-hidden="true" />
                              </Button>
                            </div>
                            {miembro && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-6 h-6 bg-card rounded-full flex items-center justify-center">
                                  <Bird className={`w-4 h-4 ${miembro.color.text}`} aria-hidden="true" />
                                </div>
                                <span className="text-sm text-muted-foreground">{miembro.nombre}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
