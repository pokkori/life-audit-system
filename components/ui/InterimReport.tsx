'use client';

import { motion } from 'framer-motion';
import { AuditResultReport } from '@/types/audit';

interface InterimReportProps {
    currentLoss: number;
    questionCount: number;
    onContinue: () => void;
}

export function InterimReport({ currentLoss, questionCount, onContinue }: InterimReportProps) {
    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 shadow-2xl border border-gray-700 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 pointer-events-none" />

            <div className="relative z-10">
                <div className="inline-block p-1 px-3 mb-6 rounded-full bg-amber-500/20 border border-amber-500/40">
                    <p className="text-xs text-amber-500 font-bold tracking-[0.2em] font-orbitron uppercase">Interim Audit Report</p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-6 font-orbitron">
                    {questionCount}問目までの診断結果
                </h2>

                <div className="mb-8">
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest font-orbitron">Current Estimated Loss</p>
                    <div className="flex justify-center items-center gap-1">
                        <span className="text-2xl font-bold text-red-500 font-roboto-mono">¥</span>
                        <p className="text-4xl md:text-6xl font-black text-red-600 font-roboto-mono text-neon-blood animate-pulse">
                            {Math.round(currentLoss).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
                    <p className="text-gray-300 leading-relaxed italic">
                        「今のままだと、あなたは生涯でこれだけの金額をドブに捨て続けていることになります。<br />
                        残りの診断を完了して、損失を食い止めるための具体的な対策を確認しましょう。」
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onContinue}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all font-orbitron tracking-widest"
                >
                    診断を続行する
                </motion.button>
            </div>
        </div>
    );
}
