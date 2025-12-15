"use client"

import { Tarea, Miembro } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface FechaExpandidaModalProps {
  fecha: Date | null
  tareas: Tarea[]
  onClose: () => void
  miembros?: Miembro[]
}

export function FechaExpandidaModal({
  fecha,
  tareas,
  onClose,
  miembros = [],
}: FechaExpandidaModalProps) {
  if (!fecha) return null

  // Filtrar tareas para el día seleccionado
  const tareasDelDia = tareas.filter((tarea) => {
    const fechaTarea = new Date(tarea.fecha)
    const fechaSeleccionada = new Date(fecha)
    return (
      fechaTarea.getFullYear() === fechaSeleccionada.getFullYear() &&
      fechaTarea.getMonth() === fechaSeleccionada.getMonth() &&
      fechaTarea.getDate() === fechaSeleccionada.getDate()
    )
  })

  const getPriorityColor = (prioridad?: "baja" | "media" | "alta") => {
    switch (prioridad) {
      case "alta":
        return "bg-destructive/10 text-destructive"
      case "media":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "baja":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityLabel = (prioridad?: "baja" | "media" | "alta") => {
    switch (prioridad) {
      case "alta":
        return "Alta"
      case "media":
        return "Media"
      case "baja":
        return "Baja"
      default:
        return "-"
    }
  }

  const getNombreMiembro = (creadorId: string) => {
    const miembro = miembros.find((m) => m.id === creadorId)
    return miembro?.nombre || "Desconocido"
  }

  return (
    <Dialog open={!!fecha} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center">
            {format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {tareasDelDia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="font-medium text-foreground">Sin tareas</p>
              <p className="text-sm text-muted-foreground">No hay tareas para este día</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tareasDelDia.map((tarea) => (
                <div
                  key={tarea.id}
                  className={`p-3 rounded-lg border border-border bg-card/50 space-y-2 ${
                    tarea.completada ? "opacity-60" : ""
                  }`}
                >
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
                            tarea.completada
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {tarea.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Por: <span className="font-medium">{getNombreMiembro(tarea.creadorId)}</span>
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

                  {/* Detalles */}
                  <div className="flex items-center gap-2 flex-wrap text-xs px-5">
                    {tarea.hora && (
                      <span className="text-muted-foreground">{tarea.hora}</span>
                    )}
                    {tarea.prioridad && (
                      <Badge variant="outline" className={getPriorityColor(tarea.prioridad)}>
                        {getPriorityLabel(tarea.prioridad)}
                      </Badge>
                    )}
                  </div>

                  {/* Descripción */}
                  {tarea.descripcion && (
                    <p className="text-xs text-muted-foreground px-5 break-words">
                      {tarea.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
