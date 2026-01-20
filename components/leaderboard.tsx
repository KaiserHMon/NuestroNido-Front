'use client';

import { Miembro } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MiembroAvatar } from '@/components/ui/miembro-avatar';
import { Medal } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';

interface LeaderboardProps {
  miembros: Miembro[];
}

const getDistintivo = (posicion: number) => {
  switch (posicion) {
    case 1:
      return { emoji: '🥇', label: 'Oro' };
    case 2:
      return { emoji: '🥈', label: 'Plata' };
    case 3:
      return { emoji: '🥉', label: 'Bronce' };
    default:
      return null;
  }
};

export function Leaderboard({ miembros }: LeaderboardProps) {
  const { levels } = useAuth();
  
  // Ordenar miembros por experiencia descendente
  const miembrosOrdenados = [...miembros].sort((a, b) => (b.experience_points || 0) - (a.experience_points || 0));

  const entries = miembrosOrdenados.map((m, index) => {
    const distintivo = getDistintivo(index + 1);
    
    const currentXP = m.experience_points || 0;
    const currentLevelNum = m.nivel?.level_number || 1;
    // Assuming levels are sorted or we find the specific one. 
    // Optimization: we could sort levels once. But explicit find is safe.
    const nextLevel = levels.find(l => l.level_number === currentLevelNum + 1);
    
    // If no next level, we are at max.
    const nextLevelXP = nextLevel?.required_progress || currentXP; 
    const isMaxLevel = !nextLevel;
    
    const progressPercent = isMaxLevel ? 100 : (nextLevelXP > 0 ? Math.min(100, (currentXP / nextLevelXP) * 100) : 0);

    return {
      puesto: index + 1,
      miembro: {
        id: m.id,
        nombre: m.nombre,
        color: m.color,
        imageUrl: m.nivel?.image_url,
      },
      experience_points: currentXP,
      nivel: m.nivel || { name: 'Huevo', level_number: 1, required_progress: 0 }, // Fallback
      distintivo: distintivo ? (distintivo.label as 'oro' | 'plata' | 'bronce') : undefined,
      // Extra UI helpers
      nextLevelXP,
      progressPercent,
      isMaxLevel
    };
  });

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Medal className="w-5 h-5 text-primary" />
          Ranking Familiar
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Posiciones basadas en experiencia acumulada
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Pos</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Miembro</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium w-1/3">Progreso (XP)</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.miembro.id}
                    className={`border-b border-border last:border-0 ${
                      entry.puesto <= 3 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-3 px-2 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{`#${entry.puesto}`}</span>
                        {entry.distintivo && (
                          <span title={`Medalla de ${entry.distintivo}`}>
                            {entry.distintivo === 'oro'
                              ? '🥇'
                              : entry.distintivo === 'plata'
                                ? '🥈'
                                : '🥉'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <MiembroAvatar
                          nombre={entry.miembro.nombre}
                          color={entry.miembro.color}
                          imageUrl={entry.miembro.imageUrl}
                          size="sm"
                        />
                        <span className="text-foreground font-medium">{entry.miembro.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="space-y-1 max-w-[200px]">
                         <div className="flex justify-between text-xs">
                           <span className="font-medium">{entry.experience_points} XP</span>
                           {!entry.isMaxLevel && <span className="text-muted-foreground">/ {entry.nextLevelXP}</span>}
                         </div>
                         <Progress value={entry.progressPercent} className="h-1.5" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{entry.nivel.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.miembro.id}
                className={`p-3 rounded-lg border ${
                  entry.puesto <= 3 ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="text-lg font-bold text-foreground">
                      {entry.distintivo
                        ? entry.distintivo === 'oro'
                          ? '🥇'
                          : entry.distintivo === 'plata'
                            ? '🥈'
                            : '🥉'
                        : `#${entry.puesto}`}
                    </div>
                    <MiembroAvatar
                      nombre={entry.miembro.nombre}
                      color={entry.miembro.color}
                      imageUrl={entry.miembro.imageUrl}
                      size="md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.miembro.nombre}</p>
                      <p className="text-xs text-muted-foreground">{entry.nivel.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                   <div className="flex justify-between text-xs">
                     <span className="font-medium">{entry.experience_points} XP</span>
                     {!entry.isMaxLevel && <span className="text-muted-foreground">/ {entry.nextLevelXP}</span>}
                   </div>
                   <Progress value={entry.progressPercent} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
