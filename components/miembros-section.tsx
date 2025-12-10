"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Copy, Check, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MiembroAvatar } from "@/components/ui/miembro-avatar"
import { Leaderboard } from "@/components/leaderboard"
import { Familia, Miembro, ColorMiembro } from "@/lib/types"
import { COLORES_DISPONIBLES } from "@/lib/colors"

export function MiembrosSection() {
  const [familia, setFamilia] = useState<Familia | null>(null)
  const [usuario, setUsuario] = useState<any>(null)
  const [nuevoNombreMiembro, setNuevoNombreMiembro] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [codigoCopiado, setCodigoCopiado] = useState(false)
  const [esCreador, setEsCreador] = useState(false)

  useEffect(() => {
    const familiaGuardada = localStorage.getItem("familia")
    const usuarioGuardado = localStorage.getItem("usuario")

    if (familiaGuardada) {
      const familiaData: Familia = JSON.parse(familiaGuardada)
      setFamilia(familiaData)
    }

    if (usuarioGuardado) {
      const usuarioData = JSON.parse(usuarioGuardado)
      setUsuario(usuarioData)
      if (familiaGuardada) {
        const familiaData: Familia = JSON.parse(familiaGuardada)
        setEsCreador(familiaData.creadorId === usuarioData.id)
      }
    }
  }, [])

  const copiarCodigo = useCallback(async () => {
    if (!familia) return

    try {
      await navigator.clipboard.writeText(familia.codigoInvitacion)
      setCodigoCopiado(true)
      setTimeout(() => setCodigoCopiado(false), 2000)
    } catch (err) {
      console.error("Error copiando código:", err)
    }
  }, [familia?.codigoInvitacion])

  const handleAgregarMiembro = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nuevoNombreMiembro.trim() || !familia) return

    // Simulación - en realidad esto iría al backend
    const colorAleatorio =
      COLORES_DISPONIBLES[Math.floor(Math.random() * COLORES_DISPONIBLES.length)]

    const nuevoMiembro: Miembro = {
      id: "miembro-" + Date.now(),
      nombre: nuevoNombreMiembro,
      color: colorAleatorio,
      puntos: 0,
      rolId: "miembro",
      familiaId: familia.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const familiaActualizada: Familia = {
      ...familia,
      miembros: [...familia.miembros, nuevoMiembro],
    }

    localStorage.setItem("familia", JSON.stringify(familiaActualizada))
    setFamilia(familiaActualizada)
    setNuevoNombreMiembro("")
    setDialogOpen(false)
  }

  const handleEliminarMiembro = async (miembroId: string) => {
    if (!familia) return

    // Simulación - en realidad esto iría al backend
    const familiaActualizada: Familia = {
      ...familia,
      miembros: familia.miembros.filter((m) => m.id !== miembroId),
    }

    localStorage.setItem("familia", JSON.stringify(familiaActualizada))
    setFamilia(familiaActualizada)
  }

  if (!familia || !usuario) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Invitación Section */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Invitar a Miembros</CardTitle>
          <CardDescription className="text-muted-foreground">
            Comparte este código para que otros se unan a tu familia
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Código de Invitación</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={familia.codigoInvitacion}
                className="bg-muted border-border text-foreground font-mono"
              />
              <Button
                onClick={copiarCodigo}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
              >
                {codigoCopiado ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Agregar Miembro */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-foreground">Agregar Nuevo Miembro</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Crea un nuevo miembro en tu familia
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAgregarMiembro} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-foreground">
                    Nombre del Miembro
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Ej: Juan García"
                    value={nuevoNombreMiembro}
                    onChange={(e) => setNuevoNombreMiembro(e.target.value)}
                    className="bg-background border-input"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={!nuevoNombreMiembro.trim()}
                  >
                    Agregar Miembro
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Miembros Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Miembros ({familia.miembros.length})</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card para agregar miembro */}
          {esCreador && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <div className="w-full h-full cursor-pointer">
                  <Card className="border-2 border-dashed border-primary/50 bg-card/50 hover:bg-primary/5 transition-all h-full">
                    <CardContent className="p-4 flex items-center justify-center h-full min-h-[220px]">
                      <div className="text-center space-y-2">
                        <Plus className="w-12 h-12 text-primary mx-auto" />
                        <p className="text-sm font-medium text-foreground">Agregar Miembro</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-foreground">Agregar Nuevo Miembro</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Crea un nuevo miembro en tu familia
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAgregarMiembro} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-foreground">
                      Nombre del Miembro
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Ej: Juan García"
                      value={nuevoNombreMiembro}
                      onChange={(e) => setNuevoNombreMiembro(e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={!nuevoNombreMiembro.trim()}
                    >
                      Agregar Miembro
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {familia.miembros.map((miembro) => {
            return (
              <Card key={miembro.id} className="border border-border bg-card overflow-hidden h-full">
                <CardContent className="p-4 space-y-4 flex flex-col h-full">
                  {/* Header del Card */}
                  <div className="flex items-start justify-between gap-2">
                    <MiembroAvatar
                      nombre={miembro.nombre}
                      color={miembro.color}
                      size="md"
                    />
                    {esCreador && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarMiembro(miembro.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive flex-shrink-0"
                        title="Eliminar miembro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Nombre y rol */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{miembro.nombre}</h4>
                    {miembro.rolId === "creador" && (
                      <Badge className="mt-1 bg-primary text-primary-foreground">Creador</Badge>
                    )}
                  </div>

                  {/* Tareas completadas */}
                  <div className="pt-2 border-t border-border mt-auto">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tareas completadas: </span>
                      <span className="font-semibold text-foreground">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard miembros={familia.miembros} />
    </div>
  )
}
