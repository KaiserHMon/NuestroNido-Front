'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MiembroAvatar } from '@/components/ui/miembro-avatar';
import { Miembro } from '@/lib/types';

interface MiembroCardProps {
  miembro: Miembro;
  esMiembro: boolean; // Si es el usuario actual
  esCreador: boolean; // Si el usuario actual es el creador de la familia
  onEliminar: (miembro: Miembro) => void;
  onEditar: (miembro: Miembro) => void;
}

export function MiembroCard({
  miembro,
  esMiembro,
  esCreador,
  onEliminar,
  onEditar,
}: MiembroCardProps) {
  return (
    <Card className="border border-border bg-card overflow-hidden h-full">
      <CardContent className="p-2 space-y-2 flex flex-col h-full">
        {/* Header del Card */}
        <div className="flex items-start justify-between gap-2">
          <MiembroAvatar
            nombre={miembro.nombre}
            color={miembro.color}
            imageUrl={miembro.nivel?.image_url}
            size="lg"
          />
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {esMiembro && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEliminar(miembro)}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
                  title="Salir de la familia"
                  aria-label="Salir de la familia"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditar(miembro)}
                  className="h-6 w-6 p-0 hover:bg-primary/10 text-primary"
                  title="Editar perfil"
                  aria-label="Editar perfil"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </>
            )}
            {esCreador && !esMiembro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEliminar(miembro)}
                className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
                title="Eliminar miembro"
                aria-label={`Eliminar a ${miembro.nombre}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Nombre y rol */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground text-sm">{miembro.nombre}</h4>
            {esMiembro && (
              <Badge className="text-[10px] px-1 h-4 bg-primary/20 text-primary border border-primary/30">
                Tú
              </Badge>
            )}
          </div>
          {miembro.rolId === 'creador' && (
            <Badge className="mt-1 text-[10px] px-1 h-4 bg-primary text-primary-foreground">Creador</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
