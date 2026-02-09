'use client';

import Link from 'next/link';

export function CreatorProfile() {
    return (
        <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="max-w-2xl mx-auto text-center">
                <div className="mb-4">
                    <div className="inline-block">
                        <h3 className="text-sm font-orbitron text-gray-500 tracking-widest uppercase">
                            CREATED BY
                        </h3>
                        <a
                            href="https://x.com/levona_design"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-bold text-white mt-1 hover:text-amber-400 transition-colors duration-200 font-orbitron block"
                        >
                            レボーナ@ボタン設置係
                        </a>
                    </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-orbitron">
                    このシステムは、レボーナの独断と偏見、そして1ナノグラムの良心によって爆誕しました。<br />
                    あなたの「明日から本気出す」というファンタジーが生み出した、無慈悲な損失額という名の現実をデバッグします。
                </p>
                <div className="mt-8 flex justify-center gap-6">
                    <Link
                        href="/legal"
                        className="text-[10px] text-gray-600 hover:text-amber-500 transition-colors duration-200 font-orbitron tracking-widest"
                    >
                        PRIVACY & TERMS
                    </Link>
                </div>
            </div>
        </div>
    );
}
