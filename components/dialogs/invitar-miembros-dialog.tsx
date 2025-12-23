'use client';

import { useState } from 'react';
import { Familia, Miembro } from '@/lib/types';
import { COLORES_DISPONIBLES } from '@/lib/colors';
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
import { Copy, Check } from 'lucide-react';

interface InvitarMiembrosDialogProps {
  familia: Familia;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMiembroAgregado?: () => void;
}

export function InvitarMiembrosDialog({
  familia,
  open,
  onOpenChange,
  onMiembroAgregado,
}: InvitarMiembrosDialogProps) {
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const [nuevoNombreMiembro, setNuevoNombreMiembro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(familia.codigoInvitacion);
      setCodigoCopiado(true);
      setTimeout(() => setCodigoCopiado(false), 2000);
    } catch (err) {
      console.error('Error copiando código:', err);
    }
  };

  const handleAgregarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoNombreMiembro.trim()) return;

    setIsSubmitting(true);
    try {
      const colorAleatorio =
        COLORES_DISPONIBLES[Math.floor(Math.random() * COLORES_DISPONIBLES.length)];

      const nuevoMiembro: Miembro = {
        id: 'miembro-' + Date.now(),
        nombre: nuevoNombreMiembro,
        color: colorAleatorio,
        puntos: 0,
        rolId: 'miembro',
        familiaId: familia.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const familiaActualizada: Familia = {
        ...familia,
        miembros: [...familia.miembros, nuevoMiembro],
      };

      localStorage.setItem('familia', JSON.stringify(familiaActualizada));
      setNuevoNombreMiembro('');
      onMiembroAgregado?.();
    } catch (error) {
      console.error('Error agregando miembro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Invitar a Miembros</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Comparte tu familia o agrega un miembro manualmente
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="codigo" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="codigo" className="text-xs sm:text-sm">
              Código
            </TabsTrigger>
            <TabsTrigger value="link" className="text-xs sm:text-sm">
              Link
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-xs sm:text-sm">
              Manual
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

          {/* TAB: AGREGAR MANUALMENTE */}
          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleAgregarMiembro} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-foreground">
                  Nombre del Miembro
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Juan García"
                  value={nuevoNombreMiembro}
                  onChange={(e) => setNuevoNombreMiembro(e.target.value)}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNuevoNombreMiembro('');
                    onOpenChange(false);
                  }}
                  className="text-foreground border-border hover:bg-muted"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!nuevoNombreMiembro.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Agregando...' : 'Agregar Miembro'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
