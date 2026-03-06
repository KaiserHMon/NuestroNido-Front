import { Metadata } from 'next';
import { FamilyService } from '@/services/family-service';
import { InvitePageContent } from '@/components/invite-page-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  try {
    const info = await FamilyService.getInvitationInfo(token);

    return {
      title: `Únete a la familia ${info.family_name}`,
      description: `Te han invitado a formar parte de ${info.family_name} en NuestroNido. ¡Coordina tareas, listas y más en un solo lugar!`,
      openGraph: {
        title: `Invitación a NuestroNido: Familia ${info.family_name}`,
        description: `Únete a ${info.family_name} y ayuda a organizar el hogar de forma divertida.`,
        type: 'website',
        images: [
          {
            url: '/og-image.svg',
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
        images: ['/og-image.svg'],
        creator: '@nuestronido',
      },
    };
  } catch (error) {
    // Log the error to ensure observability when fetching family info fails
    console.error('Failed to fetch invitation info for metadata:', error);
    return {
      title: 'Invitación a NuestroNido',
      description: 'Únete a una familia en NuestroNido para organizar tu hogar.',
    };
  }
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <InvitePageContent token={token} />;
}
