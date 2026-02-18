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
        
        // Small delay to ensure profile data loads correctly
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
          <Bird className="w-8 h-8 text-primary-foreground animate-bounce" />
        </div>
        <p className="text-foreground text-lg font-medium">
          {isJoining ? 'Joining the nest...' : 'Processing invitation...'}
        </p>
      </div>
    </div>
  );
}
