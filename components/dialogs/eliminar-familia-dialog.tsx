"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertTriangle } from "lucide-react"
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
import { EliminarFamiliaSchema, EliminarFamiliaFormInputs } from "@/lib/validation"
import { useFamilia } from "@/hooks/use-familia"
import { Familia } from "@/lib/types"

interface EliminarFamiliaDialogProps {
  familia: Familia
  trigger?: React.ReactNode
}

export function EliminarFamiliaDialog({ familia, trigger }: EliminarFamiliaDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { eliminarFamilia, error } = useFamilia()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Omit<EliminarFamiliaFormInputs, "nombreFamilia"> & { confirmacionTexto: string }>({
    defaultValues: {
      confirmacionTexto: "",
    },
  })

  const confirmacionTexto = watch("confirmacionTexto")
  const confirmacionValida = confirmacionTexto === familia.nombre

  const onSubmit = async () => {
    if (!confirmacionValida) {
      return
    }

    setIsSubmitting(true)
    try {
      await eliminarFamilia(familia.id)
      setOpen(false)
      reset()

      // Limpiar datos y redirigir
      localStorage.removeItem("familia")
      router.push("/home")
    } catch (error) {
      console.error("Error eliminando familia:", error)
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
            🗑️
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
            <div>
              <DialogTitle className="text-foreground">¿Eliminar Familia?</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Esta acción es irreversible. Se eliminarán:
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-1 my-4">
          <p className="text-sm text-destructive font-medium">Se eliminarán:</p>
          <ul className="text-sm text-destructive/80 space-y-1">
            <li>✓ Todos los miembros (excepto tú)</li>
            <li>✓ Todas las notas</li>
            <li>✓ Todas las tareas</li>
            <li>✓ El historial de la familia</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirmacion" className="text-foreground font-medium">
              Confirma escribiendo el nombre de la familia:
            </Label>
            <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
              "{familia.nombre}"
            </p>
            <Input
              id="confirmacion"
              type="text"
              placeholder={`Escribe "${familia.nombre}" para confirmar`}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...register("confirmacionTexto")}
              disabled={isSubmitting}
              autoFocus
            />
            {!confirmacionValida && confirmacionTexto && (
              <p className="text-sm text-destructive">El nombre no coincide</p>
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
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={isSubmitting || !confirmacionValida}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar Permanentemente"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
