'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Bird } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinByCodePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading, joinFamily, family } = useAuth();
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

    // If already in a family, redirect silently to dashboard
    if (family) {
      router.push('/dashboard');
      return;
    }

    const performJoin = async () => {
      setIsJoining(true);
      try {
        await joinFamily(code);
        toast.success('¡Te has unido a la familia!');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error joining family:', error);
        toast.error('Error al unirse a la familia. Verifica el código o si ya eres miembro.');
        router.push('/home');
        setIsJoining(false);
      }
    };

    performJoin();
  }, [isAuthenticated, isLoading, family, joinFamily, code, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto animate-bounce">
          <Bird className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-foreground text-xl font-bold">
            {isJoining ? 'Uniéndote al nido...' : 'Procesando invitación...'}
          </p>
          <p className="text-muted-foreground">Estamos preparando tu nuevo espacio familiar</p>
        </div>
      </div>
    </div>
  );
}
