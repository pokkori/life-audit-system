import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Life Audit System',
        short_name: 'Life Audit',
        description: 'あなたの「先延ばし」による生涯損失額を診断します。',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#00ff80',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
