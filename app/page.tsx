import Link from 'next/link';
import { Calendar, ShoppingCart, StickyNote, Trophy, Check, ArrowRight, Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { birdLayout } from '@/config/birdConfig';
import { LandingHeader } from '@/components/landing-header';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        {birdLayout.map((b, i) => (
          <Bird
            key={i}
            className="absolute text-primary/30 rotate-10"
            style={{
              top: b.top,
              left: b.left,
              right: b.right,
              width: b.size,
              height: b.size,
            }}
          />
        ))}
      </div>
      <main className="relative z-10">
        {/* Header */}
        <LandingHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-primary">
              <Bird className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Organiza tu hogar en familia</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 sm:mb-6 text-balance px-2">
              Tu familia, organizada y conectada en un solo lugar
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-foreground mb-6 sm:mb-8 text-pretty max-w-2xl mx-auto px-2">
              NuestroNido es la plataforma que ayuda a las familias a coordinar tareas, compartir
              listas de compras y mantenerse organizados con un sistema de gamificación que motiva a
              todos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-6 sm:px-8 shadow-md shadow-primary/30 transition-all duration-300"
                >
                  Crear mi Nido
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base sm:text-lg px-6 sm:px-8 bg-transparent shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/40"
              >
                Ver Demo
              </Button>
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
                    Calendario Familiar
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-foreground">
                    Organiza tareas únicas o recurrentes, asigna responsables y visualiza todo en un
                    calendario intuitivo
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
                    Crea listas de compras por categorías que toda la familia puede ver y actualizar
                    en tiempo real
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
                    Sistema de puntos y tabla de posiciones que motiva a todos a participar en las
                    tareas del hogar
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
                    Comparte observaciones, recordatorios y mensajes importantes con toda la familia
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
                Comienza en minutos y organiza a tu familia hoy mismo
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

        {/* Pricing Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
                Planes para cada familia
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-foreground">
                Elige el plan que mejor se adapte a las necesidades de tu hogar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Free Plan */}
              <Card className="border-card bg-card flex flex-col">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl text-primary">Nido Básico</CardTitle>
                  <div className="mt-3 sm:mt-4">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">$0</span>
                    <span className="text-foreground text-sm sm:text-base">/mes</span>
                  </div>
                  <CardDescription className="text-foreground mt-2 text-sm sm:text-base">
                    Perfecto para familias pequeñas
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 flex flex-col flex-grow">
                  <ul className="space-y-2 sm:space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">Hasta 2 miembros</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">
                        Hasta 5 tareas semanales
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">
                        Hasta 3 notas permanentes
                      </span>
                    </li>
                  </ul>
                  <Link href="/dashboard" className="block mt-auto">
                    <Button className="w-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-sm sm:text-base shadow-md shadow-primary/30 transition-all duration-300">
                      Comenzar Gratis
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="border-primary bg-gradient-to-br from-card via-card to-card/80 shadow-xl shadow-primary/40 relative flex flex-col ring-2 ring-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/60 hover:ring-primary/70">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg shadow-primary/50">
                  Más Popular
                </div>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl text-primary">Nido Familiar</CardTitle>
                  <div className="mt-3 sm:mt-4">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">$4.99</span>
                    <span className="text-foreground text-sm sm:text-base">/mes</span>
                  </div>
                  <CardDescription className="text-foreground mt-2 text-sm sm:text-base">
                    Ideal para la mayoría de familias
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 flex flex-col flex-grow">
                  <ul className="space-y-2 sm:space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">Hasta 5 miembros</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">
                        Tareas ilimitadas
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">Notas ilimitadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">
                        Acceso anticipado a nuevas funcionalidades
                      </span>
                    </li>
                  </ul>
                  <Link href="/dashboard" className="block mt-auto">
                    <Button className="w-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-sm sm:text-base shadow-md shadow-primary/30 transition-all duration-300">
                      Comenzar Ahora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto shadow-md shadow-primary/30 transition-all duration-300"
              >
                Crear mi Nido Gratis
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
                Organizando familias, un nido a la vez.
              </p>
              <div className="border-t border-card w-full max-w-md mt-4 pt-4">
                <p className="text-xs sm:text-sm text-foreground/80">
                  © 2025 NuestroNido. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
