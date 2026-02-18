'use client';

import { Bird } from 'lucide-react';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error: _error, reset: _reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <section className="w-full">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <Bird className="w-12 h-12 text-destructive" />
              </div>
            </div>
            <h1 className="mb-4 text-7xl lg:text-9xl tracking-tight font-extrabold text-destructive">
              500
            </h1>
            <p className="mb-4 text-3xl md:text-4xl tracking-tight font-bold text-foreground">
              Error del servidor.
            </p>
            <p className="mb-6 text-lg font-light text-muted-foreground">
              Lo sentimos, ha ocurrido un error. Estamos trabajando para solucionar este problema.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
