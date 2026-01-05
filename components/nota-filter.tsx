'use client';

import { Miembro } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NotaFilterProps {
  miembros: Miembro[];
  filtrosActivos: string[];
  onFilterChange: (miembroIds: string[]) => void;
}

export function NotaFilter({ miembros, filtrosActivos, onFilterChange }: NotaFilterProps) {
  const handleToggleFiltro = (miembroId: string) => {
    if (filtrosActivos.includes(miembroId)) {
      onFilterChange(filtrosActivos.filter((id) => id !== miembroId));
    } else {
      onFilterChange([...filtrosActivos, miembroId]);
    }
  };

  const handleLimpiarFiltros = () => {
    onFilterChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Filtrar por miembro</p>
        {filtrosActivos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLimpiarFiltros}
            className="text-xs text-primary hover:text-primary"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {miembros.map((miembro) => (
          <Badge
            key={miembro.id}
            variant={filtrosActivos.includes(miembro.id) ? 'default' : 'outline'}
            className={`cursor-pointer transition-all ${
              filtrosActivos.includes(miembro.id)
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-foreground border-2'
            }`}
            onClick={() => handleToggleFiltro(miembro.id)}
            style={
              !filtrosActivos.includes(miembro.id)
                ? {
                    borderColor: miembro.color.bg,
                    color: miembro.color.bg,
                  }
                : undefined
            }
          >
            <div
              className="w-2 h-2 rounded-full mr-1"
              style={{
                backgroundColor: miembro.color.bg,
              }}
            />
            {miembro.nombre}
          </Badge>
        ))}
      </div>

      {filtrosActivos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Mostrando {filtrosActivos.length} filtro{filtrosActivos.length > 1 ? 's' : ''} activo
          {filtrosActivos.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
