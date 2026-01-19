import { fetchClient } from '@/lib/api-client';
import { Familia, Miembro, ValidarCodigoResponse } from '@/lib/types';
import { getColorById } from '@/lib/colors';

interface ApiMember {
  user_id: string;
  user?: {
    name?: string;
    color?: { id?: string; name?: string; bg?: string } | string;
    level?: { name?: string; image_url?: string };
    task_completed?: number;
  };
  role?: 'creador' | 'miembro';
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
    codigoInvitacion: apiFamily.invitation_code,
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
      // The API returns the family object directly or 404
      const apiFamily = await fetchClient<ApiFamily>('/api/families/me');
      if (!apiFamily) return null;

      // We also need members to populate the full Familia object as per types
      const members = await this.getMembers();
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

      const levelData = user.level || {};

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
        puntos: user.task_completed || 0,
        nivel: levelData.name
          ? {
              nombre: levelData.name,
              imageUrl: levelData.image_url,
            }
          : undefined,
        rolId: apiMember.role || 'member',
        familiaId: apiMember.family_id,
        createdAt: new Date(apiMember.joined_at), // Using joined_at as proxy
        updatedAt: new Date(apiMember.joined_at),
      };
    });
  },

  async create(nombre: string): Promise<Familia> {
    const apiFamily = await fetchClient<ApiFamily>('/api/families/', {
      method: 'POST',
      body: { name: nombre },
    });
    const members = await this.getMembers();
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async joinByCode(code: string): Promise<Familia> {
    const apiFamily = await fetchClient<ApiFamily>('/api/families/join/code', {
      method: 'POST',
      body: { code },
    });
    const members = await this.getMembers();
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async update(familyId: string, nombre: string): Promise<Familia> {
    const apiFamily = await fetchClient<ApiFamily>(`/api/families/${familyId}`, {
      method: 'PUT',
      body: { name: nombre },
    });
    const members = await this.getMembers();
    return mapApiFamilyToFamilia(apiFamily, members);
  },

  async delete(familyId: string): Promise<void> {
    return fetchClient(`/api/families/${familyId}`, {
      method: 'DELETE',
    });
  },

  async leave(): Promise<void> {
    return fetchClient('/api/family-members/me', {
      method: 'DELETE',
    });
  },

  async removeMember(memberId: string): Promise<void> {
    return fetchClient(`/api/family-members/${memberId}`, {
      method: 'DELETE',
    });
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
