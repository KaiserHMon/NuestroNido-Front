'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddItemForm } from '@/components/add-item-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onAddItem: (item: { title: string; category: string; quantity: string }) => Promise<void>;
}

export function AddItemDialog({ open, onOpenChange, categories, onAddItem }: AddItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 active:scale-95 h-11 px-5 rounded-full flex-1 sm:flex-none">
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span className="font-semibold">Agregar Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Item a la Lista</DialogTitle>
          <DialogDescription>Añade un nuevo producto a tu lista de compras</DialogDescription>
        </DialogHeader>
        <AddItemForm categories={categories} onAddItem={onAddItem} />
      </DialogContent>
    </Dialog>
  );
}
