'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing-header';
import { SupportDialog } from '@/components/dialogs/support-dialog';
import { AnimatedHeroText } from '@/components/animated-hero-text';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';

function LandingPageContent() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token'); // In case implicit flow is used or param name varies

    if (code || token) {
      // Redirect to the auth callback handler to process the login
      // Construct the new URL preserving the query params
      const newUrl = `/auth/callback?${searchParams.toString()}`;
      router.push(newUrl);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/bg.svg')" }}>
      <main className="relative z-10">
        {/* Header */}
        <LandingHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-primary">
                <Bird className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Conectando familias, un nido a la vez
                </span>
              </div>
              
              <AnimatedHeroText />
              
              <p className="text-base sm:text-lg md:text-xl text-foreground mb-6 sm:mb-8 text-pretty max-w-2xl">
                NuestroNido ayuda a tu familia a coordinar tareas, compartir listas, organizar el
                hogar y mantener todo bajo control, con un sistema de gamificación que motiva a todos
                a participar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start">
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

            <div className="hidden lg:flex relative h-[400px] w-full bg-black/5 rounded-xl border-2 border-dashed border-primary/20 items-center justify-center">
                <span className="text-muted-foreground font-medium">Carrusel Próximamente</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* How it Works */}
        <HowItWorksSection />

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

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LandingPageContent />
    </Suspense>
  );
}
