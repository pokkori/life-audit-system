'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface RecoverySimulatorProps {
    totalLoss: number;
    maxRecoverable: number;
}

export function RecoverySimulator({ totalLoss, maxRecoverable }: RecoverySimulatorProps) {
    const [executionRate, setExecutionRate] = useState(30);

    const recoveredAmount = useMemo(() => {
        return Math.round(maxRecoverable * (executionRate / 100));
    }, [maxRecoverable, executionRate]);

    const remainingLoss = useMemo(() => {
        return Math.round(totalLoss - recoveredAmount);
    }, [totalLoss, recoveredAmount]);

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 via-blue-900/20 to-black rounded-2xl p-6 border border-blue-500/30 shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v18m9-9H3" stroke="white" strokeWidth="2" />
                </svg>
            </div>

            <h3 className="text-lg font-bold text-blue-300 mb-6 font-orbitron tracking-wide flex items-center gap-2">
                <span className="text-2xl">💡</span>
                もし今日から対策を始めたら？
            </h3>

            <div className="space-y-8">
                {/* 数値表示 */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-950/30 p-4 rounded-xl border border-green-500/30 text-center">
                        <p className="text-[10px] text-green-400 font-bold mb-1 uppercase tracking-tighter">Recovered Amount</p>
                        <p className="text-xl md:text-2xl font-black text-green-400 font-roboto-mono">
                            <span className="text-sm mr-1">¥</span>
                            {recoveredAmount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-green-500/70 mt-1">生涯で取り戻せる金額</p>
                    </div>
                    <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/30 text-center">
                        <p className="text-[10px] text-red-400 font-bold mb-1 uppercase tracking-tighter">Residual Loss</p>
                        <p className="text-xl md:text-2xl font-black text-gray-300 font-roboto-mono">
                            <span className="text-sm mr-1">¥</span>
                            {remainingLoss.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-red-500/70 mt-1">残ってしまう生涯損失</p>
                    </div>
                </div>

                {/* スライダー */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-sm text-blue-400 font-bold">あなたの改善・実行力: <span className="text-2xl text-white ml-2">{executionRate}%</span></label>
                        <span className="text-[10px] text-blue-500/60 font-orbitron">Performance Slider</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={executionRate}
                            onChange={(e) => setExecutionRate(parseInt(e.target.value))}
                            className="w-full h-2 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div
                            className="absolute -top-8 left-0 text-[10px] text-blue-400/50 pointer-events-none"
                            style={{ left: `${executionRate}%`, transform: 'translateX(-50%)' }}
                        >
                            {executionRate === 100 ? 'OPTIMAL' : ''}
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-orbitron uppercase tracking-widest">
                        <span>Lethargic</span>
                        <span>Hyper-Efficient</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-blue-500/20">
                    <p className="text-xs text-blue-200/70 leading-relaxed italic text-center">
                        「行動一つで、これだけの富を未来から取り戻すことが可能です。<br />まずは10%の改善から始めてみませんか？」
                    </p>
                </div>
            </div>
        </div>
    );
}
