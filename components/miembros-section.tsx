"use client"

import { useState, useEffect, useMemo, useCallback, useRef, ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Bird, Copy, Check, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export interface Miembro {
  id: string
  nombre: string
  color: {
    bg: string
    text: string
  }
  puntos: number
}

const niveles = [
  { nivel: 1, nombre: "Polluelo", minPuntos: 0, maxPuntos: 50, size: "w-8 h-8" },
  { nivel: 2, nombre: "Pájaro Joven", minPuntos: 51, maxPuntos: 150, size: "w-10 h-10" },
  { nivel: 3, nombre: "Pájaro Adulto", minPuntos: 151, maxPuntos: 300, size: "w-12 h-12" },
  { nivel: 4, nombre: "Pájaro Majestuoso", minPuntos: 301, maxPuntos: 500, size: "w-14 h-14" },
  { nivel: 5, nombre: "Pájaro Legendario", minPuntos: 501, maxPuntos: Number.POSITIVE_INFINITY, size: "w-16 h-16" },
]

const getNivelActual = (puntos: number) => {
  return niveles.find((n) => puntos >= n.minPuntos && puntos <= n.maxPuntos) || niveles[0]
}

const getProgreso = (puntos: number) => {
  const nivelActual = getNivelActual(puntos)
  if (nivelActual.nivel === 5) return 100 

  const puntosEnNivel = puntos - nivelActual.minPuntos
  const puntosNecesarios = nivelActual.maxPuntos - nivelActual.minPuntos + 1
  return (puntosEnNivel / puntosNecesarios) * 100
}

export function MiembrosSection() {
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [codigoCopiado, setCodigoCopiado] = useState(false)
  const inputCodigoRef = useRef<HTMLInputElement | null>(null)

  const codigoInvitacion = useMemo(() => {
    return "NIDO-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  }, [])

  const copiarCodigo = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codigoInvitacion)
      setCodigoCopiado(true)
      setTimeout(() => setCodigoCopiado(false), 2000)
    } catch (err) {
      try {
        if (inputCodigoRef.current) {
          // @ts-ignore
          inputCodigoRef.current.select()
          document.execCommand("copy")
          window.getSelection()?.removeAllRanges()
          setCodigoCopiado(true)
          setTimeout(() => setCodigoCopiado(false), 2000)
        }
      } catch (err2) {
        console.error("No se pudo copiar el código de invitación:", err2)
      }
    }
  }, [codigoInvitacion])

  useEffect(() => {
    const stored = localStorage.getItem("nuestronido-miembros")
    if (stored) {
      setMiembros(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (miembros.length > 0) {
      localStorage.setItem("nuestronido-miembros", JSON.stringify(miembros))
    }
  }, [miembros])

  const colores = [
    { bg: "bg-primary", text: "text-primary" },
    { bg: "bg-secondary", text: "text-secondary" },
    { bg: "bg-accent", text: "text-accent" },
    { bg: "bg-blue-500", text: "text-blue-500" },
    { bg: "bg-green-500", text: "text-green-500" },
    { bg: "bg-purple-500", text: "text-purple-500" },
  ]

  const agregarMiembro = useCallback(() => {
    const nombreLimpio = nuevoNombre.replace(/\s{2,}/g, " ").trim().slice(0, 50)
    if (nombreLimpio) {
      const nuevoMiembro: Miembro = {
        id: Date.now().toString(),
        nombre: nombreLimpio,
        color: colores[miembros.length % colores.length],
        puntos: 0,
      }
      setMiembros((prev) => [...prev, nuevoMiembro])
      setNuevoNombre("")
      setDialogOpen(false)
    }
  }, [nuevoNombre, miembros.length, colores])

  const handleNombreChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 50) {
      setNuevoNombre(value)
    } else {
      setNuevoNombre(value.slice(0, 50))
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Miembros de la Familia</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Completa tareas para hacer evolucionar tu pájaro</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" aria-hidden="true" />
              Invitar Miembro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invitar Nuevo Miembro</DialogTitle>
              <DialogDescription>
                Comparte el código de invitación para que otros se unan a tu familia
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Código de Invitación</Label>
                <div className="flex gap-2">
                  <Input
                    ref={inputCodigoRef}
                    value={codigoInvitacion}
                    readOnly
                    className="font-mono"
                    aria-label="Código de invitación"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copiarCodigo}
                    aria-label="Copiar código de invitación"
                    title="Copiar código de invitación"
                  >
                    {codigoCopiado ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Los miembros invitados deberán registrarse e ingresar este código para unirse
                </p>
                <span className="sr-only" aria-live="polite" aria-atomic="true">
                  {codigoCopiado ? "Código copiado al portapapeles" : ""}
                </span>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">O agrega un miembro manualmente para pruebas:</p>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: María"
                    value={nuevoNombre}
                    onChange={(e) => handleNombreChange(e)}
                    onKeyDown={(e) => e.key === "Enter" && agregarMiembro()}
                    aria-label="Nombre del nuevo miembro"
                    maxLength={50}
                  />
                </div>
                <Button onClick={agregarMiembro} className="w-full mt-3">
                  Agregar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {miembros.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shadow-sm">
                <Bird className={`w-7 h-7 ${miembros[0].color.text}`} aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <p className="font-semibold text-foreground">{miembros[0].nombre}</p>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground w-fit">
                    Creador del Nido
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Administrador del grupo familiar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {miembros.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">No hay miembros aún. Invita al primero!</p>
            </CardContent>
          </Card>
        ) : (
          miembros.map((miembro) => {
            const nivel = getNivelActual(miembro.puntos)
            const progreso = getProgreso(miembro.puntos)
            const siguienteNivel = niveles.find((n) => n.nivel === nivel.nivel + 1)

            return (
              <Card
                key={miembro.id}
                className="bg-card border-border overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">{miembro.nombre}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                        Nivel {nivel.nivel} - {nivel.nombre}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-card/80 text-muted-foreground border-border">
                      {miembro.puntos} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center py-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl"></div>
                      <div
                        className={`relative w-20 h-20 bg-card rounded-full flex items-center justify-center shadow-lg border-2 border-border`}
                      >
                        <Bird className={`${nivel.size} ${miembro.color.text}`} aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  {nivel.nivel < 5 && siguienteNivel && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progreso</span>
                        <span className="font-medium">
                          {miembro.puntos} / {siguienteNivel.minPuntos} pts
                        </span>
                      </div>
                      <Progress value={progreso} className="h-2 bg-muted" />
                      <p className="text-xs text-center text-muted-foreground">
                        {siguienteNivel.minPuntos - miembro.puntos} puntos para {siguienteNivel.nombre}
                      </p>
                    </div>
                  )}

                  {nivel.nivel === 5 && (
                    <div className="text-center">
                      <Badge className="bg-gradient-to-r from-primary to-accent">¡Nivel Máximo Alcanzado!</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
