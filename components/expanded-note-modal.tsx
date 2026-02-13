'use client';

import { Note } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Edit2, X } from 'lucide-react';

interface ExpandedNoteModalProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  currentUserId?: string;
}

export function ExpandedNoteModal({
  note,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  currentUserId,
}: ExpandedNoteModalProps) {
  if (!note) return null;

  const formattedDate = format(new Date(note.created_at), "d 'de' MMMM 'de' yyyy", { locale: es });
  const isCreator = currentUserId === note.user_id;
  const colorBg = note.user.color?.bg || '#9CA3AF';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-none rounded-2xl">
        <div className="absolute right-4 top-4 z-10">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="rounded-full bg-background/80 backdrop-blur-sm h-8 w-8 hover:bg-muted"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>

        <DialogHeader className="p-6 pb-4 sm:p-8 sm:pb-4 border-b border-border/40">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
               <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colorBg }} 
               />
               <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {note.user.name}
               </span>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground leading-tight">
              {note.title || 'Nota sin título'}
            </DialogTitle>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </DialogHeader>

        <div className="p-6 sm:p-8 whitespace-pre-wrap text-foreground/90 leading-relaxed text-base">
          {note.content}
        </div>

        <DialogFooter className="p-4 sm:p-6 bg-muted/30 border-t border-border/40 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isCreator && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    onOpenChange(false);
                    onEdit(note);
                }}
                className="gap-2 h-9 px-4 rounded-full border-primary/20 text-primary hover:bg-primary/5"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </Button>
            )}
            {isCreator && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    onOpenChange(false);
                    onDelete(note.id);
                }}
                className="gap-2 h-9 px-4 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
