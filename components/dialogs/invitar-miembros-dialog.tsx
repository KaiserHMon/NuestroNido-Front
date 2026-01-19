'use client';

import { useState } from 'react';
import { Familia } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';

interface InvitarMiembrosDialogProps {
  familia: Familia;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvitarMiembrosDialog({ familia, open, onOpenChange }: InvitarMiembrosDialogProps) {
  const [codigoCopiado, setCodigoCopiado] = useState(false);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(familia.codigoInvitacion);
      setCodigoCopiado(true);
      setTimeout(() => setCodigoCopiado(false), 2000);
    } catch (err) {
      console.error('Error copiando código:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Invitar a Familiar</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Comparte el código o enlace para agregar miembros a tu familia.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="codigo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="codigo" className="text-xs sm:text-sm">
              Código
            </TabsTrigger>
            <TabsTrigger value="link" className="text-xs sm:text-sm">
              Link
            </TabsTrigger>
          </TabsList>

          {/* TAB: CÓDIGO DE INVITACIÓN */}
          <TabsContent value="codigo" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Código de Invitación</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={familia.codigoInvitacion}
                  className="bg-muted border-border text-foreground font-mono text-sm"
                />
                <Button
                  onClick={copiarCodigo}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-3"
                >
                  {codigoCopiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Comparte este código con otros para que se unan a tu familia
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
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join/${familia.codigoInvitacion}`}
                  className="bg-muted border-border text-foreground font-mono text-xs"
                />
                <Button
                  onClick={() => {
                    const link = `${window.location.origin}/join/${familia.codigoInvitacion}`;
                    navigator.clipboard.writeText(link);
                    setCodigoCopiado(true);
                    setTimeout(() => setCodigoCopiado(false), 2000);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-3"
                >
                  {codigoCopiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Comparte este link directo para que se unan automáticamente
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
