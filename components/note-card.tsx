'use client';

import { Note } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  onClick?: (note: Note) => void;
  currentUserId?: string;
}

export function NoteCard({ note, onEdit, onDelete, onClick, currentUserId }: NoteCardProps) {
  const formattedDate = format(new Date(note.created_at), "d 'de' MMMM", { locale: es });
  const isCreator = currentUserId === note.user_id;
  const colorBg = note.user.color?.bg || '#9CA3AF';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(note);
    }
  };

  return (
    <Card
      className="border-organic-2 shadow-tactile border-none overflow-hidden transition-all hover:shadow-organic h-full flex flex-col cursor-pointer active:scale-[0.98] group bg-card"
      onClick={() => onClick?.(note)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver nota: ${note.title || 'Sin título'}`}
    >
      <div className="h-2 w-full" style={{ backgroundColor: colorBg }} />
      <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground break-words text-left line-clamp-2 text-lg font-heading leading-tight">
              {note.title || 'Nota sin título'}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-widest font-bold opacity-60 italic">
              {formattedDate}
            </p>
          </div>

          <div
            className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            {isCreator && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(note)}
                className="h-8 w-8 rounded-full hover:bg-black/5"
              >
                <Edit2 className="w-4 h-4 text-foreground/60" />
              </Button>
            )}
            {isCreator && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(note.id)}
                className="h-8 w-8 rounded-full hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {note.content && (
          <p className="text-sm text-foreground/80 line-clamp-5 flex-1 whitespace-pre-wrap leading-relaxed font-medium">
            {note.content}
          </p>
        )}

        <div className="flex items-center gap-2 pt-3 mt-auto border-t border-black/5">
          <div
            className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm"
            style={{
              backgroundColor: 'white',
              color: colorBg,
            }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colorBg }} />
            {note.user.name}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
