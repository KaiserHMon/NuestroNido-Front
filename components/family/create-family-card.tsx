'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateFamilySchema, CreateFamilyFormInputs } from '@/lib/validation';
import { useFamily } from '@/hooks/use-family';

interface CreateFamilyCardProps {
  onSuccess?: () => void;
}

export function CreateFamilyCard({ onSuccess }: CreateFamilyCardProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createFamily } = useFamily();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFamilyFormInputs>({
    resolver: zodResolver(CreateFamilySchema),
  });

  const handleFormSubmit = async (data: CreateFamilyFormInputs) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createFamily(data.name);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la familia';
      
      if (
        message.includes('User already belongs to a family') || 
        (err && typeof err === 'object' && 'response' in err && (err as { response?: { status: number } }).response?.status === 400 && message.includes('belongs to a family'))
      ) {
        router.push('/dashboard');
        return;
      }

      setError(message);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <Card className="border border-border bg-card flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center animate-bounce">
          <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="text-foreground text-lg font-medium">Creando tu nuevo nido...</p>
          <p className="text-muted-foreground text-sm">Estamos preparando todo para tu familia</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">Crear un Nuevo Nido</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sé el creador y maneja todo desde el inicio
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Nombre de la familia
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: Familia García"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ Serás el creador de la familia</p>
            <p>✓ Podrás invitar a otros miembros</p>
            <p>✓ Acceso completo a todas las funciones</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando familia...
              </>
            ) : (
              'Crear Familia'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
