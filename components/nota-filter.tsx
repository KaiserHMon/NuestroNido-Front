'use client';

import { Miembro } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getColorById } from '@/lib/colors';

interface NotaFilterProps {
  miembros: Miembro[];
  filtrosActivos: string[];
  onFilterChange: (miembroIds: string[]) => void;
}

export function NotaFilter({ miembros, filtrosActivos, onFilterChange }: NotaFilterProps) {
  const getMiembroColor = (miembro: Miembro) => {
    if (typeof miembro.color === 'string') {
        return getColorById(miembro.color)?.bg || '#9CA3AF';
    }
    return miembro.color?.bg || '#9CA3AF';
  };

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
        {miembros.map((miembro) => {
          const colorBg = getMiembroColor(miembro);
          const isActive = filtrosActivos.includes(miembro.id);
          
          return (
            <Badge
              key={miembro.id}
              variant={isActive ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-foreground border-2'
              }`}
              onClick={() => handleToggleFiltro(miembro.id)}
              style={
                !isActive
                  ? {
                      borderColor: colorBg,
                      color: colorBg,
                    }
                  : undefined
              }
            >
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{
                  backgroundColor: colorBg,
                }}
              />
              {miembro.nombre}
            </Badge>
          );
        })}
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
