'use client';

import { Nota } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotaCardProps {
  nota: Nota;
  onEdit?: (nota: Nota) => void;
  onDelete?: (notaId: string) => void;
  currentUserId?: string;
}

export function NotaCard({ nota, onEdit, onDelete, currentUserId }: NotaCardProps) {
  const fechaFormato = format(new Date(nota.created_at), "d 'de' MMMM", { locale: es });
  const isCreator = currentUserId === nota.user_id;
  const colorBg = nota.user.color?.bg || '#9CA3AF';

  return (
    <Card
      className="border-l-4 overflow-hidden transition-all hover:shadow-md h-full flex flex-col"
      style={{
        borderLeftColor: colorBg,
      }}
    >
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground break-words text-left line-clamp-2">
              {nota.title || 'Nota sin título'}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{fechaFormato}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            {isCreator && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(nota)}
                className="h-7 w-7 p-0 hover:bg-primary/10"
                title="Editar nota"
              >
                <Edit2 className="w-3.5 h-3.5 text-primary" />
              </Button>
            )}
            {isCreator && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(nota.id)}
                className="h-7 w-7 p-0 hover:bg-destructive/10"
                title="Eliminar nota"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {nota.content && (
          <p className="text-sm text-muted-foreground line-clamp-4 flex-1 whitespace-pre-wrap">
            {nota.content}
          </p>
        )}

        {/* Footer - Creador */}
        <div className="flex items-center gap-2 pt-2 mt-auto border-t border-border/40">
          <div
            className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1.5"
            style={{
              backgroundColor: colorBg + '15',
              color: colorBg,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colorBg }}
            />
            {nota.user.name}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
