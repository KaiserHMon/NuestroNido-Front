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

      {/* Google Auth Button - Centrado arriba */}
      <div className="flex justify-center mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-full hover:bg-muted border border-border"
          disabled={isSubmitting}
          title="Continuar con Google"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </Button>
      </div>

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
    </form>
  )
}
