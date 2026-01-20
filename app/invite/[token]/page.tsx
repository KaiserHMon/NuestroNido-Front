import { Metadata } from 'next';
import { FamilyService } from '@/services/family-service';
import { InvitePageContent } from '@/components/invite-page-content';

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const token = params.token;
  try {
    const info = await FamilyService.getInvitationInfo(token);
    return {
      title: `Únete a la familia ${info.family_name}`,
      description: `Te han invitado a formar parte de ${info.family_name} en NuestroNido. ¡Coordina tareas, listas y más en un solo lugar!`,
      openGraph: {
        title: `Invitación a NuestroNido: Familia ${info.family_name}`,
        description: `Únete a ${info.family_name} y ayuda a organizar el hogar de forma divertida.`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Invitación a NuestroNido',
      description: 'Únete a una familia en NuestroNido para organizar tu hogar.',
    };
  }
}

export default function InvitePage({ params }: { params: { token: string } }) {
  return <InvitePageContent token={params.token} />;
}