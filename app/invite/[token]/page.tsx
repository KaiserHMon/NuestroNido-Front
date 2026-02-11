import { Metadata } from 'next';
import { FamilyService } from '@/services/family-service';
import { InvitePageContent } from '@/components/invite-page-content';

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const token = params.token;
  try {
    const info = await FamilyService.getInvitationInfo(token);
    const ogUrl = new URL('https://nuestronido.vercel.app/api/og');
    if (info.family_name) ogUrl.searchParams.set('familyName', info.family_name);
    if (info.inviter_name) ogUrl.searchParams.set('inviterName', info.inviter_name);

    return {
      title: `Únete a la familia ${info.family_name}`,
      description: `Te han invitado a formar parte de ${info.family_name} en NuestroNido. ¡Coordina tareas, listas y más en un solo lugar!`,
      openGraph: {
        title: `Invitación a NuestroNido: Familia ${info.family_name}`,
        description: `Únete a ${info.family_name} y ayuda a organizar el hogar de forma divertida.`,
        type: 'website',
        images: [
          {
            url: ogUrl.toString(),
            width: 1200,
            height: 630,
            alt: `Invitación a la familia ${info.family_name}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `¡Te invitamos a la familia ${info.family_name}!`,
        description: `Únete a nosotros en NuestroNido.`,
        images: [ogUrl.toString()],
      },
    };
  } catch {
    return {
      title: 'Invitación a NuestroNido',
      description: 'Únete a una familia en NuestroNido para organizar tu hogar.',
    };
  }
}

export default function InvitePage({ params }: { params: { token: string } }) {
  return <InvitePageContent token={params.token} />;
}