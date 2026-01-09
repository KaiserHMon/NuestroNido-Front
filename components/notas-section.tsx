'use client';

import { useEffect, useState } from 'react';
import { Familia, Nota, Miembro, Usuario } from '@/lib/types';
import { NotaCard } from '@/components/nota-card';
import { NotaFilter } from '@/components/nota-filter';
import { CrearNotaDialog } from '@/components/dialogs/crear-nota-dialog';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Plus } from 'lucide-react';

export function NotasSection() {
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNuevaNotaOpen, setIsNuevaNotaOpen] = useState(false);

  useEffect(() => {
    // Cargar familia y notas desde localStorage
    const familiaGuardada = localStorage.getItem('familia');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
      try {
        Promise.resolve().then(() => {
          setUsuario(JSON.parse(usuarioGuardado));
        });
      } catch (error) {
        console.error('Error loading usuario:', error);
      }
    }

    if (familiaGuardada) {
      try {
        const familiaData = JSON.parse(familiaGuardada) as Familia;
        // Usar Promise para evitar setState directo en effect
        Promise.resolve().then(() => {
          setFamilia(familiaData);
        });

        // Por ahora, usamos datos mock de notas
        const notasGuardadas = localStorage.getItem('notas');
        if (notasGuardadas) {
          try {
            Promise.resolve().then(() => {
              setNotas(JSON.parse(notasGuardadas));
            });
          } catch {
            // Si hay error parseando, usar array vacío
            Promise.resolve().then(() => {
              setNotas([]);
            });
          }
        } else {
          // Datos mock iniciales
          const notasMock: Nota[] = [
            {
              id: '1',
              titulo: 'Almuerzo Mañana',
              contenido: 'Preparar el almuerzo de mañana',
              colorCreador: familiaData.miembros[0]?.color || {
                id: '1',
                nombre: 'Azul',
                bg: '#3B82F6',
                text: '#FFFFFF',
                accent: '#2563EB',
                wcagContrast: 4.5,
              },
              fechaCreacion: new Date(Date.now() - 86400000).toISOString(),
              prioridad: 'alta',
              completado: false,
              miembrosAsignados: familiaData.miembros.slice(0, 1).map((m: Miembro) => m.id),
              familiaId: familiaData.id,
            },
            {
              id: '2',
              titulo: 'Limpieza Sala',
              contenido: 'Limpiar la sala',
              colorCreador: familiaData.miembros[1]?.color || {
                id: '2',
                nombre: 'Rosa',
                bg: '#EC4899',
                text: '#FFFFFF',
                accent: '#DB2777',
                wcagContrast: 4.5,
              },
              fechaCreacion: new Date(Date.now() - 172800000).toISOString(),
              prioridad: 'media',
              completado: true,
              miembrosAsignados: familiaData.miembros.slice(1, 2).map((m: Miembro) => m.id),
              familiaId: familiaData.id,
            },
            {
              id: '3',
              titulo: 'Compras',
              contenido: 'Comprar verduras',
              colorCreador: familiaData.miembros[0]?.color || {
                id: '1',
                nombre: 'Azul',
                bg: '#3B82F6',
                text: '#FFFFFF',
                accent: '#2563EB',
                wcagContrast: 4.5,
              },
              fechaCreacion: new Date(Date.now() - 259200000).toISOString(),
              prioridad: 'baja',
              completado: false,
              miembrosAsignados: familiaData.miembros.map((m: Miembro) => m.id),
              familiaId: familiaData.id,
            },
          ];
          // Usar Promise para evitar setState directo en effect
          Promise.resolve().then(() => {
            setNotas(notasMock);
            localStorage.setItem('notas', JSON.stringify(notasMock));
          });
        }
      } catch (error) {
        console.error('Error loading familia or notas:', error);
      }
    }
    // Usar Promise para evitar setState directo en effect
    Promise.resolve().then(() => {
      setLoading(false);
    });
  }, []);

  // Update localStorage when notes change
  useEffect(() => {
    if (!loading && notas.length > 0) {
      localStorage.setItem('notas', JSON.stringify(notas));
    }
  }, [notas, loading]);

  const handleCrearNota = (data: any) => {
    if (!familia || !usuario) return;

    const nuevaNota: Nota = {
      id: `nota-${Date.now()}`,
      titulo: data.titulo,
      contenido: data.contenido,
      colorCreador: familia.miembros.find((m) => m.id === usuario.id)?.color || {
        id: 'temp',
        nombre: 'Gris',
        bg: '#9CA3AF',
        text: '#FFFFFF',
        accent: '#9CA3AF',
        wcagContrast: 4.5
      },
      fechaCreacion: new Date().toISOString(),
      prioridad: 'media',
      completado: false,
      miembrosAsignados: [], // No assignees initially
      familiaId: familia.id,
    };

    // Insertar al principio de la lista (prepend)
    setNotas([nuevaNota, ...notas]);
    setIsNuevaNotaOpen(false);
  };

  const notasFiltradas =
    (filtrosActivos.length === 0
      ? notas
      : notas.filter((nota) =>
          filtrosActivos.some(
            (filtroId) =>
              nota.miembrosAsignados?.includes(filtroId) ||
              familia?.miembros.find((m) => m.id === filtroId && m.color.bg === nota.colorCreador.bg)
          )
        )).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Notas</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Nota
          </Button>
        </div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Notas</h2>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsNuevaNotaOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Nota
        </Button>
      </div>

      {familia && familia.miembros.length > 0 && (
        <NotaFilter
          miembros={familia.miembros}
          filtrosActivos={filtrosActivos}
          onFilterChange={setFiltrosActivos}
        />
      )}

      {notasFiltradas.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No hay notas</EmptyTitle>
            <EmptyDescription>
              {filtrosActivos.length > 0
                ? 'No hay notas que coincidan con los filtros seleccionados'
                : 'Aún no hay notas. ¡Crea una para comenzar!'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {notasFiltradas.length} de {notas.length} nota{notas.length > 1 ? 's' : ''}
          </div>
          <div className="space-y-3">
            {notasFiltradas.map((nota) => {
              const creador = familia?.miembros.find((m) => m.color.bg === nota.colorCreador.bg);
              return (
                <NotaCard
                  key={nota.id}
                  nota={nota}
                  creador={creador}
                  onDelete={() => {
                    setNotas(notas.filter((n) => n.id !== nota.id));
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      <CrearNotaDialog 
        open={isNuevaNotaOpen} 
        onOpenChange={setIsNuevaNotaOpen}
        onSubmit={handleCrearNota}
      />
    </div>
  );
}
