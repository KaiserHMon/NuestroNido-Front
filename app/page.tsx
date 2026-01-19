'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, ShoppingCart, StickyNote, Trophy, ArrowRight, Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingHeader } from '@/components/landing-header';
import { SupportDialog } from '@/components/dialogs/support-dialog';

export default function LandingPage() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/bg.svg')" }}>
      <main className="relative z-10">
        {/* Header */}
        <LandingHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-primary">
              <Bird className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">
                Conectando familias, un nido a la vez
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 sm:mb-6 text-balance px-2">
              Un hogar más organizado, conectado y en armonía - todo en un solo lugar -
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-foreground mb-6 sm:mb-8 text-pretty max-w-2xl mx-auto px-2">
              NuestroNido ayuda a tu familia a coordinar tareas, compartir listas, organizar el
              hogar y mantener todo bajo control, con un sistema de gamificación que motiva a todos
              a participar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-6 sm:px-8 shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
                >
                  Crear mi Nido
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
                Todo lo que tu familia necesita
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-foreground max-w-2xl mx-auto">
                Herramientas diseñadas para hacer la vida familiar más fácil y organizada
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="border-card bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-primary">
                    Calendario de Tareas
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-foreground">
                    Organiza las tareas del hogar y visualízalas en un calendario intuitivo.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-card bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-primary">
                    Listas Compartidas
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-foreground">
                    Crea listas de compras por categorías para mantener la casa abastecida.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-card bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <StickyNote className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-primary">
                    Notas Familiares
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-foreground">
                    Comparte recordatorios y mensajes importantes para que todos estén alineados.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-card bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-primary">Gamificación</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-foreground">
                    Motiva la colaboración en las tareas del hogar con puntos y rankings.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-gradient-to-br from-card via-card/95 to-card/80 border border-card">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
                Cómo funciona
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-foreground">
                En pocos minutos, tu hogar empieza a funcionar de manera más organizada.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-base sm:text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">Crea tu Nido</h3>
                  <p className="text-foreground text-base sm:text-lg">
                    Regístrate y crea tu grupo familiar en segundos. Tú serás el creador del nido.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-base sm:text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                    Invita a tu familia
                  </h3>
                  <p className="text-foreground text-base sm:text-lg">
                    Comparte el código de invitación con tus familiares para que se unan al nido.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-base sm:text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                    Organízate y colabora
                  </h3>
                  <p className="text-foreground text-base sm:text-lg">
                    Asigna tareas, comparte listas, gana puntos y mantén a toda la familia
                    sincronizada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-card via-card to-primary/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
              Comienza a organizar tu familia hoy
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-6 sm:mb-8">
              Únete a miles de familias que ya están disfrutando de un hogar más organizado
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
              >
                Crear mi Nido
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-card bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bird className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground text-lg">NuestroNido</span>
              </div>
              <p className="text-foreground/80 text-sm sm:text-base max-w-md">
                Conectando familias, un nido a la vez.
              </p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <button
                  onClick={() => setIsSupportOpen(true)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  ¿Necesitas ayuda? Contacta con soporte
                </button>
                <Link href="/privacy-policy" className="text-primary hover:underline text-sm font-medium">
                  Política de Privacidad
                </Link>
              </div>

              <div className="border-t border-card w-full max-w-md mt-4 pt-4">
                <p className="text-xs sm:text-sm text-foreground/80">
                  © 2025 NuestroNido. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Support Dialog */}
      <SupportDialog open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
}
