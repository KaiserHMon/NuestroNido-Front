'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Miembro } from '@/lib/types';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

// Schema de validación
const crearTareaSchema = z
  .object({
    titulo: z.string().min(1, 'El título es requerido').max(50, 'Máximo 50 caracteres'),
    tipoFecha: z.enum(['fecha', 'dias']).default('fecha'),
    fecha: z.date().optional(),
    diasSemana: z.array(z.string()).optional(),
    recurrencia: z.enum(['unica', 'mensual', 'anual']).default('unica'),
    asignadoA: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.tipoFecha === 'fecha' && !data.fecha) return false;
      if (data.tipoFecha === 'dias' && (!data.diasSemana || data.diasSemana.length === 0))
        return false;
      return true;
    },
    {
      message: 'Debes seleccionar una fecha o al menos un día de la semana',
      path: ['fecha'], // Apuntar el error al campo fecha
    }
  );

type CrearTareaFormValues = z.infer<typeof crearTareaSchema>;

interface CrearTareaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CrearTareaFormValues) => void;
  tareaAEditar?: CrearTareaFormValues & { id?: string };
  miembros: Miembro[];
  usuarioActualId?: string;
}

const DIAS_SEMANA = [
  { id: '1', label: 'L' }, // Lunes
  { id: '2', label: 'M' }, // Martes
  { id: '3', label: 'X' }, // Miércoles
  { id: '4', label: 'J' }, // Jueves
  { id: '5', label: 'V' }, // Viernes
  { id: '6', label: 'S' }, // Sábado
  { id: '0', label: 'D' }, // Domingo
];

export function CrearTareaDialog({
  open,
  onOpenChange,
  onSubmit,
  tareaAEditar,
  miembros,
  usuarioActualId,
}: CrearTareaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CrearTareaFormValues>({
    resolver: zodResolver(crearTareaSchema),
    defaultValues: {
      titulo: '',
      tipoFecha: 'fecha',
      fecha: new Date(),
      diasSemana: [],
      recurrencia: 'unica',
      asignadoA: usuarioActualId || '',
    },
  });

  useEffect(() => {
    if (open) {
      if (tareaAEditar) {
        form.reset({
          titulo: tareaAEditar.titulo,
          tipoFecha: tareaAEditar.tipoFecha || 'fecha',
          fecha: tareaAEditar.fecha ? new Date(tareaAEditar.fecha) : undefined,
          diasSemana: tareaAEditar.diasSemana || [],
          recurrencia: tareaAEditar.recurrencia || 'unica',
          asignadoA: tareaAEditar.asignadoA || usuarioActualId,
        });
      } else {
        form.reset({
          titulo: '',
          tipoFecha: 'fecha',
          fecha: new Date(),
          diasSemana: [],
          recurrencia: 'unica',
          asignadoA: usuarioActualId || '',
        });
      }
    }
  }, [open, tareaAEditar, form, usuarioActualId]);

  const handleSubmit = async (data: CrearTareaFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
      // Success toast is handled by the parent component (calendario-section) to avoid duplication
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al guardar la tarea. Verifica los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoFecha = form.watch('tipoFecha');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tareaAEditar ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Título */}
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Comprar regalos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Asignar a */}
            <FormField
              control={form.control}
              name="asignadoA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignar a</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un familiar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {miembros.map((miembro) => (
                        <SelectItem key={miembro.id} value={miembro.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: miembro.color.bg }}
                            />
                            {miembro.nombre}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selector de Tipo de Fecha */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={tipoFecha === 'fecha' ? 'default' : 'outline'}
                onClick={() => form.setValue('tipoFecha', 'fecha')}
                className="flex-1"
              >
                Fecha Específica
              </Button>
              <Button
                type="button"
                variant={tipoFecha === 'dias' ? 'default' : 'outline'}
                onClick={() => form.setValue('tipoFecha', 'dias')}
                className="flex-1"
              >
                Varios Días
              </Button>
            </div>

            {/* Fecha Específica */}
            {tipoFecha === 'fecha' && (
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: es })
                            ) : (
                              <span>Selecciona fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Días de la Semana */}
            {tipoFecha === 'dias' && (
              <FormField
                control={form.control}
                name="diasSemana"
                render={() => (
                  <FormItem>
                    <FormLabel className="mb-2 block">Días de la semana</FormLabel>
                    <div className="flex justify-between">
                      {DIAS_SEMANA.map((dia) => (
                        <FormField
                          key={dia.id}
                          control={form.control}
                          name="diasSemana"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={dia.id}
                                className="flex flex-col items-center space-y-1"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(dia.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), dia.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== dia.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-xs">{dia.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Recurrencia */}
            <FormField
              control={form.control}
              name="recurrencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrencia</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unica">Única vez</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : tareaAEditar ? 'Guardar Cambios' : 'Crear Tarea'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
