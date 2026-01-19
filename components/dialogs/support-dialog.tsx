'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'segundohardoym@gmail.com';
    const subject = encodeURIComponent('Consulta Soporte - NuestroNido');
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;

    toast.success('Abriendo cliente de correo...');

    setIsSubmitting(false);
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contactar con Soporte</DialogTitle>
          <DialogDescription>
            Cuéntanos qué sucedió y te ayudaremos lo antes posible.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Describe tu problema aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !message.trim()}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
