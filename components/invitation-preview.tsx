'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bird, ShieldCheck, AlertCircle } from 'lucide-react';
import { FamilyService } from '@/services/family-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface InvitationPreviewProps {
  token: string;
  onConfirm: () => void;
  onCancel: () => void;
  autoFetch?: boolean;
}

export function InvitationPreview({ token, onConfirm, onCancel, autoFetch = true }: InvitationPreviewProps) {
  const [info, setInfo] = useState<{ family_name: string; inviter_name: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoFetch && token) {
      const fetchInfo = async () => {
        setLoading(true);
        try {
          const data = await FamilyService.getInvitationInfo(token);
          setInfo(data);
        } catch (err) {
          console.error('Error fetching invitation info:', err);
          setError('La invitación no es válida o ha expirado.');
        } finally {
          setLoading(false);
        }
      };
      fetchInfo();
    }
  }, [token, autoFetch]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-2">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-destructive/50">
        <CardHeader className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
          <CardTitle className="text-destructive">Invitación Inválida</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={onCancel}>Volver al Inicio</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!info) return null;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bird className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {info.family_name}
        </CardTitle>
        {info.inviter_name && (
          <p className="text-sm text-muted-foreground">
            Invitado por <span className="font-medium text-foreground">{info.inviter_name}</span>
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 text-center">
        <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3 text-left">
          <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Confirmación de Seguridad</p>
            <p className="text-xs text-muted-foreground">
              Estás a punto de unirte a esta familia. Tendrás acceso a sus listas, notas y tareas compartidas.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="w-full" onClick={onConfirm}>
          Confirmar y Unirse
        </Button>
      </CardFooter>
    </Card>
  );
}
