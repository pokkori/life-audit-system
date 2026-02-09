'use client';

import Link from 'next/link';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 py-16 px-4 font-sans">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-3xl font-orbitron text-white tracking-widest">LEGAL INFORMATION</h1>
                    <p className="text-amber-500 font-orbitron text-sm">利用規約 / プライバシーポリシー</p>
                </header>

                <section className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 space-y-8 backdrop-blur-sm">
                    {/* 利用規約 */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-l-4 border-amber-500 pl-4">利用規約</h2>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>本システム「Life Audit System」（以下「本サービス」）をご利用いただくにあたり、以下の規約に同意したものとみなします。</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>サービスの目的</strong>: 本サービスは、ユーザーの入力に基づいた推定的な損失額を算出するものであり、将来の結果を保証するものではありません。</li>
                                <li><strong>免責事項</strong>: 本サービスの利用により生じた損害について、開発者は一切の責任を負いません。診断結果はあくまで一つの目安としてお楽しみください。</li>
                                <li><strong>著作権</strong>: 本サービスのデザインおよびプログラムの著作権は、開発者「レボーナ」に帰属します。</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* プライバシーポリシー */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-l-4 border-amber-500 pl-4">プライバシーポリシー</h2>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>本サービスは、ユーザーのプライバシー保護を最優先事項として運営しています。</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>データの保持</strong>: 本サービスで入力された診断データ（年齢や年収、回答内容など）は、サーバーには一切保存されません。ブラウザのLocalStorage機能を使用して端末内にのみ一時保存されます。</li>
                                <li><strong>クッキー（Cookie）の利用</strong>: サイトの利用状況分析や利便性向上のため、Google Analytics等のサービスを利用する場合があります。これにより、個人を特定しない情報の収集が行われることがあります。</li>
                                <li><strong>アフィリエイトリンク</strong>: 本サービスは、広告配信（アフィリエイトプログラム）に参加しています。各リンク先での商品購入やサービス登録については、各運営元の規約に従ってください。</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <footer className="text-center pt-8">
                    <Link
                        href="/"
                        className="text-amber-500 hover:text-amber-400 transition-colors duration-200 font-orbitron tracking-widest"
                    >
                        &lt; BACK TO AUDIT
                    </Link>
                </footer>
            </div>
        </div>
    );
}
