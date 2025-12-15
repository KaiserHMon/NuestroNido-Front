"use client"

import { Suspense } from "react"
import { Bird } from "lucide-react"
import { RecoverPasswordContent } from "@/components/auth/recover-password-content"

function RecoverPasswordLoading() {
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

export default function RecoverPasswordPage() {
  return (
    <Suspense fallback={<RecoverPasswordLoading />}>
      <RecoverPasswordContent />
    </Suspense>
  )
}
