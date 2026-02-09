
import { Metadata } from 'next';
import AuditApp from './AuditApp';
import { Locale } from '@/types/audit';

type Props = {
  searchParams: { lang?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = searchParams.lang;
  const isEn = lang === 'en';

  const title = isEn
    ? 'Lifetime Financial Loss Diagnosis | Life Audit System'
    : '人生の生涯損失 診断レポート | Life Audit System';

  const description = isEn
    ? 'How much money are you losing by procrastination? diagnose your lifetime financial loss now.'
    : 'あなたの「先延ばし」による生涯損失額を診断します。資産、健康、キャリアのリスクを可視化。';

  // Determine base URL for absolute path (Metadata requires absolute URL or starts with /)
  // Since we are in generateMetadata, we can use relative path which resolves to absolute in Next.js? 
  // Next.js documentation says metadataBase should be set, but relative URLs are resolved relative to it.
  // Assuming metadataBase is not set, we might need absolute URL? 
  // But wait, Page Props doesn't give us the host.
  // We can just use relative path assuming Next.js handles it or use process.env.VERCEL_URL if available.
  // Standard Next.js practice: just use string starting with / for internal assets.
  const imageUrl = `/api/og?lang=${isEn ? 'en' : 'jp'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: isEn ? 'en_US' : 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function Page({ searchParams }: Props) {
  // Ensure we pass the correct initial locale/region if present in URL
  const initialLocale: Locale = searchParams.lang === 'en' ? 'en-US' : 'ja-JP';

  return <AuditApp initialLocale={initialLocale} />;
}
