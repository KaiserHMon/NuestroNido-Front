'use client';

import { Crown, Rocket, Check, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type PlanFeature = 'notas' | 'miembros' | 'listas' | 'calendario';

interface PlanLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: PlanFeature;
  limit: number;
  upgradeUrl?: string;
}

export function PlanLimitDialog({
  open,
  onOpenChange,
  feature,
  limit,
  upgradeUrl = 'https://nuestronido.app/pricing', // URL externa de ejemplo
}: PlanLimitDialogProps) {
  const getFeatureText = (feature: PlanFeature) => {
    switch (feature) {
      case 'notas':
        return 'notas familiares';
      case 'miembros':
        return 'miembros de la familia';
      case 'listas':
        return 'listas de compras';
      case 'calendario':
        return 'eventos en el calendario';
      default:
        return 'elementos';
    }
  };

  const featureText = getFeatureText(feature);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary ring-2 ring-primary/20 shadow-xl shadow-primary/20">
        <DialogHeader className="flex flex-col items-center gap-2 text-center sm:text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2 ring-1 ring-primary/20">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center text-primary font-bold">
            ¡Has alcanzado el límite de tu plan!
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-foreground/80">
            Tu plan actual <strong className="text-primary">Básico</strong> solo permite hasta{' '}
            {limit} {featureText}. Para seguir creando más, actualiza a{' '}
            <strong className="text-primary">Nido Familiar</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-card/50 p-4 rounded-lg my-2 border border-primary/20 shadow-sm">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
            <Rocket className="w-4 h-4" />
            Beneficios del Plan Nido Familiar:
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Notas ilimitadas</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Miembros ilimitados</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Tareas ilimitadas</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Acceso anticipado a nuevas funciones</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="sm:w-auto w-full hover:bg-primary/5 text-foreground/70"
          >
            Quizás después
          </Button>
          <Button
            className="sm:w-auto w-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-white shadow-md shadow-primary/30 transition-all duration-300 border-0"
            onClick={() => window.open(upgradeUrl, '_blank')}
          >
            Actualizar Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
