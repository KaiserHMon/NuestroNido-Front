'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Leaderboard } from '@/components/leaderboard';
import { DeleteMemberDialog } from '@/components/dialogs/delete-member-dialog';
import { DeleteFamilyDialog } from '@/components/dialogs/delete-family-dialog';
import { EditProfileDialog } from '@/components/dialogs/edit-profile-dialog';
import { InviteMembersDialog } from '@/components/dialogs/invite-members-dialog';
import { Member } from '@/lib/types';
import { useFamily } from '@/hooks/use-family';
import { useAuth } from '@/hooks/use-auth';
import { FamilyService } from '@/services/family-service';
import { UserService } from '@/services/user-service';
import { toast } from 'sonner';
import { SectionSkeleton } from '@/components/ui/section-skeleton';
import { MemberCard } from '@/components/member-card';

export function MembersSection() {
  const { family, refreshFamily } = useFamily();
  const { user } = useAuth();

  const isCreator = useMemo(() => {
    const isById = family && user ? String(family.creatorId) === String(user.id) : false;
    const myMember = family?.members.find((m) => String(m.id) === String(user?.id));
    const isByRole = myMember?.roleId === 'creator';
    return isById || isByRole;
  }, [family, user]);

  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFamilyDialogOpen, setDeleteFamilyDialogOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleDeleteMember = (member: Member) => {
    if (member.roleId === 'creator' && family?.members.length === 1) {
      setDeleteFamilyDialogOpen(true);
    } else {
      setMemberToDelete(member);
      setDeleteDialogOpen(true);
    }
  };

  const handleEditProfile = (member: Member) => {
    setMemberToEdit(member);
    setEditDialogOpen(true);
  };

  const handleConfirmDeletion = async (newCreatorId?: string) => {
    if (!family || !memberToDelete) return;

    try {
      if (memberToDelete.id === user?.id) {
        await FamilyService.leave(newCreatorId);
        toast.success('Has salido de la familia');
        window.location.href = '/home';
        return;
      } else {
        await FamilyService.removeMember(memberToDelete.id);
        toast.success('Miembro eliminado');
      }
      refreshFamily();
      setMemberToDelete(null);
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Error al eliminar miembro');
    }
  };

  const candidateMembers = useMemo(() => {
    if (!family || !user) return [];
    return family.members
      .filter((m) => m.id !== user.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [family, user]);

  const topThreeIds = useMemo(() => {
    if (!family || family.members.length === 0) return [];
    return [...family.members]
      .sort((a, b) => b.experience_points - a.experience_points)
      .slice(0, 3)
      .map((m) => m.id);
  }, [family]);

  const handleConfirmEdit = async (updatedMember: Member) => {
    if (!family || !user) return;

    if (user.id === updatedMember.id) {
      try {
        await UserService.updateUser(user.id, {
          name: updatedMember.name,
        });

        refreshFamily();
        setMemberToEdit(null);
        toast.success('Perfil actualizado');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Error al actualizar perfil');
      }
    }
  };

  if (!family || !user) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Miembros ({family.members.length})
          </h3>
          <Button
            onClick={() => setInviteDialogOpen(true)}
            className="gap-2 bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Invitar a Familiar</span>
            <span className="sm:hidden">Invitar</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {family.members.map((member) => {
            const isMember = user?.id === member.id;
            const rankIndex = topThreeIds.indexOf(member.id);
            const rank = rankIndex !== -1 ? rankIndex + 1 : undefined;

            return (
              <MemberCard
                key={member.id}
                member={member}
                isCurrentUser={isMember}
                isCreator={isCreator}
                rank={rank}
                onDelete={handleDeleteMember}
                onEdit={handleEditProfile}
              />
            );
          })}
        </div>
      </div>

      <Leaderboard members={family.members} />

      <DeleteMemberDialog
        member={memberToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDeletion}
        isCurrentUser={memberToDelete?.id === user?.id}
        candidateMembers={candidateMembers}
      />

      {family && (
        <DeleteFamilyDialog
          family={family}
          trigger={null}
          open={deleteFamilyDialogOpen}
          onOpenChange={setDeleteFamilyDialogOpen}
        />
      )}

      <EditProfileDialog
        member={memberToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onConfirm={handleConfirmEdit}
      />

      {family && (
        <InviteMembersDialog
          family={family}
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
        />
      )}
    </div>
  );
}
