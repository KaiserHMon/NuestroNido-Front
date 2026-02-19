'use client';

import { useState, useEffect } from 'react';
import { Member } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { BaseDialog } from './base-dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DeleteMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newCreatorId?: string) => Promise<void>;
  isCurrentUser?: boolean;
  candidateMembers?: Member[];
}

export function DeleteMemberDialog({
  member,
  open,
  onOpenChange,
  onConfirm,
  isCurrentUser = false,
  candidateMembers = [],
}: DeleteMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCreatorId, setNewCreatorId] = useState<string>('');

  const isCreator = member?.roleId === 'creator';
  const requiresSuccessor = isCurrentUser && isCreator && candidateMembers.length > 0;

  useEffect(() => {
    if (open) {
      if (candidateMembers.length > 0) {
        setNewCreatorId(candidateMembers[0].id);
      } else {
        setNewCreatorId('');
      }
      setError(null);
    }
  }, [open, candidateMembers]);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requiresSuccessor && !newCreatorId) {
      setError('Debes asignar un nuevo creador antes de salir.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(newCreatorId || undefined);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar miembro');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isCurrentUser ? '¿Dejar la familia?' : `¿Eliminar a ${member.name}?`}
      description={
        isCurrentUser
          ? 'Saldrás de la familia y perderás acceso a datos familiares.'
          : `Se eliminará a ${member.name} de la familia y perderá acceso a todos los datos.`
      }
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleConfirm}
      submitButtonLabel={isCurrentUser ? 'Salir de la familia' : 'Eliminar miembro'}
      submitButtonVariant="destructive"
      isSubmitDisabled={requiresSuccessor && !newCreatorId}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
          <p className="text-sm text-destructive font-medium">
            {isCurrentUser
              ? 'Al confirmar, serás removido de la familia'
              : `Al confirmar, ${member.name} será removido de la familia`}
          </p>
        </div>

        {requiresSuccessor && (
          <div className="space-y-2">
            <Label>Asignar nuevo administrador</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Como eres el creador, debes delegar el rol de administrador a otro miembro antes de
              salir.
            </p>
            <Select value={newCreatorId} onValueChange={setNewCreatorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un miembro" />
              </SelectTrigger>
              <SelectContent>
                {candidateMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: m.color.bg }}
                      />
                      {m.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </BaseDialog>
  );
}
