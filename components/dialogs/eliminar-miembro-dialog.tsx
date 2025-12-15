"use client"

import { useState } from "react"
import { Miembro } from "@/lib/types"
import { Loader2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EliminarMiembroDialogProps {
  miembro: Miembro | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  esUsuarioActual?: boolean
}

export function EliminarMiembroDialog({
  miembro,
  open,
  onOpenChange,
  onConfirm,
  esUsuarioActual = false,
}: EliminarMiembroDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar miembro")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!miembro) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
            <div>
              <DialogTitle className="text-foreground">
                ¿{esUsuarioActual ? "Dejar" : "Eliminar"} {esUsuarioActual ? "la familia" : "a este miembro"}?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {esUsuarioActual
                  ? "Saldrás de la familia y perderás acceso a notas, tareas y listas familiares."
                  : `Se eliminará a ${miembro.nombre} de la familia y perderá acceso a todos los datos familiares.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 my-4">
          <p className="text-sm text-destructive font-medium">
            {esUsuarioActual
              ? "Al confirmar, serás removido de la familia"
              : `Al confirmar, ${miembro.nombre} será removido de la familia`}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-foreground border-border hover:bg-muted"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            disabled={isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {esUsuarioActual ? "Saliendo..." : "Eliminando..."}
              </>
            ) : (
              esUsuarioActual ? "Salir de la familia" : "Eliminar miembro"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
