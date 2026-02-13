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
import { Member } from '@/lib/types';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const createTaskSchema = z
  .object({
    title: z.string().min(1, 'El título es requerido').max(50, 'Máximo 50 caracteres'),
    dateType: z.enum(['date', 'days']).default('date'),
    date: z.date().optional(),
    daysOfWeek: z.array(z.string()).optional(),
    recurrence: z.enum(['once', 'monthly', 'yearly']).default('once'),
    assignedTo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.dateType === 'date' && !data.date) return false;
      if (data.dateType === 'days' && (!data.daysOfWeek || data.daysOfWeek.length === 0))
        return false;
      return true;
    },
    {
      message: 'Debes seleccionar una fecha o al menos un día de la semana',
      path: ['date'],
    }
  );

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTaskFormValues) => void;
  taskToEdit?: CreateTaskFormValues & { id?: string };
  members: Member[];
  currentUserId?: string;
}

const WEEK_DAYS = [
  { id: '1', label: 'L' },
  { id: '2', label: 'M' },
  { id: '3', label: 'X' },
  { id: '4', label: 'J' },
  { id: '5', label: 'V' },
  { id: '6', label: 'S' },
  { id: '0', label: 'D' },
];

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  taskToEdit,
  members,
  currentUserId,
}: CreateTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      dateType: 'date',
      date: new Date(),
      daysOfWeek: [],
      recurrence: 'once',
      assignedTo: currentUserId || '',
    },
  });

  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        form.reset({
          title: taskToEdit.title,
          dateType: taskToEdit.dateType || 'date',
          date: taskToEdit.date ? new Date(taskToEdit.date) : undefined,
          daysOfWeek: taskToEdit.daysOfWeek || [],
          recurrence: taskToEdit.recurrence || 'once',
          assignedTo: taskToEdit.assignedTo || currentUserId,
        });
      } else {
        form.reset({
          title: '',
          dateType: 'date',
          date: new Date(),
          daysOfWeek: [],
          recurrence: 'once',
          assignedTo: currentUserId || '',
        });
      }
    }
  }, [open, taskToEdit, form, currentUserId]);

  const handleFormSubmit = async (data: CreateTaskFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Error al guardar la tarea. Verifica los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateType = form.watch('dateType');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {taskToEdit ? 'editar la' : 'crear una nueva'} tarea
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
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

            <FormField
              control={form.control}
              name="assignedTo"
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
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: member.color.bg }}
                            />
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant={dateType === 'date' ? 'default' : 'outline'}
                onClick={() => form.setValue('dateType', 'date')}
                className="flex-1"
              >
                Fecha Específica
              </Button>
              <Button
                type="button"
                variant={dateType === 'days' ? 'default' : 'outline'}
                onClick={() => form.setValue('dateType', 'days')}
                className="flex-1"
              >
                Varios Días
              </Button>
            </div>

            {dateType === 'date' && (
              <FormField
                control={form.control}
                name="date"
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
                          locale={es}
                          fixedWeeks
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {dateType === 'days' && (
              <FormField
                control={form.control}
                name="daysOfWeek"
                render={() => (
                  <FormItem>
                    <FormLabel className="mb-2 block">Días de la semana</FormLabel>
                    <div className="flex justify-between">
                      {WEEK_DAYS.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="daysOfWeek"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.id}
                                className="flex flex-col items-center space-y-1"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), day.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== day.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-xs">{day.label}</FormLabel>
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

            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dateType === 'date' ? 'Repetir' : 'Vigencia de la Tarea'}</FormLabel>
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
                      {dateType === 'date' ? (
                        <>
                          <SelectItem value="once">Una sola vez</SelectItem>
                          <SelectItem value="monthly">Todos los meses</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="once">Solo esta semana</SelectItem>
                          <SelectItem value="monthly">Solo este mes</SelectItem>
                          <SelectItem value="yearly">Todo este año</SelectItem>
                        </>
                      )}
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
                {isSubmitting ? 'Guardando...' : taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
