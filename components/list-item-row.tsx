import { createElement } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { getCategoryIcon, getCategoryLabel } from '@/lib/category-utils';
import { ListItem } from '@/services/list-service';

interface ListItemRowProps {
  item: ListItem;
  onToggle: (item: ListItem) => void;
  onDelete: (itemId: string) => void;
}

export function ListItemRow({ item, onToggle, onDelete }: ListItemRowProps) {
  const iconComponent = getCategoryIcon(item.category);
  const isPurchased = item.purchased;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isPurchased ? 'bg-muted/50 opacity-60' : 'bg-card'
      }`}
    >
      <Button
        size="icon"
        variant={isPurchased ? 'secondary' : 'outline'}
        className={`shrink-0 ${!isPurchased ? 'bg-transparent' : ''}`}
        onClick={() => onToggle(item)}
        aria-label={
          isPurchased
            ? `Marcar ${item.title} como no comprado`
            : `Marcar ${item.title} como comprado`
        }
        title={
          isPurchased
            ? `Marcar ${item.title} como no comprado`
            : `Marcar ${item.title} como comprado`
        }
      >
        {isPurchased ? (
          <Check className="w-4 h-4" aria-hidden="true" />
        ) : (
          <div className="w-4 h-4" />
        )}
      </Button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className={`font-medium ${isPurchased ? 'line-through' : ''}`}>{item.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {createElement(iconComponent, {
                  className: 'w-3 h-3 text-muted-foreground',
                  'aria-hidden': 'true',
                })}
                <span className="text-xs text-muted-foreground">
                  {getCategoryLabel(item.category)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">• {item.quantity}</span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={() => onDelete(item.id)}
            aria-label={`Eliminar ${item.title}`}
            title={`Eliminar ${item.title}`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
