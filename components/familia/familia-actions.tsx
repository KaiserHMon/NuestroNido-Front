'use client';

import { Familia } from '@/lib/types';
import { EditarFamiliaDialog } from '@/components/dialogs/editar-familia-dialog';
import { EliminarFamiliaDialog } from '@/components/dialogs/eliminar-familia-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface FamiliaActionsProps {
  familia: Familia;
  esCreador: boolean;
  onFamiliaActualizada?: () => void;
  onFamiliaEliminada?: () => void;
  variant?: 'header' | 'nav';
}

export function FamiliaActions({
  familia,
  esCreador,
  onFamiliaActualizada,
  onFamiliaEliminada: _onFamiliaEliminada,
  variant = 'header',
}: FamiliaActionsProps) {
  // Si no es creador, no mostrar nada
  if (!esCreador) {
    return null;
  }

  const buttonClass =
    variant === 'nav'
      ? 'h-8 sm:h-10 p-0 text-primary-foreground hover:bg-primary-foreground/20'
      : 'h-8 w-8 p-0 hover:bg-primary/10';

  const editIconClass = variant === 'nav' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4';
  const deleteIconClass = variant === 'nav' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4';
  const editIconColor = variant === 'nav' ? '' : 'text-primary';
  const deleteIconColor = variant === 'nav' ? '' : 'text-destructive';

  // Mostrar botones siempre, sin dropdown
  return (
    <div className="flex items-center gap-1">
      <EditarFamiliaDialog
        familia={familia}
        onSuccess={onFamiliaActualizada}
        trigger={
          <Button variant="ghost" size="sm" className={buttonClass} title="Editar nombre">
            <Edit2 className={`${editIconClass} ${editIconColor}`} />
          </Button>
        }
      />

      <EliminarFamiliaDialog
        familia={familia}
        trigger={
          <Button variant="ghost" size="sm" className={buttonClass} title="Eliminar familia">
            <Trash2 className={`${deleteIconClass} ${deleteIconColor}`} />
          </Button>
        }
      />
    </div>
  );
}
