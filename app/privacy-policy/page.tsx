'use client';

import { Bird } from 'lucide-react';
import { LandingHeader } from '@/components/landing-header';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen relative bg-background">
       {/* Background pattern similar to landing page if needed, or simple background */}
       <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "url('/bg.svg')", backgroundSize: 'cover' }}></div>

      <div className="relative z-10">
        <LandingHeader />

        <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-lg border border-card">
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 shadow-lg shadow-primary/30">
                <Bird className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Política de Privacidad
              </h1>
              <p className="text-muted-foreground">
                Última actualización: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8 text-foreground/90">
              
              <section>
                <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                  1. Datos que recolectamos
                </h2>
                <div className="bg-background/50 p-4 rounded-lg border border-border">
                  <p className="mb-2">Para brindarte nuestros servicios, únicamente almacenamos la siguiente información básica:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li><span className="font-medium text-foreground">Nombre completo</span> (proporcionado por tu cuenta de Google).</li>
                    <li><span className="font-medium text-foreground">Dirección de correo electrónico</span>.</li>
                    <li><span className="font-medium text-foreground">Foto de perfil</span> (si está disponible en tu cuenta de Google).</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                  2. Finalidad del uso de datos
                </h2>
                <p>
                  La información recolectada se utiliza exclusivamente para:
                </p>
                <ul className="list-disc list-inside mt-2 ml-2 text-muted-foreground space-y-1">
                  <li>Identificarte como usuario dentro de la aplicación.</li>
                  <li>Permitir que otros miembros de tu familia te reconozcan.</li>
                  <li>Asignar y gestionar tareas, listas y eventos dentro de tu "Nido" (grupo familiar).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                  3. Servicios de Terceros
                </h2>
                <p className="mb-2">
                  Para garantizar la seguridad y fiabilidad de nuestra plataforma, utilizamos la infraestructura de proveedores de confianza:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-background/50 p-4 rounded-lg border border-border">
                        <strong className="block text-foreground mb-1">Google</strong>
                        <span className="text-sm text-muted-foreground">Utilizado como proveedor de identidad para asegurar un inicio de sesión rápido y seguro.</span>
                    </div>
                    <div className="bg-background/50 p-4 rounded-lg border border-border">
                        <strong className="block text-foreground mb-1">Supabase</strong>
                        <span className="text-sm text-muted-foreground">Provee nuestra base de datos y sistema de autenticación, asegurando que tus datos estén encriptados y protegidos.</span>
                    </div>
                </div>
              </section>

              <section>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-primary mb-3">
                    4. No venta de datos
                    </h2>
                    <p className="text-foreground font-medium">
                    Queremos ser claros: <span className="underline decoration-primary decoration-2 underline-offset-2">No vendemos, alquilamos ni compartimos tu información personal con terceros</span> para fines publicitarios ni comerciales. Tu privacidad es nuestra prioridad.
                    </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                  5. Control y Borrado de datos
                </h2>
                <p>
                  Tienes el control total sobre tu información. Si en algún momento deseas dejar de usar NuestroNido, puedes eliminar tu cuenta y todos tus datos asociados desde la pantalla de <span className="font-medium text-foreground">Inicio (Home)</span>. Ten en cuenta que para realizar esta acción no debes pertenecer a ninguna familia activa.
                </p>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-muted-foreground text-sm">
                Si tienes dudas adicionales, puedes contactar a nuestro equipo de soporte.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
