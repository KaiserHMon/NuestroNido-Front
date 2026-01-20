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
    <Card className="border border-border bg-card overflow-hidden h-full transition-all hover:shadow-sm">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3 h-full relative min-h-[140px]">
        {/* Botones de acción en la esquina superior derecha */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {esMiembro && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditar(miembro)}
                className="h-7 w-7 p-0 hover:bg-primary/10 text-primary"
                title="Editar perfil"
                aria-label="Editar perfil"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEliminar(miembro)}
                className="h-7 w-7 p-0 hover:bg-destructive/10 text-destructive"
                title="Salir de la familia"
                aria-label="Salir de la familia"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
          {esCreador && !esMiembro && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEliminar(miembro)}
              className="h-7 w-7 p-0 hover:bg-destructive/10 text-destructive"
              title="Eliminar miembro"
              aria-label={`Eliminar a ${miembro.nombre}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Avatar centrado */}
        <MiembroAvatar
          nombre={miembro.nombre}
          color={miembro.color}
          imageUrl={miembro.nivel?.image_url}
          size="lg"
          className="w-14 h-14 text-lg"
        />

        {/* Nombre y rol */}
        <div className="space-y-1.5 w-full overflow-hidden">
          <div className="flex items-center justify-center gap-2">
            <h4 className="font-bold text-foreground text-sm sm:text-base truncate px-1">
              {miembro.nombre}
            </h4>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            {esMiembro && (
              <Badge className="text-[10px] px-1.5 h-4 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/20">
                Tú
              </Badge>
            )}
            {miembro.rolId === 'creador' && (
              <Badge className="text-[10px] px-1.5 h-4 bg-primary text-primary-foreground hover:bg-primary">
                Creador
              </Badge>
            )}
            {!esMiembro && miembro.rolId !== 'creador' && (
              <Badge variant="outline" className="text-[10px] px-1.5 h-4 text-muted-foreground border-muted-foreground/30">
                Miembro
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
