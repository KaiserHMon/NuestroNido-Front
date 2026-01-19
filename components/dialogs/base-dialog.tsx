'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  trigger?: ReactNode;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonLabel?: string;
  submitButtonVariant?: 'default' | 'destructive' | 'outline' | 'ghost';
  children: ReactNode;
  cancelButtonLabel?: string;
  isSubmitDisabled?: boolean;
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  isSubmitting,
  error,
  onSubmit,
  submitButtonLabel = 'Guardar',
  submitButtonVariant = 'default',
  children,
  cancelButtonLabel = 'Cancelar',
  isSubmitDisabled = false,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={description ? '' : 'sr-only'}>
            {description || title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {children}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {cancelButtonLabel}
            </Button>
            <Button
              type="submit"
              variant={submitButtonVariant}
              disabled={isSubmitting || isSubmitDisabled}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {submitButtonLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
