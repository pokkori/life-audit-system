'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Rocket } from 'lucide-react';

interface RoadmapStepProps {
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
}

function RoadmapStep({ number, title, description, icon, colorClass }: RoadmapStepProps) {
    return (
        <div className="relative flex gap-4 items-start group">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white relative z-10 shadow-lg`}>
                {icon}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                    {number}
                </div>
            </div>
            <div className="flex-1 pb-8">
                <h4 className="text-md font-bold text-gray-200 mb-1 group-hover:text-amber-400 transition-colors">{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

export function ImprovementRoadmap() {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-2xl border border-gray-700 mb-8">
            <h3 className="text-lg font-bold mb-8 text-amber-500 text-center font-orbitron tracking-widest uppercase flex items-center justify-center gap-3">
                <Rocket className="w-5 h-5" />
                生涯損失リカバー・ロードマップ
            </h3>

            <div className="relative pl-2">
                {/* 垂直ライン */}
                <div className="absolute left-[20px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 via-amber-500 to-green-500 opacity-30" />

                <RoadmapStep
                    number={1}
                    title="即時コストのカット (Week 1)"
                    description="サブスクの見直しや、クレジットカードの最適化で、まずは「無自覚な垂れ流し」を即座に止めます。"
                    icon={<Zap size={18} />}
                    colorClass="bg-blue-600 shadow-blue-500/40"
                />

                <RoadmapStep
                    number={2}
                    title="固定費の劇的削減 (Month 1)"
                    description="住宅ローンの借り換えやスマホ代の見直しを行い、生涯レベルで数百万〜数千万の支出を圧縮します。"
                    icon={<ShieldCheck size={18} />}
                    colorClass="bg-amber-600 shadow-amber-500/40"
                />

                <RoadmapStep
                    number={3}
                    title="未来の資産形成 (Ongoing)"
                    description="浮いた資金を新NISA等の非課税制度で運用。失った時間を「複利の力」で加速的に取り戻します。"
                    icon={<CheckCircle2 size={18} />}
                    colorClass="bg-green-600 shadow-green-500/40"
                />
            </div>

            <div className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                <p className="text-sm text-amber-400 font-bold mb-3">
                    まずは、上のリストにある「対策ボタン」から最初の一歩を踏み出しましょう。
                </p>
                <div className="flex justify-center">
                    <ArrowRight className="text-amber-500 animate-bounce" />
                </div>
            </div>
        </div>
    );
}
