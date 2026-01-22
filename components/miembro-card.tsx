'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, LogOut } from 'lucide-react';
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
    <Card className="border border-border bg-card overflow-hidden transition-all hover:shadow-sm">
      <CardContent className="p-5 flex flex-row items-center gap-4 relative min-h-[100px]">
        {/* Avatar centrado a la izquierda */}
        <MiembroAvatar
          nombre={miembro.nombre}
          color={miembro.color}
          imageUrl={miembro.nivel?.image_url}
          size="lg"
          className="w-14 h-14 text-lg shrink-0"
        />

        {/* Info: Nombre y Título (Nivel) */}
        <div className="flex flex-col min-w-0 pr-16">
          <h4 className="font-bold text-foreground text-base truncate" title={miembro.nombre}>
            {miembro.nombre}
          </h4>
          <span className="text-sm text-muted-foreground truncate">
            {miembro.nivel?.name || 'Miembro'}
          </span>
        </div>

        {/* Botones de acción arriba a la derecha */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {esMiembro && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditar(miembro)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Editar perfil"
                aria-label="Editar perfil"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEliminar(miembro)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Salir de la familia"
                aria-label="Salir de la familia"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
          {esCreador && !esMiembro && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEliminar(miembro)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Eliminar miembro"
              aria-label={`Eliminar a ${miembro.nombre}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
