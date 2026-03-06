import { fetchClient } from '@/lib/api-client';
import { Family, Member, ValidateCodeResponse } from '@/lib/types';
import { mapColor } from '@/lib/colors';

interface ApiMember {
  user_id: string;
  user?: {
    name?: string;
    color?: { id?: string; name?: string; bg?: string } | string;
    level?: {
      id: string;
      name: string;
      level_number: number;
      required_progress: number;
      image_url?: string;
    };
    experience_points?: number;
    task_completed?: number;
  };
  role?: 'creador' | 'miembro' | 'creator' | 'owner';
  family_id: string;
  joined_at: string;
}

interface ApiFamily {
  id: string;
  name: string;
  invitation_code: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

function mapApiFamilyToFamily(apiFamily: ApiFamily, members: Member[] = []): Family {
  return {
    id: apiFamily.id,
    name: apiFamily.name,
    invitationCode:
      apiFamily.invitation_code ||
      ((apiFamily as unknown as Record<string, unknown>).invitationCode as string) ||
      ((apiFamily as unknown as Record<string, unknown>).code as string) ||
      '',
    creatorId: apiFamily.creator_id,
    members: members,
    active: true,
    createdAt: new Date(apiFamily.created_at),
    updatedAt: new Date(apiFamily.updated_at),
  };
}

function cleanToken(token: string): string {
  if (!token) return '';

  if (token.includes('/invite/')) {
    const parts = token.split('/invite/');
    return parts[parts.length - 1].split(/[?#]/)[0];
  }

  if (token.includes('token=')) {
    const match = token.match(/[?&]token=([^&#]+)/);
    if (match) return match[1];
  }

  return token.trim();
}

export const FamilyService = {
  async getMyFamily(force: boolean = false): Promise<Family | null> {
    try {
      // Execute sequentially to avoid race conditions and handle errors individually
      const apiFamily = await fetchClient<ApiFamily>(
        `/api/v1/families/me${force ? '?t=' + Date.now() : ''}`
      ).catch(async (err) => {
        // If 404, retry with increasing delays to handle eventual consistency/latency
        if ((err as { status?: number }).status === 404) {
          // First retry: 1s delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          try {
            return await fetchClient<ApiFamily>(
              `/api/v1/families/me${force ? '?t=' + Date.now() : ''}`
            );
          } catch (retryErr) {
            if ((retryErr as { status?: number }).status === 404) {
              // Second retry: 2s delay
              await new Promise((resolve) => setTimeout(resolve, 2000));
              try {
                return await fetchClient<ApiFamily>(
                  `/api/v1/families/me${force ? '?t=' + Date.now() : ''}`
                );
              } catch (finalErr) {
                if ((finalErr as { status?: number }).status === 404) return null;
                throw finalErr;
              }
            }
            throw retryErr;
          }
        }
        throw err;
      });

      if (!apiFamily) return null;

      const members = await this.getMembers(force).catch(() => []);

      return mapApiFamilyToFamily(apiFamily, members);
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  },

  async getMembers(force: boolean = false): Promise<Member[]> {
    const endpoint = `/api/v1/family-members${force ? '?t=' + Date.now() : ''}`;
    try {
      const response = await fetchClient<ApiMember[]>(endpoint).catch(async (err) => {
        // Retry once for 404 to handle backend latency
        if ((err as { status?: number }).status === 404) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          return fetchClient<ApiMember[]>(endpoint).catch((retryErr) => {
            if ((retryErr as { status?: number }).status === 404) return [];
            throw retryErr;
          });
        }
        throw err;
      });

      return (response || []).map((apiMember) => {
        const user = apiMember.user || {};
        const colorData = mapColor(user.color, apiMember.user_id);
        const levelData = user.level;

        let role: 'creator' | 'member' = 'member';
        if (
          apiMember.role === 'creador' ||
          apiMember.role === 'creator' ||
          apiMember.role === 'owner'
        ) {
          role = 'creator';
        } else if (apiMember.role === 'miembro' || apiMember.role === 'member') {
          role = 'member';
        }

        return {
          id: apiMember.user_id,
          name: user.name || 'Miembro',
          color: colorData,
          experience_points: user.experience_points || 0,
          level: levelData
            ? {
                id: levelData.id,
                name: levelData.name,
                level_number: levelData.level_number,
                required_progress: levelData.required_progress,
                image_url: levelData.image_url,
              }
            : undefined,
          roleId: role,
          familyId: apiMember.family_id,
          createdAt: new Date(apiMember.joined_at),
          updatedAt: new Date(apiMember.joined_at),
        };
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return [];
      }
      throw error;
    }
  },

  async create(name: string): Promise<Family> {
    const apiFamily = await fetchClient<ApiFamily>('/api/v1/families/', {
      method: 'POST',
      body: { name },
    });
    const members = await this.getMembers();
    return mapApiFamilyToFamily(apiFamily, members);
  },

  async joinByCode(code: string): Promise<Family> {
    const cleaned = cleanToken(code);
    const apiFamily = await fetchClient<ApiFamily>('/api/v1/families/join/code', {
      method: 'POST',
      body: { code: cleaned },
    });
    const members = await this.getMembers();
    return mapApiFamilyToFamily(apiFamily, members);
  },

  async update(familyId: string, name: string): Promise<Family> {
    const apiFamily = await fetchClient<ApiFamily>(`/api/v1/families/${familyId}`, {
      method: 'PUT',
      body: { name },
    });
    const members = await this.getMembers();
    return mapApiFamilyToFamily(apiFamily, members);
  },

  async delete(familyId: string): Promise<void> {
    return fetchClient(`/api/v1/families/${familyId}`, {
      method: 'DELETE',
    });
  },

  async leave(newOwnerId?: string): Promise<void> {
    return fetchClient('/api/v1/family-members/me', {
      method: 'DELETE',
      body: newOwnerId ? { new_owner_id: newOwnerId } : undefined,
    });
  },

  async removeMember(memberId: string): Promise<void> {
    return fetchClient(`/api/v1/family-members/${memberId}`, {
      method: 'DELETE',
    });
  },

  async createInvitationCode(
    maxUses: number = 5,
    expiresInHours: number = 24
  ): Promise<{ code: string; expires_at: string }> {
    return fetchClient<{ code: string; expires_at: string }>('/api/v1/families/invitations/code', {
      method: 'POST',
      body: { max_uses: maxUses, expires_in_hours: expiresInHours },
    });
  },

  async createInvitationLink(): Promise<{ link: string; expires_at: string }> {
    return fetchClient<{ link: string; expires_at: string }>('/api/v1/families/invitations/link', {
      method: 'POST',
    });
  },

  async getInvitationInfo(
    token: string
  ): Promise<{ family_id: string; family_name: string; inviter_name: string | null }> {
    const cleaned = cleanToken(token);
    return fetchClient<{ family_id: string; family_name: string; inviter_name: string | null }>(
      `/api/v1/families/invitations/info?token=${cleaned}`,
      {
        requiresAuth: false,
      }
    );
  },

  async joinByLink(token: string): Promise<Family> {
    const cleaned = cleanToken(token);
    const apiFamily = await fetchClient<ApiFamily>('/api/v1/families/join/link', {
      method: 'POST',
      body: { token: cleaned },
    });

    try {
      const members = await this.getMembers(true);
      return mapApiFamilyToFamily(apiFamily, members);
    } catch (error) {
      console.warn('Could not fetch members immediately after joining by link:', error);
      return mapApiFamilyToFamily(apiFamily, []);
    }
  },

  async validateCode(code: string): Promise<ValidateCodeResponse> {
    try {
      const info = await this.getInvitationInfo(code);
      return {
        valid: true,
        familyName: info.family_name,
      };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message || 'Código inválido',
      };
    }
  },
};
