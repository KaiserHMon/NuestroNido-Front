'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCategoryIcon, getCategoryLabel } from '@/lib/category-utils';

interface AddItemFormProps {
  categories: string[];
  onAddItem: (item: { title: string; category: string; quantity: string }) => Promise<void>;
}

export function AddItemForm({ categories, onAddItem }: AddItemFormProps) {
  const [newItem, setNewItem] = useState({
    title: '',
    category: categories[0] || '',
    quantity: '1',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddItem(newItem);
      setNewItem({
        title: '',
        category: categories[0] || '',
        quantity: '1',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = newItem.title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nombre del producto</Label>
        <Input
          id="title"
          placeholder="Ej: Leche"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={newItem.category}
          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat);
              return (
                <SelectItem key={cat} value={cat}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {getCategoryLabel(cat)}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Cantidad</Label>
        <Input
          id="quantity"
          placeholder="Ej: 1"
          type="number"
          value={newItem.quantity}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewItem((prev) => ({ ...prev, quantity: e.target.value.slice(0, 50) }))
          }
          aria-label="Cantidad del producto"
          maxLength={50}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Agregando...
          </>
        ) : (
          'Agregar a la Lista'
        )}
      </Button>
    </form>
  );
}
