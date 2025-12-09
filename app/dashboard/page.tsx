"use client"

import { useState } from "react"
import { Calendar, ShoppingCart, Users, StickyNote, Bird } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MiembrosSection } from "@/components/miembros-section"
import { CalendarioSection } from "@/components/calendario-section"
import { ListaSection } from "@/components/lista-section"
import { NotasSection } from "@/components/notas-section"

type Section = "miembros" | "calendario" | "lista" | "notas"

export default function NuestroNidoApp() {
  const [activeSection, setActiveSection] = useState<Section>("miembros")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                <Bird className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">NuestroNido</h1>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-primary backdrop-blur-sm border-b border-primary sticky top-[57px] sm:top-[65px] z-10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-3 scrollbar-hide">
            <Button
              variant="ghost"
              onClick={() => setActiveSection("miembros")}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === "miembros" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground" : "text-primary-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Miembros</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection("calendario")}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === "calendario" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground" : "text-primary-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Calendario</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection("lista")}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === "lista" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground" : "text-primary-foreground"
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Lista</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection("notas")}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === "notas" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground" : "text-primary-foreground"
              }`}
            >
              <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Notas</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {activeSection === "miembros" && <MiembrosSection />}
        {activeSection === "calendario" && <CalendarioSection />}
        {activeSection === "lista" && <ListaSection />}
        {activeSection === "notas" && <NotasSection />}
      </main>
    </div>
  )
}
