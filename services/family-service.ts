import { fetchClient } from '@/lib/api-client';
import { Familia, Miembro, ValidarCodigoResponse } from '@/lib/types';
import { getColorById, COLORES_DISPONIBLES } from '@/lib/colors';

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

function mapApiFamilyToFamilia(apiFamily: ApiFamily, members: Miembro[] = []): Familia {
  return {
    id: apiFamily.id,
    nombre: apiFamily.name,
    // Fallback to various potential property names for invitation code
    codigoInvitacion: apiFamily.invitation_code || ((apiFamily as unknown as Record<string, unknown>).invitationCode as string) || ((apiFamily as unknown as Record<string, unknown>).code as string) || '',
    creadorId: apiFamily.creator_id,
    miembros: members,
    activa: true, // Defaulting to true as not in API response?
    createdAt: new Date(apiFamily.created_at),
    updatedAt: new Date(apiFamily.updated_at),
  };
}

export const FamilyService = {
  async getMyFamily(): Promise<Familia | null> {
    try {
      // Parallelize family and members fetch to eliminate waterfall
      const [apiFamily, members] = await Promise.all([
        fetchClient<ApiFamily>('/api/families/me'),
        this.getMembers(),
      ]);

      if (!apiFamily) return null;

      return mapApiFamilyToFamilia(apiFamily, members);
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  },

  async getMembers(): Promise<Miembro[]> {
    const response = await fetchClient<ApiMember[]>('/api/family-members/');

    return response.map((apiMember) => {
      const user = apiMember.user || {};
      
      let colorData: { id?: string; name?: string; bg?: string } = { name: 'Gris', bg: '#9CA3AF', id: 'default' };
      
      if (typeof user.color === 'string') {
        const foundColor = getColorById(user.color);
        if (foundColor) {
           colorData = foundColor;
        }
      } else if (user.color) {
        colorData = user.color;
      }

      // If color is still default, assign a consistent random color based on user_id
      if (colorData.id === 'default' && COLORES_DISPONIBLES.length > 0) {
        let hash = 0;
        const str = apiMember.user_id;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % COLORES_DISPONIBLES.length;
        colorData = COLORES_DISPONIBLES[index];
      }

      const levelData = user.level;
      
      let role: 'creador' | 'miembro' | 'member' = 'member';
      if (apiMember.role === 'creador' || apiMember.role === 'creator' || apiMember.role === 'owner') {
          role = 'creador';
      } else if (apiMember.role === 'miembro' || apiMember.role === 'member') {
          role = 'miembro';
      }

      return {
        id: apiMember.user_id, // The member ID in UI usually refers to the User ID for identification
        nombre: user.name || 'Miembro',
        color: {
          id: colorData.id || 'default',
          nombre: colorData.name || 'Gris',
          bg: colorData.bg || '#9CA3AF',
          text: '#FFFFFF', // Default
          accent: colorData.bg || '#9CA3AF', // Default
          wcagContrast: 4.5,
        },
        experience_points: user.experience_points || 0,
        nivel: levelData
          ? {
              id: levelData.id,
              name: levelData.name,
              level_number: levelData.level_number,
              required_progress: levelData.required_progress,
              image_url: levelData.image_url,
            }
          : undefined,
        rolId: role,
        familiaId: apiMember.family_id,
        createdAt: new Date(apiMember.joined_at), // Using joined_at as proxy
        updatedAt: new Date(apiMember.joined_at),
      };
    });
  },

  async create(nombre: string): Promise<Familia> {
    const [apiFamily, members] = await Promise.all([
      fetchClient<ApiFamily>('/api/families/', {
        method: 'POST',
        body: { name: nombre },
      }),
      this.getMembers(),
    ]);
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async joinByCode(code: string): Promise<Familia> {
    const [apiFamily, members] = await Promise.all([
      fetchClient<ApiFamily>('/api/families/join/code', {
        method: 'POST',
        body: { code },
      }),
      this.getMembers(),
    ]);
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async update(familyId: string, nombre: string): Promise<Familia> {
    const [apiFamily, members] = await Promise.all([
      fetchClient<ApiFamily>(`/api/families/${familyId}`, {
        method: 'PUT',
        body: { name: nombre },
      }),
      this.getMembers(),
    ]);
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async delete(familyId: string): Promise<void> {
    return fetchClient(`/api/families/${familyId}`, {
      method: 'DELETE',
    });
  },

  async leave(newOwnerId?: string): Promise<void> {
    return fetchClient('/api/family-members/me', {
      method: 'DELETE',
      body: newOwnerId ? { new_owner_id: newOwnerId } : undefined,
    });
  },

  async removeMember(memberId: string): Promise<void> {
    return fetchClient(`/api/family-members/${memberId}`, {
      method: 'DELETE',
    });
  },

  // --- NUEVOS MÉTODOS DE INVITACIÓN ---

  async createInvitationCode(maxUses: number = 5, expiresInHours: number = 24): Promise<{ code: string; expires_at: string }> {
    return fetchClient<{ code: string; expires_at: string }>('/api/families/invitations/code', {
      method: 'POST',
      body: { max_uses: maxUses, expires_in_hours: expiresInHours },
    });
  },

  async createInvitationLink(): Promise<{ link: string; expires_at: string }> {
    return fetchClient<{ link: string; expires_at: string }>('/api/families/invitations/link', {
      method: 'POST',
    });
  },

  async getInvitationInfo(token: string): Promise<{ family_id: string; family_name: string; inviter_name: string | null }> {
    // This endpoint is public, so requiresAuth might need to be false if supported by fetchClient,
    // or we assume it works even if token is missing/null in storage.
    // Based on fetchClient implementation, it adds token if present.
    // We should allow calling this without auth.
    return fetchClient<{ family_id: string; family_name: string; inviter_name: string | null }>(`/api/families/invitations/info?token=${token}`, {
       requiresAuth: false
    });
  },

  async joinByLink(token: string): Promise<Familia> {
    const apiFamily = await fetchClient<ApiFamily>('/api/families/join/link', {
      method: 'POST',
      body: { token },
    });
    // After joining, we need to refresh members too
    const members = await this.getMembers();
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  // Mock validation since no endpoint exists
  async validateCode(code: string): Promise<ValidarCodigoResponse> {
    if (code.length !== 8) {
      return { valido: false, error: 'El código debe tener 8 caracteres' };
    }
    // We can't verify existence without trying to join (which is a state change).
    // Returning true potentially, or we could handle this in the UI.
    return { valido: true };
  }
};
