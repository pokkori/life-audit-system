"use client";

import { Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
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
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 mb-1">ご感想をお聞かせください（30秒）</p>
          <a href="mailto:support@pokkorilab.com?subject=%E3%81%94%E6%84%9F%E6%83%B3&body=%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E5%90%8D%EF%BC%9A%0A%E6%84%9F%E6%83%B3%EF%BC%9A" className="text-xs text-blue-500 underline hover:text-blue-700">感想を送る →</a>
        </div>
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
