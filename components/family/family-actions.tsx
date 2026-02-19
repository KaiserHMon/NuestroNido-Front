'use client';

import { Family } from '@/lib/types';
import { EditFamilyDialog } from '@/components/dialogs/edit-family-dialog';
import { DeleteFamilyDialog } from '@/components/dialogs/delete-family-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface FamilyActionsProps {
  family: Family;
  isCreator: boolean;
  onFamilyUpdated?: () => void;
  onFamilyDeleted?: () => void;
  variant?: 'header' | 'nav';
}

export function FamilyActions({
  family,
  isCreator,
  onFamilyUpdated,
  onFamilyDeleted: _onFamilyDeleted,
  variant = 'header',
}: FamilyActionsProps) {
  if (!isCreator) {
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

  return (
    <div className="flex items-center gap-1">
      <EditFamilyDialog
        family={family}
        onSuccess={onFamilyUpdated}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className={buttonClass}
            title="Editar nombre"
            aria-label="Editar nombre"
          >
            <Edit2 className={`${editIconClass} ${editIconColor}`} />
          </Button>
        }
      />

      <DeleteFamilyDialog
        family={family}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className={buttonClass}
            title="Eliminar familia"
            aria-label="Eliminar familia"
          >
            <Trash2 className={`${deleteIconClass} ${deleteIconColor}`} />
          </Button>
        }
      />
    </div>
  );
}
