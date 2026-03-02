'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, LogOut } from 'lucide-react';
import { MemberAvatar } from '@/components/ui/member-avatar';
import { Member } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface MemberCardProps {
  member: Member;
  isCurrentUser: boolean;
  isCreator: boolean;
  rank?: number;
  onDelete: (member: Member) => void;
  onEdit: (member: Member) => void;
}

export function MemberCard({
  member,
  isCurrentUser,
  isCreator,
  rank,
  onDelete,
  onEdit,
}: MemberCardProps) {
  const isMemberCreator = member.roleId === 'creator';

  return (
    <Card className="border-organic-1 shadow-tactile border-none bg-card overflow-hidden transition-all hover:shadow-organic hover:-translate-y-1 group">
      <CardContent className="p-5 py-6 flex flex-row items-center gap-5 relative min-h-[110px]">
        <div className="shrink-0 relative flex flex-col items-center">
          <MemberAvatar
            name={member.name}
            color={member.color}
            imageUrl={member.level?.image_url}
            size="lg"
            className="w-[72px] h-[72px] text-xl border-4 shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3"
            style={{ borderColor: member.color.bg }}
          />
          {rank && (
            <div
              className={`absolute -bottom-2 bg-card rounded-full shadow-md border border-border/50 animate-in zoom-in duration-300 leading-none ${rank <= 3 ? 'p-2 text-xl' : 'px-2 py-1 text-[10px] font-bold text-muted-foreground'}`}
            >
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 pr-12 flex-1 justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-bold text-foreground text-xl truncate font-heading" title={member.name}>
              {member.name}
            </h4>
            {isMemberCreator && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-widest border-none uppercase"
              >
                {member.roleId === 'creator' ? 'CREADOR' : 'MIEMBRO'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground truncate font-medium italic opacity-80">
              {member.level?.name || 'Miembro'}
            </span>
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform sm:translate-x-2 sm:group-hover:translate-x-0">
          {isCurrentUser && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(member)}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                title="Editar perfil"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(member)}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Salir de la familia"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
          {isCreator && !isCurrentUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(member)}
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Eliminar miembro"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
