'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    category: '',
    quantity: '1',
  });

  const handleAddItem = async () => {
    await onAddItem(newItem);
    setNewItem({ title: '', category: categories[0] || '', quantity: '1' });
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nombre del producto</Label>
        <Input
          id="title"
          placeholder="Ej: Leche"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={newItem.category}
          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
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
        />
      </div>

      <Button onClick={handleAddItem} className="w-full">
        Agregar a la Lista
      </Button>
    </div>
  );
}
