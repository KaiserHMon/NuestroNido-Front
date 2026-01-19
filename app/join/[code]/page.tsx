'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Bird } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading, unirseAFamilia, familia } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const code = params.code as string;

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    if (!isAuthenticated) {
      // If not authenticated, redirect to register with the code
      // We pass it as a query param so the register page could potentially use it (future enhancement)
      router.push(`/register?code=${code}`);
      return;
    }

    // If already in a family, check if it's the same one? 
    // The API join endpoint might handle "already in family" error.
    // For now, if local state says we have a family, we warn and redirect.
    // But maybe the user wants to switch families? The UI usually requires leaving first.
    if (familia) {
      toast.info('Ya perteneces a una familia. Debes salir de ella para unirte a otra.');
      router.push('/dashboard');
      return;
    }

    const join = async () => {
      setIsJoining(true);
      try {
        await unirseAFamilia(code);
        toast.success('¡Te has unido a la familia!');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error joining family:', error);
        toast.error('Error al unirse a la familia. Verifica el código o si ya eres miembro.');
        router.push('/home');
      } finally {
        setIsJoining(false);
      }
    };

    join();
  }, [isAuthenticated, isLoading, familia, unirseAFamilia, code, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
          <Bird className="w-8 h-8 text-primary-foreground animate-bounce" />
        </div>
        <p className="text-foreground text-lg font-medium">
          {isJoining ? 'Uniéndote al nido...' : 'Procesando invitación...'}
        </p>
      </div>
    </div>
  );
}
