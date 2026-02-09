import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'jp';
    const isEn = lang === 'en';

    const title = isEn
        ? 'Lifetime Financial Loss Calculator'
        : '一生で損する金額を算出';
    const subtitle = isEn
        ? 'Visualize your procrastination cost.'
        : 'あなたの「先延ばし」による生涯損失を可視化';

    // Note: Using standard system fonts for simplicity. 
    // In a real environment, we might load a custom font (e.g. Google Fonts) here.

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
                    backgroundColor: '#020617', // slate-950/black
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #1e1b4b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #312e81 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(0, 0, 0, 0.9))', zIndex: 0 }} />

                {/* Content Container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1, padding: '40px' }}>

                    {/* Icon */}
                    <div style={{ fontSize: 80, marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))' }}>
                        💸
                    </div>

                    {/* Title */}
                    <div style={{
                        fontSize: 60,
                        fontWeight: 900,
                        textAlign: 'center',
                        marginBottom: 20,
                        backgroundImage: 'linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        textShadow: '0 0 40px rgba(96, 165, 250, 0.3)',
                        lineHeight: 1.2,
                    }}>
                        {title}
                    </div>

                    {/* Subtitle */}
                    <div style={{ fontSize: 30, color: '#cbd5e1', textAlign: 'center', maxWidth: 800 }}>
                        {subtitle}
                    </div>

                    {/* Branding */}
                    <div style={{ marginTop: 40, fontSize: 20, color: '#64748b', display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 8 }}>⚡</span> Life Audit System
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
