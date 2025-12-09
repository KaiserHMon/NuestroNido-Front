"use client"

import { useState, useEffect, useCallback, ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, X, StickyNote } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Miembro } from "./miembros-section"

interface Nota {
  id: string
  titulo: string
  contenido: string
  miembroId: string
  fecha: string
}

export function NotasSection() {
  const [notas, setNotas] = useState<Nota[]>([])
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [miembroActivo, setMiembroActivo] = useState("todas")
  const [lastActionMsg, setLastActionMsg] = useState("")

  const [nuevaNota, setNuevaNota] = useState({
    titulo: "",
    contenido: "",
    miembroId: "",
  })

  useEffect(() => {
    const storedNotas = localStorage.getItem("nuestronido-notas")
    const storedMiembros = localStorage.getItem("nuestronido-miembros")

    if (storedNotas) {
      setNotas(JSON.parse(storedNotas))
    }
    if (storedMiembros) {
      setMiembros(JSON.parse(storedMiembros))
    }
  }, [])

  useEffect(() => {
    if (notas.length > 0) {
      localStorage.setItem("nuestronido-notas", JSON.stringify(notas))
    }
  }, [notas])

  const agregarNota = useCallback(() => {
    const titulo = nuevaNota.titulo.replace(/\s{2,}/g, " ").trim().slice(0, 80)
    const contenido = nuevaNota.contenido.trim().slice(0, 2000)
    if (titulo && contenido && nuevaNota.miembroId) {
      const nota: Nota = {
        id: Date.now().toString(),
        titulo,
        contenido,
        miembroId: nuevaNota.miembroId,
        fecha: new Date().toISOString(),
      }

      setNotas((prev) => [nota, ...prev])
      setNuevaNota({ titulo: "", contenido: "", miembroId: "" })
      setDialogOpen(false)
      setLastActionMsg("Nota creada")
      setTimeout(() => setLastActionMsg(""), 1500)
    }
  }, [nuevaNota])

  const eliminarNota = useCallback((notaId: string) => {
    setNotas((prev) => prev.filter((nota) => nota.id !== notaId))
    setLastActionMsg("Nota eliminada")
    setTimeout(() => setLastActionMsg(""), 1500)
  }, [])

  const getMiembro = useCallback((miembroId: string) => {
    return miembros.find((m) => m.id === miembroId)
  }, [miembros])

  const notasFiltradas = miembroActivo === "todas" ? notas : notas.filter((nota) => nota.miembroId === miembroActivo)

  const contarNotasPorMiembro = (miembroId: string) => {
    return notas.filter((nota) => nota.miembroId === miembroId).length
  }

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Notas Familiares</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Comparte observaciones con la familia</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 text-xs sm:text-sm h-9 sm:h-10 self-start" disabled={miembros.length === 0}>
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              Nueva Nota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Nota</DialogTitle>
              <DialogDescription>Añade una observación o recordatorio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="miembro">Autor de la nota</Label>
                <Select
                  value={nuevaNota.miembroId}
                  onValueChange={(value) => setNuevaNota({ ...nuevaNota, miembroId: value })}
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
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Recordatorio importante"
                  value={nuevaNota.titulo}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNuevaNota((prev) => ({ ...prev, titulo: e.target.value.slice(0, 80) }))
                  }
                  aria-label="Título de la nota"
                  maxLength={80}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea
                  id="contenido"
                  placeholder="Escribe tu nota aquí..."
                  value={nuevaNota.contenido}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setNuevaNota((prev) => ({ ...prev, contenido: e.target.value.slice(0, 2000) }))
                  }
                  rows={5}
                  aria-label="Contenido de la nota"
                  maxLength={2000}
                />
              </div>

              <Button onClick={agregarNota} className="w-full">
                Crear Nota
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {miembros.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm sm:text-base text-muted-foreground py-4">
              Primero agrega miembros en la sección de Miembros para poder crear notas
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={miembroActivo} onValueChange={setMiembroActivo}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 gap-1">
              <TabsTrigger
                value="todas"
                className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
              >
                <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Todas
                {notas.length > 0 && (
                  <span className="text-[10px] sm:text-xs bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                    {notas.length}
                  </span>
                )}
              </TabsTrigger>
              {miembros.map((miembro) => {
                const count = contarNotasPorMiembro(miembro.id)
                return (
                  <TabsTrigger
                    key={miembro.id}
                    value={miembro.id}
                    className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
                  >
                    <Avatar className={`w-4 h-4 sm:w-5 sm:h-5 ${miembro.color.bg}`}>
                <AvatarFallback className="text-white text-[10px] sm:text-xs font-semibold" aria-hidden="true">
                  {miembro.nombre.charAt(0).toUpperCase()}
                </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{miembro.nombre}</span>
                    {count > 0 && (
                      <span className="text-[10px] sm:text-xs bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value={miembroActivo} className="mt-4 sm:mt-6">
              {notasFiltradas.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-sm sm:text-base text-muted-foreground py-4 sm:py-8">
                      {miembroActivo === "todas"
                        ? "No hay notas aún. Crea la primera!"
                        : "Este miembro no tiene notas aún"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {notasFiltradas.map((nota) => {
                    const miembro = getMiembro(nota.miembroId)
                    return (
                      <Card key={nota.id} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base sm:text-lg line-clamp-2">{nota.titulo}</CardTitle>
                              <CardDescription className="mt-1.5 sm:mt-2 text-xs sm:text-sm">
                                {formatearFecha(nota.fecha)}
                              </CardDescription>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 -mt-1 -mr-2 h-8 w-8"
                              onClick={() => eliminarNota(nota.id)}
                              aria-label="Eliminar nota"
                              title="Eliminar nota"
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                            {nota.contenido}
                          </p>
                          {miembro && (
                            <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                              <Avatar className={`w-5 h-5 sm:w-6 sm:h-6 ${miembro.color.bg}`}>
                  <AvatarFallback className="text-white text-[10px] sm:text-xs font-semibold" aria-hidden="true">
                    {miembro.nombre.charAt(0).toUpperCase()}
                  </AvatarFallback>
                              </Avatar>
                              <span className="text-xs sm:text-sm font-medium">{miembro.nombre}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      {/* Región accesible para anunciar acciones (creada/eliminada) */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {lastActionMsg}
      </span>
    </div>
  )
}
