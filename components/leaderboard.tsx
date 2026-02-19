'use client';

import { Member, Level } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberAvatar } from '@/components/ui/member-avatar';
import { Medal } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';

interface LeaderboardProps {
  members: Member[];
}

const getDistinction = (position: number) => {
  switch (position) {
    case 1:
      return { emoji: '🥇', label: 'gold' };
    case 2:
      return { emoji: '🥈', label: 'silver' };
    case 3:
      return { emoji: '🥉', label: 'bronze' };
    default:
      return null;
  }
};

export function Leaderboard({ members }: LeaderboardProps) {
  const { levels } = useAuth();

  // Sort members by experience descending
  const sortedMembers = [...members].sort(
    (a, b) => (b.experience_points || 0) - (a.experience_points || 0)
  );

  const entries = sortedMembers.map((m, index) => {
    const distinction = getDistinction(index + 1);

    const currentXP = m.experience_points || 0;
    const currentLevelNum = m.level?.level_number || 1;
    const nextLevel = levels.find((l: Level) => l.level_number === currentLevelNum + 1);

    const nextLevelXP = nextLevel?.required_progress || currentXP;
    const isMaxLevel = !nextLevel;

    const progressPercent = isMaxLevel
      ? 100
      : nextLevelXP > 0
        ? Math.min(100, (currentXP / nextLevelXP) * 100)
        : 0;

    return {
      rank: index + 1,
      member: {
        id: m.id,
        name: m.name,
        color: m.color,
        imageUrl: m.level?.image_url,
      },
      experience_points: currentXP,
      level: m.level || { name: 'Huevo', level_number: 1, required_progress: 0 },
      distinction: distinction ? (distinction.label as 'gold' | 'silver' | 'bronze') : undefined,
      nextLevelXP,
      progressPercent,
      isMaxLevel,
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
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium w-1/3">
                    Progreso (XP)
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.member.id}
                    className={`border-b border-border last:border-0 ${
                      entry.rank <= 3 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-3 px-2 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{`#${entry.rank}`}</span>
                        {entry.distinction && (
                          <span title={`Medalla de ${entry.distinction}`}>
                            {entry.distinction === 'gold'
                              ? '🥇'
                              : entry.distinction === 'silver'
                                ? '🥈'
                                : '🥉'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <MemberAvatar
                          name={entry.member.name}
                          color={entry.member.color}
                          imageUrl={entry.member.imageUrl}
                          size="sm"
                        />
                        <span className="text-foreground font-medium">{entry.member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="space-y-1 max-w-[200px]">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{entry.experience_points} XP</span>
                          {!entry.isMaxLevel && (
                            <span className="text-muted-foreground">/ {entry.nextLevelXP}</span>
                          )}
                        </div>
                        <Progress value={entry.progressPercent} className="h-1.5" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{entry.level.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.member.id}
                className={`p-3 rounded-lg border ${
                  entry.rank <= 3 ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="text-lg font-bold text-foreground">
                      {entry.distinction
                        ? entry.distinction === 'gold'
                          ? '🥇'
                          : entry.distinction === 'silver'
                            ? '🥈'
                            : '🥉'
                        : `#${entry.rank}`}
                    </div>
                    <MemberAvatar
                      name={entry.member.name}
                      color={entry.member.color}
                      imageUrl={entry.member.imageUrl}
                      size="md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.member.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.level.name}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{entry.experience_points} XP</span>
                    {!entry.isMaxLevel && (
                      <span className="text-muted-foreground">/ {entry.nextLevelXP}</span>
                    )}
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
