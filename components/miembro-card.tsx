'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, LogOut } from 'lucide-react';
import { MiembroAvatar } from '@/components/ui/miembro-avatar';
import { Miembro } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface MiembroCardProps {
  miembro: Miembro;
  esMiembro: boolean; // Si es el usuario actual
  esCreador: boolean; // Si el usuario actual es el creador de la familia
  rank?: number; // Rango en el leaderboard (1, 2, 3)
  onEliminar: (miembro: Miembro) => void;
  onEditar: (miembro: Miembro) => void;
}

export function MiembroCard({
  miembro,
  esMiembro,
  esCreador,
  rank,
  onEliminar,
  onEditar,
}: MiembroCardProps) {
  const esMiembroCreador = miembro.rolId === 'creador';

  return (
    <Card className="rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none bg-card overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 group">
      <CardContent className="p-5 py-6 flex flex-row items-center gap-5 relative min-h-[100px]">
        {/* Avatar centrado a la izquierda - Opción A: Protagonista */}
        <div className="shrink-0 relative flex flex-col items-center">
          <MiembroAvatar
            nombre={miembro.nombre}
            color={miembro.color}
            imageUrl={miembro.nivel?.image_url}
            size="lg"
            className="w-[64px] h-[64px] text-xl border-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-transform group-hover:scale-105"
            style={{ borderColor: miembro.color.bg }}
          />
          {rank && (
            <div className={`absolute -bottom-2 bg-card rounded-full shadow-md border border-border/50 animate-in zoom-in duration-300 leading-none ${rank <= 3 ? 'p-1.5 text-lg' : 'px-2 py-1 text-[10px] font-bold text-muted-foreground'}`}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
            </div>
          )}
        </div>

        {/* Info: Nombre y Título (Nivel) */}
        <div className="flex flex-col min-w-0 pr-12 flex-1 justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-bold text-foreground text-lg truncate" title={miembro.nombre}>
              {miembro.nombre}
            </h4>
            {esMiembroCreador && (
              <Badge variant="secondary" className="bg-red-100 text-red-500 hover:bg-red-100 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider border-none shadow-sm uppercase">
                CREADOR
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground truncate font-semibold opacity-70">
                {miembro.nivel?.name || 'Miembro'}
            </span>
          </div>
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
