import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extraer parámetros de la URL
    const familyName = searchParams.get('familyName');
    const inviterName = searchParams.get('inviterName');

    // Colores del proyecto
    const colors = {
      primary: '#f76e6e',
      background: '#fbd7a7',
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(247, 110, 110, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(247, 110, 110, 0.1) 0%, transparent 50%)',
            padding: '40px 80px',
          }}
        >
          {/* Logo Circle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary,
              borderRadius: '50%',
              width: '140px',
              height: '140px',
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(247, 110, 110, 0.4)',
            }}
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '80px', fontWeight: 'bold', color: colors.primary, margin: 0, marginBottom: '10px' }}>
              NuestroNido
            </h1>
            
            <p style={{ fontSize: '42px', color: colors.primary, fontWeight: '600', maxWidth: '900px', margin: '10px 0' }}>
              {familyName 
                ? `¡Únete a la familia ${familyName}!` 
                : "Un hogar más organizado, conectado y en armonía."}
            </p>

            {inviterName && (
              <p style={{ fontSize: '28px', color: colors.primary, opacity: 0.8, marginTop: '5px' }}>
                Invitación enviada por {inviterName}
              </p>
            )}

            <div style={{ 
              marginTop: '40px', 
              padding: '10px 30px', 
              backgroundColor: 'rgba(247, 110, 110, 0.1)', 
              borderRadius: '30px',
              display: 'flex'
            }}>
              <span style={{ fontSize: '24px', color: colors.primary, fontWeight: 'bold' }}>
                nuestronido.vercel.app
              </span>
            </div>
          </div>
          
          {/* Decorative Birds */}
          <div style={{ position: 'absolute', top: '10%', left: '10%', opacity: 0.15 }}>
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>
          </div>
          <div style={{ position: 'absolute', bottom: '15%', right: '10%', opacity: 0.15 }}>
             <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: unknown) {
    const error = e as Error;
    console.log(`${error.message}`);
    return new NextResponse(`Failed to generate the image`, { status: 500 });
  }
}