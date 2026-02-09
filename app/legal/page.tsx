import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/types/audit';
import { getTranslations } from '@/lib/i18n';

const STORAGE_KEY = 'life_audit_state';

export default function LegalPage() {
    const [locale, setLocale] = useState<Locale>('ja-JP');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                if (state.locale) {
                    setLocale(state.locale);
                }
            } catch (e) {
                console.error('Failed to load locale preference', e);
            }
        }
        setMounted(true);
    }, []);

    const t = getTranslations(locale);

    if (!mounted) {
        return <div className="min-h-screen bg-black" />; // Prevent hydration mismatch
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 py-16 px-4 font-sans">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-3xl font-orbitron text-white tracking-widest">{t.legal.title}</h1>
                    <p className="text-amber-500 font-orbitron text-sm">{t.legal.links}</p>
                </header>

                <section className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 space-y-8 backdrop-blur-sm">
                    {/* 利用規約 / Terms */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-l-4 border-amber-500 pl-4">{t.legal.terms.title}</h2>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <ul className="list-disc pl-5 space-y-2">
                                {t.legal.terms.content.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* プライバシーポリシー / Privacy */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-l-4 border-amber-500 pl-4">{t.legal.privacy.title}</h2>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <ul className="list-disc pl-5 space-y-2">
                                {t.legal.privacy.content.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <footer className="text-center pt-8">
                    <Link
                        href="/"
                        className="text-amber-500 hover:text-amber-400 transition-colors duration-200 font-orbitron tracking-widest"
                    >
                        {t.legal.back_to_diagnosis}
                    </Link>
                </footer>
            </div>
        </div>
    );
}
