import Link from 'next/link';
import { Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <section className="w-full">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <Bird className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mb-4 text-7xl lg:text-9xl tracking-tight font-extrabold text-primary">
              404
            </h1>
            <p className="mb-4 text-3xl md:text-4xl tracking-tight font-bold text-foreground">
              Algo falta.
            </p>
            <p className="mb-6 text-lg font-light text-muted-foreground">
              Lo sentimos, no podemos encontrar esa página. Encontrarás muchas cosas para explorar
              en la página de inicio.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-medium px-6 py-2.5 shadow-md shadow-primary/30 transition-all duration-300">
                Volver a Inicio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
