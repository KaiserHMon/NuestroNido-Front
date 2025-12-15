"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Bird } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { useAuth } from "@/hooks/use-auth"

export function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot-password">("login")

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Verificar si tiene familia
      const familia = localStorage.getItem("familia")
      if (familia) {
        router.push("/dashboard")
      } else {
        router.push("/home")
      }
    }
  }, [isAuthenticated, isLoading, router])

  // Verificar si hay parámetro de recuperación
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "forgot-password") {
      setActiveTab("forgot-password")
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Bird className="w-8 h-8 text-primary-foreground animate-bounce" />
          </div>
          <p className="text-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bird className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">NuestroNido</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gestiona tu familia de manera fácil y divertida
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg shadow-md border border-border">
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register" | "forgot-password")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-t-lg border-b border-border bg-muted">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none rounded-tl-lg"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none rounded-tr-lg"
              >
                Crear Cuenta
              </TabsTrigger>
            </TabsList>

            <div className="p-6 sm:p-8">
              <TabsContent value="login" className="mt-0">
                <LoginForm 
                  onSuccess={() => router.push("/home")}
                  onForgotPassword={() => setActiveTab("forgot-password")}
                />
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <RegisterForm onSuccess={() => router.push("/home")} />
              </TabsContent>

              <TabsContent value="forgot-password" className="mt-0">
                <ForgotPasswordForm
                  onBack={() => setActiveTab("login")}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Forgot Password Section - Hidden by default */}
        {activeTab === "forgot-password" && (
          <div className="text-center mt-6 text-xs sm:text-sm text-muted-foreground">
            <p>¿Recordaste tu contraseña? <button onClick={() => setActiveTab("login")} className="text-primary hover:underline">Vuelve al login</button></p>
          </div>
        )}

        {/* Footer */}
        {activeTab !== "forgot-password" && (
          <div className="text-center mt-6 text-xs sm:text-sm text-muted-foreground">
            <p>Al continuar, aceptas nuestros términos de servicio</p>
          </div>
        )}
      </div>
    </div>
  )
}
