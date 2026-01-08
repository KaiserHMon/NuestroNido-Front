'use client';

import { Nota, Miembro } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotaCardProps {
  nota: Nota;
  creador?: Miembro;
  onEdit?: (nota: Nota) => void;
  onDelete?: (notaId: string) => void;
  _onToggleComplete?: (notaId: string) => void;
}

const getPriorityColor = (priority: 'baja' | 'media' | 'alta' | undefined) => {
  switch (priority) {
    case 'alta':
      return 'bg-destructive/10 text-destructive';
    case 'media':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'baja':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPriorityLabel = (priority: 'baja' | 'media' | 'alta' | undefined) => {
  switch (priority) {
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Media';
    case 'baja':
      return 'Baja';
    default:
      return '-';
  }
};

export function NotaCard({ nota, creador, onEdit, onDelete, _onToggleComplete }: NotaCardProps) {
  const fechaFormato = format(new Date(nota.fechaCreacion), "d 'de' MMMM", { locale: es });

  return (
    <Card
      className={`border-l-4 overflow-hidden transition-opacity ${
        nota.completado ? 'opacity-60' : ''
      }`}
      style={{
        borderLeftColor: nota.colorCreador.bg,
      }}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-foreground break-words text-left ${
                nota.completado ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {nota.titulo || nota.contenido}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{fechaFormato}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(nota)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                title="Editar nota"
              >
                <Edit2 className="w-4 h-4 text-primary" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(nota.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                title="Eliminar nota"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {/* Creador */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Por:</span>
          <div
            className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: nota.colorCreador.bg + '20',
              color: nota.colorCreador.bg,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: nota.colorCreador.bg }}
            />
            {creador?.nombre || nota.colorCreador.nombre}
          </div>
        </div>

        {/* Content */}
        {nota.contenido && (
          <p
            className={`text-sm text-muted-foreground line-clamp-3 ${
              nota.completado ? 'line-through' : ''
            }`}
          >
            {nota.contenido}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
