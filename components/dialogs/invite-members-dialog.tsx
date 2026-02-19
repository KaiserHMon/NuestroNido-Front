'use client';

import { useState, useEffect } from 'react';
import { Family } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Loader2 } from 'lucide-react';
import { FamilyService } from '@/services/family-service';

interface InviteMembersDialogProps {
  family: Family;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMembersDialog({ open, onOpenChange }: InviteMembersDialogProps) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');
  const [invitationLink, setInvitationLink] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const loadInvitations = async () => {
        setLoading(true);
        try {
          const [codeResult, linkResult] = await Promise.allSettled([
            FamilyService.createInvitationCode(5, 48),
            FamilyService.createInvitationLink(),
          ]);

          if (codeResult.status === 'fulfilled') {
            setInvitationCode(codeResult.value.code);
          } else {
            console.error('Error generating code:', codeResult.reason);
          }

          if (linkResult.status === 'fulfilled') {
            const linkData = linkResult.value;
            try {
              const url = new URL(linkData.link);
              const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
              const localLink = `${currentOrigin}/invite${url.pathname.replace('/invite', '')}`;
              setInvitationLink(localLink);
            } catch (e) {
              console.error('Error processing link:', e);
              setInvitationLink(linkData.link);
            }
          } else {
            console.error('Error generating link:', linkResult.reason);
          }
        } catch (error) {
          console.error('Unexpected error generating invitations:', error);
        } finally {
          setLoading(false);
        }
      };
      loadInvitations();
    }
  }, [open]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(invitationCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Error copying code:', err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Error copying link:', err);
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

            <TabsContent value="codigo" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Código de Invitación</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={invitationCode}
                    placeholder="Generando..."
                    className="bg-muted border-border text-foreground font-mono text-sm"
                  />
                  <Button
                    onClick={copyCode}
                    disabled={!invitationCode}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-3"
                  >
                    {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Válido por 48 horas o 5 usos. Los miembros deben ingresarlo manualmente.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Link de Invitación</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={invitationLink}
                    placeholder="Generando..."
                    className="bg-muted border-border text-foreground font-mono text-xs"
                  />
                  <Button
                    onClick={copyLink}
                    disabled={!invitationLink}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-3"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Válido por 24 horas.
                  <span className="block mt-1 text-amber-600 dark:text-amber-500 font-medium">
                    ⚠️ Cualquiera con este enlace podrá unirse a tu familia. Compártelo solo con
                    personas de confianza.
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
