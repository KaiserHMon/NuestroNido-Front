'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const crearNotaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(50, 'Máximo 50 caracteres'),
  contenido: z.string().min(1, 'El contenido es requerido').max(500, 'Máximo 500 caracteres'),
});

type CrearNotaFormValues = z.infer<typeof crearNotaSchema>;

interface CrearNotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CrearNotaFormValues) => void;
  notaAEditar?: CrearNotaFormValues;
}

export function CrearNotaDialog({ open, onOpenChange, onSubmit, notaAEditar }: CrearNotaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CrearNotaFormValues>({
    resolver: zodResolver(crearNotaSchema),
    defaultValues: {
      titulo: '',
      contenido: '',
    },
  });

  // Effect to reset form when dialog opens or notaAEditar changes
  useEffect(() => {
    if (open) {
      if (notaAEditar) {
        form.reset({
          titulo: notaAEditar.titulo,
          contenido: notaAEditar.contenido,
        });
      } else {
        form.reset({
          titulo: '',
          contenido: '',
        });
      }
    }
  }, [open, notaAEditar, form]);

  const handleSubmit = async (data: CrearNotaFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      if (!notaAEditar) { // Only reset form if creating a new note
        form.reset();
      }
      onOpenChange(false);
      // Success toast handled by parent
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Error al guardar la nota');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = notaAEditar ? 'Editar Nota' : 'Nueva Nota';
  const submitButtonText = notaAEditar ? 'Guardar Cambios' : 'Crear Nota';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {notaAEditar ? 'editar la' : 'crear una nueva'} nota familiar
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Lista de compras" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contenido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe tu nota aquí..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}