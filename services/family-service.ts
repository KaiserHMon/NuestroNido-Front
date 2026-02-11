import { fetchClient } from '@/lib/api-client';
import { Familia, Miembro, ValidarCodigoResponse } from '@/lib/types';
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

function cleanToken(token: string): string {
  if (!token) return '';
  
  // Si es una URL completa, extraer la parte final después de /invite/
  if (token.includes('/invite/')) {
    const parts = token.split('/invite/');
    return parts[parts.length - 1].split(/[?#]/)[0];
  }
  
  // Si tiene un parámetro token=, extraerlo
  if (token.includes('token=')) {
    const match = token.match(/[?&]token=([^&#]+)/);
    if (match) return match[1];
  }
  
  // Si es solo el código o token, devolverlo limpio de espacios
  return token.trim();
}

export const FamilyService = {
  async getMyFamily(): Promise<Familia | null> {
    try {
      // Parallelize family and members fetch to eliminate waterfall
      const [apiFamily, members] = await Promise.all([
        fetchClient<ApiFamily>('/api/v1/families/me'),
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
    const response = await fetchClient<ApiMember[]>('/api/v1/family-members/');

    return response.map((apiMember) => {
      const user = apiMember.user || {};
      
      const colorData = mapColor(user.color, apiMember.user_id);

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
        color: colorData,
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
      fetchClient<ApiFamily>('/api/v1/families/', {
        method: 'POST',
        body: { name: nombre },
      }),
      this.getMembers(),
    ]);
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async joinByCode(code: string): Promise<Familia> {
    const cleaned = cleanToken(code);
    const [apiFamily, members] = await Promise.all([
      fetchClient<ApiFamily>('/api/v1/families/join/code', {
        method: 'POST',
        body: { code: cleaned },
      }),
      this.getMembers(),
    ]);
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async update(familyId: string, nombre: string): Promise<Familia> {
    const [apiFamily, members] = await Promise.all([
      fetchClient<ApiFamily>(`/api/v1/families/${familyId}`, {
        method: 'PUT',
        body: { name: nombre },
      }),
      this.getMembers(),
    ]);
    return mapApiFamilyToFamilia(apiFamily, members);
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

  // --- NUEVOS MÉTODOS DE INVITACIÓN ---

  async createInvitationCode(maxUses: number = 5, expiresInHours: number = 24): Promise<{ code: string; expires_at: string }> {
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

  async getInvitationInfo(token: string): Promise<{ family_id: string; family_name: string; inviter_name: string | null }> {
    const cleaned = cleanToken(token);
    return fetchClient<{ family_id: string; family_name: string; inviter_name: string | null }>(`/api/v1/families/invitations/info?token=${cleaned}`, {
       requiresAuth: false
    });
  },

  async joinByLink(token: string): Promise<Familia> {
    const cleaned = cleanToken(token);
    const apiFamily = await fetchClient<ApiFamily>('/api/v1/families/join/link', {
      method: 'POST',
      body: { token: cleaned },
    });
    // After joining, we need to refresh members too
    const members = await this.getMembers();
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async validateCode(code: string): Promise<ValidarCodigoResponse> {
    try {
      const info = await this.getInvitationInfo(code);
      return {
        valido: true,
        nombreFamilia: info.family_name,
        // Backend returns family_id and family_name
      };
    } catch (error) {
      return {
        valido: false,
        error: (error as Error).message || 'Código inválido'
      };
    }
  }
};
