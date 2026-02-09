'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Rocket, ExternalLink } from 'lucide-react';
import { REGIONAL_AFFILIATE_LINKS, DEFAULT_AFFILIATE } from '@/lib/AuditEngine';
import { AuditCategory, Region } from '@/types/audit';

interface RoadmapStepProps {
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
    actionUrl?: string;
    actionLabel?: string;
}

function RoadmapStep({ number, title, description, icon, colorClass, actionUrl, actionLabel }: RoadmapStepProps) {
    return (
        <div className="relative flex gap-4 items-start group p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-gray-700/50">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white relative z-10 shadow-lg`}>
                {icon}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                    {number}
                </div>
            </div>
            <div className="flex-1">
                <h4 className="text-md font-bold text-gray-200 mb-1 flex items-center gap-2">
                    {title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{description}</p>
                {actionUrl && actionLabel && (
                    <a
                        href={actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-500 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    >
                        <ExternalLink size={14} />
                        {actionLabel} <ArrowRight size={12} />
                    </a>
                )}
            </div>
        </div>
    );
}

export function ImprovementRoadmap({ region = 'JP' }: { region?: Region }) {
    const affiliates = REGIONAL_AFFILIATE_LINKS[region];

    const step1Affiliate = affiliates[AuditCategory.ENVIRONMENT] || DEFAULT_AFFILIATE;
    const step2Affiliate = affiliates[AuditCategory.SAVINGS] || DEFAULT_AFFILIATE;
    const step3Affiliate = affiliates[AuditCategory.INVESTMENT] || DEFAULT_AFFILIATE;

    const content = region === 'JP' ? {
        title: '損失回収の3ステップ',
        subtitle: (
            <>
                あなたの生涯損失を取り戻すための、<br />
                最も効率的なアクションプランです。
            </>
        ),
        step1: {
            title: '即時コストのカット (Week 1)',
            desc: 'サブスクの見直しや、不用品の売却で、まずは「無自覚な垂れ流し」を即座に止め、種銭を作ります。'
        },
        step2: {
            title: '固定費の劇的削減 (Month 1)',
            desc: '住宅ローンの借り換えやスマホ代の見直しを行い、生涯レベルで数百万〜数千万の支出を圧縮します。'
        },
        step3: {
            title: '未来の資産形成 (Ongoing)',
            desc: '浮いた資金を新NISA等の非課税制度で運用。失った時間を「複利の力」で加速的に取り戻します。'
        },
        cta: `まずは、上のリストにある「${step1Affiliate.actionLabel}」から最初の一歩を踏み出しましょう。`
    } : {
        title: '3 Steps to Recovery',
        subtitle: (
            <>
                A strategic action plan to recover<br />
                your lifetime financial loss.
            </>
        ),
        step1: {
            title: 'Stop the Bleeding (Week 1)',
            desc: 'Cancel unused subscriptions and cut impulse buying. Stop userless cash drain instantly.'
        },
        step2: {
            title: 'Slash Fixed Costs (Month 1)',
            desc: 'Refinance high-interest debts and optimize large recurring bills to save thousands long-term.'
        },
        step3: {
            title: 'Build Wealth (Ongoing)',
            desc: 'Invest the savings into tax-advantaged accounts (401k/Roth IRA). Let compound interest work for you.'
        },
        cta: `Start by clicking "${step1Affiliate.actionLabel}" above to take your first step.`
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-2xl border border-gray-700 mb-8">
            <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-amber-500 font-orbitron tracking-widest uppercase flex items-center justify-center gap-3 mb-2">
                    <Rocket className="w-5 h-5" />
                    {content.title}
                </h3>
                <p className="text-sm text-gray-400">
                    {content.subtitle}
                </p>
            </div>

            <div className="relative pl-2">
                {/* 垂直ライン */}
                <div className="absolute left-[20px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 via-amber-500 to-green-500 opacity-30" />

                <RoadmapStep
                    number={1}
                    title={content.step1.title}
                    description={content.step1.desc}
                    icon={<Zap size={18} />}
                    colorClass="bg-blue-600 shadow-blue-500/40"
                    actionUrl={step1Affiliate.link}
                    actionLabel={step1Affiliate.actionLabel}
                />

                <RoadmapStep
                    number={2}
                    title={content.step2.title}
                    description={content.step2.desc}
                    icon={<ShieldCheck size={18} />}
                    colorClass="bg-amber-600 shadow-amber-500/40"
                    actionUrl={step2Affiliate.link}
                    actionLabel={step2Affiliate.actionLabel}
                />

                <RoadmapStep
                    number={3}
                    title={content.step3.title}
                    description={content.step3.desc}
                    icon={<CheckCircle2 size={18} />}
                    colorClass="bg-green-600 shadow-green-500/40"
                    actionUrl={step3Affiliate.link}
                    actionLabel={step3Affiliate.actionLabel}
                />
            </div>

            <div className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                <p className="text-sm text-amber-400 font-bold mb-3">
                    {content.cta}
                </p>
                <div className="flex justify-center">
                    <ArrowRight className="text-amber-500 animate-bounce" />
                </div>
            </div>
        </div>
    );
}
