"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, User, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { RegisterSchema, RegisterFormInputs, validarFortalezaContraseña } from "@/lib/validation"
import { useAuth } from "@/hooks/use-auth"

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register: registerUser, error: authError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(RegisterSchema),
  })

  const password = watch("password")
  const passwordStrength = useMemo(
    () => (password ? validarFortalezaContraseña(password) : null),
    [password]
  )

  const getPasswordStrengthColor = (strength: string | null) => {
    switch (strength) {
      case "weak":
        return "text-destructive"
      case "medium":
        return "text-yellow-500"
      case "strong":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getPasswordStrengthLabel = (strength: string | null) => {
    switch (strength) {
      case "weak":
        return "Débil"
      case "medium":
        return "Media"
      case "strong":
        return "Fuerte"
      default:
        return ""
    }
  }

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true)
    try {
      await registerUser(data.nombre, data.email, data.password)
      onSuccess?.()
    } catch (error) {
      console.error("Error en registro:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && (
        <Alert variant="destructive">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-foreground font-medium">
          Nombre Completo
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="nombre"
            type="text"
            placeholder="Juan García"
            className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register("nombre")}
            disabled={isSubmitting}
          />
        </div>
        {errors.nombre && (
          <p className="text-sm text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register("email")}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground font-medium">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register("password")}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passwordStrength === "strong"
                      ? "bg-green-500 w-full"
                      : passwordStrength === "medium"
                        ? "bg-yellow-500 w-2/3"
                        : "bg-destructive w-1/3"
                  }`}
                />
              </div>
              <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength)}`}>
                {getPasswordStrengthLabel(passwordStrength)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="passwordConfirm" className="text-foreground font-medium">
          Confirmar Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="passwordConfirm"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register("passwordConfirm")}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.passwordConfirm && (
          <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border border-input cursor-pointer accent-primary"
          {...register("aceptaTerminos")}
          disabled={isSubmitting}
          required
        />
        <span className="text-sm text-muted-foreground">
          Acepto los{" "}
          <a href="#" className="text-primary hover:underline">
            términos y condiciones
          </a>
        </span>
      </label>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
        disabled={isSubmitting || passwordStrength !== "strong"}
      >
        {isSubmitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Creando cuenta...
          </>
        ) : (
          "Crear Cuenta"
        )}
      </Button>

      {/* Google Auth */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-input text-foreground hover:bg-muted"
        disabled={isSubmitting}
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M6 12h12" />
        </svg>
        Continuar con Google
      </Button>
    </form>
  )
}
