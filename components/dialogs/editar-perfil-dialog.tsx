"use client"

import { useState, useEffect } from "react"
import { Miembro } from "@/lib/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MiembroAvatar } from "@/components/ui/miembro-avatar"

const EditarPerfilSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre no puede exceder 50 caracteres"),
})

type EditarPerfilInputs = z.infer<typeof EditarPerfilSchema>

interface EditarPerfilDialogProps {
  miembro: Miembro | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (miembroActualizado: Miembro) => Promise<void>
}

export function EditarPerfilDialog({
  miembro,
  open,
  onOpenChange,
  onConfirm,
}: EditarPerfilDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditarPerfilInputs>({
    resolver: zodResolver(EditarPerfilSchema),
    defaultValues: {
      nombre: miembro?.nombre || "",
    },
  })

  useEffect(() => {
    if (miembro) {
      reset({
        nombre: miembro.nombre,
      })
    }
  }, [miembro, reset, open])

  const onSubmit = async (data: EditarPerfilInputs) => {
    if (!miembro) return

    setIsSubmitting(true)
    setError(null)
    try {
      const miembroActualizado: Miembro = {
        ...miembro,
        nombre: data.nombre,
      }
      await onConfirm(miembroActualizado)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar perfil")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!miembro) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza la información de tu perfil
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <MiembroAvatar
            nombre={miembro.nombre}
            color={miembro.color}
            size="lg"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-foreground font-medium">
              Nombre
            </Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...register("nombre")}
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
