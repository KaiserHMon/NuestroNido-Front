"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ActualizarFamiliaSchema, ActualizarFamiliaFormInputs } from "@/lib/validation"
import { useFamilia } from "@/hooks/use-familia"
import { Familia } from "@/lib/types"

interface EditarFamiliaDialogProps {
  familia: Familia
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function EditarFamiliaDialog({
  familia,
  onSuccess,
  trigger,
}: EditarFamiliaDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { actualizarNombre, error } = useFamilia()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActualizarFamiliaFormInputs>({
    resolver: zodResolver(ActualizarFamiliaSchema),
    defaultValues: {
      nuevoNombre: familia.nombre,
    },
  })

  const onSubmit = async (data: ActualizarFamiliaFormInputs) => {
    setIsSubmitting(true)
    try {
      await actualizarNombre(familia.id, data.nuevoNombre)
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error actualizando familia:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            ✏️
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Nombre de la Familia</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Cambia el nombre de tu familia. Este cambio será visible para todos los miembros.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="nuevoNombre" className="text-foreground font-medium">
              Nombre de la Familia
            </Label>
            <Input
              id="nuevoNombre"
              type="text"
              placeholder="Ej: Familia García"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...register("nuevoNombre")}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.nuevoNombre && (
              <p className="text-sm text-destructive">{errors.nuevoNombre.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
