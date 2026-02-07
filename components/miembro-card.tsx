'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, LogOut, Crown } from 'lucide-react';
import { MiembroAvatar } from '@/components/ui/miembro-avatar';
import { Miembro } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface MiembroCardProps {
  miembro: Miembro;
  esMiembro: boolean; // Si es el usuario actual
  esCreador: boolean; // Si el usuario actual es el creador de la familia
  isFirst?: boolean; // Si es el primero en el leaderboard
  onEliminar: (miembro: Miembro) => void;
  onEditar: (miembro: Miembro) => void;
}

export function MiembroCard({
  miembro,
  esMiembro,
  esCreador,
  isFirst,
  onEliminar,
  onEditar,
}: MiembroCardProps) {
  const esMiembroCreador = miembro.rolId === 'creador';

  return (
    <Card className="rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border-none bg-card overflow-hidden transition-all hover:shadow-md group">
      <CardContent className="p-5 py-6 flex flex-row items-center gap-5 relative min-h-[100px]">
        {/* Avatar centrado a la izquierda - Opción A: Protagonista */}
        <div className="shrink-0 relative">
          {isFirst && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 drop-shadow-md">
              <Crown className="w-5 h-5 text-primary fill-primary" />
            </div>
          )}
          <MiembroAvatar
            nombre={miembro.nombre}
            color={miembro.color}
            imageUrl={miembro.nivel?.image_url}
            size="lg"
            className="w-[60px] h-[60px] text-xl border-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            style={{ borderColor: miembro.color.bg }}
          />
        </div>

        {/* Info: Nombre y Título (Nivel) */}
        <div className="flex flex-col min-w-0 pr-16 flex-1 justify-center">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-foreground text-base truncate" title={miembro.nombre}>
              {miembro.nombre}
            </h4>
            {esMiembroCreador && (
              <Badge variant="secondary" className="bg-[#FFE3E3] text-[#FF5A5A] hover:bg-[#FFE3E3] rounded-full px-2 py-0.5 text-[11px] font-bold tracking-normal border-none shadow-none h-auto">
                CREADOR
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate font-medium opacity-80">
            {miembro.nivel?.name || 'Miembro'}
          </span>
        </div>

        {/* Botones de acción alineados verticalmente al centro */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {esMiembro && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditar(miembro)}
                className="h-8 w-8 text-muted-foreground/60 hover:text-[#FF5A5A] hover:bg-transparent"
                title="Editar perfil"
                aria-label="Editar perfil"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEliminar(miembro)}
                className="h-8 w-8 text-muted-foreground/60 hover:text-[#FF5A5A] hover:bg-transparent"
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
              className="h-8 w-8 text-muted-foreground/60 hover:text-[#FF5A5A] hover:bg-transparent"
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
