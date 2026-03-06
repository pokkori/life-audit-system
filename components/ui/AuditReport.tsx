'use client';

import { useMemo, useEffect, useState } from 'react';
import { AuditResultReport, DisplayCategory, Locale, Region } from '@/types/audit';
import { AccordionCard } from './AccordionCard';
import { ShareButtons } from './ShareButtons';
import { CreatorProfile } from './CreatorProfile';
// import { RecoverySimulator } from './RecoverySimulator';
// import { ImprovementRoadmap } from './ImprovementRoadmap';
import { LIFETIME_AGE } from '@/lib/AuditEngine';
import { getTranslations, formatCurrency } from '@/lib/i18n';

async function startCheckout() {
    const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
}

export function AuditReport({
    report,
    age,
    locale = 'ja-JP',
    region = 'JP'
}: {
    report: AuditResultReport;
    age: number;
    locale?: Locale;
    region?: Region;
}) {
    const t = getTranslations(locale);

    // NaN防止: remainingYearsの安全な計算
    const remainingYears = useMemo(() => {
        const years = LIFETIME_AGE - age;
        return isNaN(years) || years < 0 ? 0 : years;
    }, [age]);

    // カテゴリごとにグループ化
    const groupedBreakdown = useMemo(() => {
        const grouped: Record<DisplayCategory, typeof report.breakdown> = {} as any;
        report.breakdown.forEach(item => {
            const category = item.item.displayCategory;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(item);
        });
        return grouped;
    }, [report.breakdown]);

    // 最も損失額が大きいカテゴリを取得
    const topCategory = useMemo(() => {
        const categoryTotals: Record<DisplayCategory, number> = {} as any;
        report.breakdown.forEach(item => {
            const category = item.item.displayCategory;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += item.financialLoss;
        });
        const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
        return sortedCategories[0]?.[0] as DisplayCategory;
    }, [report.breakdown]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* メインレポート */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 shadow-2xl border border-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
                    <div className="text-center sm:text-left flex-1">
                        <div className="inline-block p-1 px-2 mb-4 rounded bg-amber-500/10 border border-amber-500/30">
                            <p className="text-[10px] text-amber-500 font-bold tracking-[0.2em] font-orbitron uppercase">{t.report.official_doc}</p>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-300 mb-2 tracking-widest font-orbitron">{t.report.title}</h2>
                        <p className="text-gray-400">{t.report.subtitle.replace('{years}', remainingYears.toString())}</p>
                    </div>

                    {/* コンパクトなランクバッジ */}
                    <div className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center min-w-[100px] shadow-2xl backdrop-blur-sm relative group transition-transform hover:scale-105`}
                        style={{
                            borderColor: report.rank.color,
                            backgroundColor: `${report.rank.color}10`,
                            boxShadow: `0 0 20px ${report.rank.glowColor}`
                        }}>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        <span className="text-[10px] font-bold text-gray-400 font-orbitron leading-none mb-1 tracking-widest uppercase">{t.report.rank}</span>
                        <span className="text-5xl font-black font-orbitron leading-none" style={{ color: report.rank.color }}>
                            {report.rank.rank}
                        </span>
                    </div>
                </div>

                <div className="text-center relative z-10">
                    <div className="my-8 flex justify-center items-center gap-1 w-full overflow-hidden px-2">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 font-roboto-mono flex-shrink-0">
                            {region === 'JP' ? '¥' : '$'}
                        </span>
                        <p className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-red-600 font-roboto-mono text-neon-blood animate-heartbeat-heavy tracking-tighter leading-none whitespace-nowrap">
                            {Math.round(report.totalFinancialLoss).toLocaleString()}
                        </p>
                    </div>
                    <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg max-w-md mx-auto">
                        <p className="text-sm text-amber-400 uppercase tracking-widest font-orbitron mb-1">{t.report.major_leak}</p>
                        <p className="text-xl text-white font-bold">
                            {t.report.top_priority.replace('{category}', t.report.categories[topCategory])}
                        </p>
                    </div>
                </div>
            </div>

            {/* シミュレーター & ロードマップ (収益化の鍵) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <RecoverySimulator
                    totalLoss={report.totalFinancialLoss}
                    maxRecoverable={report.maxRecoverableLoss}
                    region={region}
                /> */}
                {/* <ImprovementRoadmap region={region} /> */}
            </div>

            {/* 推奨対策 */}
            <h3 className="text-lg font-semibold mb-6 text-gray-300 text-center font-orbitron">{t.report.breakdown}</h3>
            <div className="space-y-10">
                {Object.entries(groupedBreakdown).map(([category, items]) => (
                    <div key={category}>
                        <h4 className="text-md font-bold text-amber-500 mb-2 pl-2 font-orbitron">{t.report.categories[category as DisplayCategory]}</h4>
                        <div className="space-y-2">
                            {items.map((itemResult, index) => (
                                <AccordionCard
                                    key={`${itemResult.item.id}-${index}`}
                                    itemResult={itemResult}
                                    remainingYears={remainingYears}
                                    locale={locale}
                                    region={region}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* 推奨対策 */}
            {report.recommendedPatches && report.recommendedPatches.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 shadow-2xl border border-gray-700">
                    <h3 className="text-lg font-bold mb-6 text-yellow-400 text-center flex items-center justify-center gap-2 font-orbitron tracking-wide">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {t.report.immediate_action}
                    </h3>
                    <div className="space-y-4">
                        {report.recommendedPatches.map((patch, index) => {
                            const recoverableAmount = Math.round(patch.potentialRecovery * 0.3);
                            // TODO: Use formatCurrency here but keep it simple for now
                            const formattedAmount = formatCurrency(recoverableAmount, region, locale);
                            return (
                                <div
                                    key={index}
                                    className="p-6 bg-gradient-to-r from-gray-800 to-gray-750 rounded-lg border-l-4 border-amber-600 shadow-lg"
                                >
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{patch.icon}</span>
                                                <p className="font-bold text-white text-lg">{patch.title}</p>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{patch.copy}</p>

                                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-900/30 border border-amber-500/20 rounded-lg text-amber-500 text-xs font-bold">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {t.report.recovery_amount.replace('{amount}', formattedAmount)}
                                                </div>

                                                {patch.actionUrl && patch.actionLabel && (
                                                    <a
                                                        href={patch.actionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
                                                    >
                                                        {patch.actionLabel}
                                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 損失の項目別詳細 */}
            {/* 損失の項目別詳細 (Removed as duplicate) */}
            {/* <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 shadow-2xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-6 text-gray-300 text-center font-orbitron">損失の項目別詳細</h3>
                <div className="space-y-10">
                    {Object.entries(groupedBreakdown).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="text-md font-bold text-amber-500 mb-2 pl-2 font-orbitron">{category}</h4>
                            <div className="space-y-2">
                                {items.map((itemResult, index) => (
                                    <AccordionCard
                                        key={`${itemResult.item.id}-${index}`}
                                        itemResult={itemResult}
                                        remainingYears={remainingYears}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* SNSシェアボタン */}
            <ShareButtons
                totalLoss={report.totalFinancialLoss}
                lossAnalogy={report.lossAnalogy || ''}
                topRiskCategory={topCategory}
                locale={locale}
            />

            {/* アップグレードCTA */}
            <div className="mt-8 p-6 rounded-2xl border border-green-500/30 bg-green-500/5 text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-green-400 mb-2">損失を取り戻す改善プランを見る</h3>
                <p className="text-gray-400 text-sm mb-4">
                    あなたの診断結果をもとに、AIが具体的な改善シミュレーションと<br />
                    回収ロードマップを生成します。（買い切り ¥1,980）
                </p>
                <button
                    onClick={startCheckout}
                    className="px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
                >
                    改善プランを解除する
                </button>
            </div>

            {/* クリエイタープロフィール */}
            <CreatorProfile />
        </div>
    );
}
