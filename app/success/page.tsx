"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();

  useEffect(() => {
    // PAY.JP: cookie is set directly in checkout response, no verify step needed
    // Stripe legacy: kept for backward compatibility
    const sessionId = params.get("session_id");
    if (sessionId) {
      fetch(`/api/stripe/verify?session_id=${sessionId}`);
    }
  }, [params]);

  return (
    <div className="text-center space-y-6 max-w-md mx-auto p-6">
      <div className="text-6xl">🎉</div>
      <h1 className="text-2xl font-bold text-green-400">ご購入ありがとうございます！</h1>
      <p className="text-gray-400">
        プレミアムレポートのロックが解除されました。<br />
        詳細な改善シミュレーションをご覧ください。
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors"
      >
        診断を始める
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <Suspense fallback={<div className="text-gray-400">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
