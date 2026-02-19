'use client';

import { Member } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NoteFilterProps {
  members: Member[];
  activeFilters: string[];
  onFilterChange: (memberIds: string[]) => void;
}

export function NoteFilter({ members, activeFilters, onFilterChange }: NoteFilterProps) {
  const getMemberColor = (member: Member) => {
    return member.color.bg || '#9CA3AF';
  };

  const handleToggleFilter = (memberId: string) => {
    if (activeFilters.includes(memberId)) {
      onFilterChange(activeFilters.filter((id) => id !== memberId));
    } else {
      onFilterChange([...activeFilters, memberId]);
    }
  };

  const handleClearFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Filtrar por miembro</p>
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-primary hover:text-primary"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {members.map((member) => {
          const colorBg = getMemberColor(member);
          const isActive = activeFilters.includes(member.id);

          return (
            <Badge
              key={member.id}
              variant={isActive ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-foreground border-2'
              }`}
              onClick={() => handleToggleFilter(member.id)}
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
              {member.name}
            </Badge>
          );
        })}
      </div>

      {activeFilters.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Mostrando {activeFilters.length} filtro{activeFilters.length > 1 ? 's' : ''} activo
          {activeFilters.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
