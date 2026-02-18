'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LandingHeader } from '@/components/landing-header';
import { SupportDialog } from '@/components/dialogs/support-dialog';
import { AnimatedHeroText } from '@/components/animated-hero-text';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { useTranslations } from 'next-intl';

function LandingPageContent() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, family } = useAuth();
  const t = useTranslations('Landing');

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token');

    if (code || token) {
      // Redirect to the auth callback handler to process the login
      // Construct the new URL preserving the query params
      const newUrl = `/auth/callback?${searchParams.toString()}`;
      router.push(newUrl);
    }
  }, [searchParams, router]);

  const dashboardRoute = (user?.familyId || family) ? '/dashboard' : '/home';

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/bg.svg')" }}>
      <div className="absolute inset-0 bg-background/10 z-0"></div>
      <main className="relative z-10">
        {/* Header */}
        <LandingHeader />

        {/* Hero Section */}
        <section className="w-full pt-10 sm:pt-16 md:pt-24 pb-12 sm:pb-20 md:pb-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
              <AnimatedHeroText />
              
              <p className="text-base sm:text-lg md:text-xl text-foreground mb-8 sm:mb-10 text-pretty max-w-2xl font-medium mx-auto">
                Organizá el hogar y motivá a todos a participar,
                <br className="hidden sm:block" /> sin fricción ni discusiones.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
                <div className="flex flex-col items-center w-full sm:w-auto">
                  {isAuthenticated ? (
                    <Link href={dashboardRoute} className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-8 sm:px-10 shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
                      >
                        Ir a mi Nido
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/register" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-8 sm:px-10 shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
                      >
                        Comenzar gratis
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* How it Works */}
        <HowItWorksSection />

        {/* CTA Section */}
        <section className="w-full py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center bg-gradient-to-br from-card/80 via-card/50 to-primary/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl border border-primary/10"
            >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-primary mb-3 sm:mb-4">
              {t('cta_section.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-6 sm:mb-10">
              {t('cta_section.subtitle')}
            </p>
            <div className="flex flex-col items-center">
              {isAuthenticated ? (
                <Link href={dashboardRoute} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-10 sm:px-12 w-full sm:w-auto shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
                  >
                     {t('hero.cta_dashboard')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 text-base sm:text-lg px-10 sm:px-12 w-full sm:w-auto shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
                  >
                     {t('hero.cta_primary')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-card bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex flex-col items-center text-center gap-6">
                          <div className="flex items-center justify-center">
                            <img src="/logo.png" alt="NuestroNido Logo" className="h-12 w-auto object-contain" />
                          </div>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                <button
                  onClick={() => setIsSupportOpen(true)}
                  className="text-primary hover:underline text-sm font-medium transition-colors"
                >
                  {t('footer.help')}
                </button>
                <Link href="/privacy-policy" className="text-primary hover:underline text-sm font-medium transition-colors">
                  {t('footer.privacy')}
                </Link>
              </div>

              <div className="border-t border-card/50 w-full max-w-md pt-6">
                <p className="text-xs sm:text-sm text-foreground/60">
                  © 2025 NuestroNido. {t('footer.rights')}
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
