"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LinkIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UnirseAFamiliaSchema, UnirseAFamiliaFormInputs } from "@/lib/validation"
import { useFamilia } from "@/hooks/use-familia"

interface UnirseAFamiliaCardProps {
  onSuccess?: () => void
}

export function UnirseAFamiliaCard({ onSuccess }: UnirseAFamiliaCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validacionCodigo, setValidacionCodigo] = useState<{
    valido: boolean
    nombreFamilia?: string
    miembrosActuales?: number
  } | null>(null)
  const { unirseAFamilia, validarCodigo, error } = useFamilia()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UnirseAFamiliaFormInputs>({
    resolver: zodResolver(UnirseAFamiliaSchema),
  })

  const codigo = watch("codigoInvitacion")

  // Validar código en tiempo real
  const handleCodigoChange = useCallback(async () => {
    if (codigo && codigo.length >= 6) {
      try {
        const resultado = await validarCodigo(codigo)
        setValidacionCodigo(resultado)
      } catch (error) {
        console.error("Error validando código:", error)
      }
    } else {
      setValidacionCodigo(null)
    }
  }, [codigo, validarCodigo])

  const onSubmit = async (data: UnirseAFamiliaFormInputs) => {
    setIsSubmitting(true)
    try {
      await unirseAFamilia(data.codigoInvitacion)
      onSuccess?.()
    } catch (error) {
      console.error("Error uniéndose a familia:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-border bg-card hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <LinkIcon className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-foreground">Únete a un Nido Existente</CardTitle>
            <CardDescription className="text-muted-foreground">
              Solicita acceso con un código de invitación
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo" className="text-foreground font-medium">
              Código de invitación
            </Label>
            <Input
              id="codigo"
              type="text"
              placeholder="Ej: ABC123 o NIDO2024"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground uppercase"
              {...register("codigoInvitacion")}
              disabled={isSubmitting}
              onChange={(e) => {
                register("codigoInvitacion").onChange(e)
                handleCodigoChange()
              }}
            />
            {errors.codigoInvitacion && (
              <p className="text-sm text-destructive">{errors.codigoInvitacion.message}</p>
            )}
          </div>

          {/* Validación de Código */}
          {codigo && codigo.length >= 6 && validacionCodigo && (
            <div
              className={`p-3 rounded-md border ${
                validacionCodigo.valido
                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
              }`}
            >
              <div className="flex items-start gap-2">
                {validacionCodigo.valido ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  {validacionCodigo.valido ? (
                    <div className="space-y-1">
                      <p className="font-medium text-green-900 dark:text-green-200">
                        {validacionCodigo.nombreFamilia}
                      </p>
                      <p className="text-green-700 dark:text-green-300">
                        {validacionCodigo.miembrosActuales} miembros
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-700 dark:text-red-300">Código inválido o no existe</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ Acceso a todas las funciones</p>
            <p>✓ Colabora con otros miembros</p>
            <p>✓ Comparte tareas y notas</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isSubmitting || !validacionCodigo?.valido}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uniéndose...
              </>
            ) : (
              "Unirme a la Familia"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
