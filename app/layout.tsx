import type { Metadata } from "next";
import { Inter, Roboto_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { BackgroundEffect } from "@/components/ui/BackgroundEffect";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: '--font-roboto-mono', weight: ['400', '700'] });
const orbitron = Orbitron({ subsets: ["latin"], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: "Life Diagnosis System | 人生の診断システム",
  description: "あなたの「先延ばし」による生涯損失額を診断します。資産、健康、キャリア、時間の4つの観点からリスクを可視化。",
  openGraph: {
    title: "Life Diagnosis System | 人生の診断システム",
    description: "私の生涯損失額はいくら...？ あなたの「先延ばし」リスクを今すぐ診断。",
    url: "https://life-audit-system.vercel.app",
    siteName: "Life Audit System",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Diagnosis System | 人生の診断システム",
    description: "あなたの「先延ばし」による生涯損失額を診断します。",
    creator: "@levona_design",
    site: "@levona_design",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className={`${inter.variable} ${robotoMono.variable} ${orbitron.variable} font-sans bg-black min-h-screen text-white overflow-x-hidden antialiased selection:bg-green-500 selection:text-black`}>
        <BackgroundEffect />
        <div className="relative z-10">
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
