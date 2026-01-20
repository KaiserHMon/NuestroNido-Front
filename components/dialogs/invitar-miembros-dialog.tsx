'use client';

import { useState, useEffect } from 'react';
import { Familia } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Loader2 } from 'lucide-react';
import { FamilyService } from '@/services/family-service';

interface InvitarMiembrosDialogProps {
  familia: Familia;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvitarMiembrosDialog({ familia, open, onOpenChange }: InvitarMiembrosDialogProps) {
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [codigoInvitacion, setCodigoInvitacion] = useState('');
  const [linkInvitacion, setLinkInvitacion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const cargarInvitaciones = async () => {
        setLoading(true);
        try {
          const [codeData, linkData] = await Promise.all([
            FamilyService.createInvitationCode(5, 48),
            FamilyService.createInvitationLink()
          ]);
          setCodigoInvitacion(codeData.code);
          
          // El API devuelve el link completo. Si necesitamos que apunte al dominio actual:
          const url = new URL(linkData.link);
          const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
          const localLink = `${currentOrigin}/invite${url.pathname.replace('/invite', '')}`;
          setLinkInvitacion(localLink);
        } catch (error) {
          console.error('Error al generar invitaciones:', error);
        } finally {
          setLoading(false);
        }
      };
      cargarInvitaciones();
    }
  }, [open]);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigoInvitacion);
      setCodigoCopiado(true);
      setTimeout(() => setCodigoCopiado(false), 2000);
    } catch (err) {
      console.error('Error copiando código:', err);
    }
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkInvitacion);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2000);
    } catch (err) {
      console.error('Error copiando link:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Invitar a Familiar</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Genera un código o enlace temporal para agregar miembros a tu familia.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generando invitaciones...</p>
          </div>
        ) : (
          <Tabs defaultValue="codigo" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="codigo" className="text-xs sm:text-sm">
                Código
              </TabsTrigger>
              <TabsTrigger value="link" className="text-xs sm:text-sm">
                Link Mágico
              </TabsTrigger>
            </TabsList>

            {/* TAB: CÓDIGO DE INVITACIÓN */}
            <TabsContent value="codigo" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Código de Invitación</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={codigoInvitacion}
                    placeholder="Generando..."
                    className="bg-muted border-border text-foreground font-mono text-sm"
                  />
                  <Button
                    onClick={copiarCodigo}
                    disabled={!codigoInvitacion}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-3"
                  >
                    {codigoCopiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Válido por 48 horas o 5 usos. Los miembros deben ingresarlo manualmente.
                </p>
              </div>
            </TabsContent>

            {/* TAB: LINK DE INVITACIÓN */}
            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Link de Invitación</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={linkInvitacion}
                    placeholder="Generando..."
                    className="bg-muted border-border text-foreground font-mono text-xs"
                  />
                  <Button
                    onClick={copiarLink}
                    disabled={!linkInvitacion}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-3"
                  >
                    {linkCopiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Válido por 24 horas. 
                  <span className="block mt-1 text-amber-600 dark:text-amber-500 font-medium">
                    ⚠️ Cualquiera con este enlace podrá unirse a tu familia. Compártelo solo con personas de confianza.
                  </span>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
