'use client';

import html2canvas from 'html2canvas';

import { Locale } from '@/types/audit';
import { getTranslations } from '@/lib/i18n';

interface ShareButtonsProps {
  totalLoss: number;
  lossAnalogy: string;
  topRiskCategory: string;
  resultCardId?: string;
  locale?: Locale;
}

export function ShareButtons({
  totalLoss,
  lossAnalogy,
  topRiskCategory,
  resultCardId = 'result-card',
  locale = 'ja-JP'
}: ShareButtonsProps) {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const formattedLoss = Math.round(totalLoss).toLocaleString();
  const t = getTranslations(locale);

  // 統一シェア文言
  const shareText = t.share_message_template
    .replace('{loss}', `${t.currency_symbol}${formattedLoss}`)
    .replace('{risk}', topRiskCategory);

  // X (Twitter)
  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}&via=levona_design`;
    window.open(url, '_blank');
  };

  // LINE
  const shareOnLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Threads
  const shareOnThreads = () => {
    const textWithUrl = `${shareText}\n${pageUrl}`;
    const url = `https://threads.net/intent/post?text=${encodeURIComponent(textWithUrl)}`;
    window.open(url, '_blank');
  };

  // Instagram用 画像保存
  const saveAsImage = async () => {
    const element = document.getElementById(resultCardId);
    if (!element) {
      alert('結果カードが見つかりませんでした。');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#111827',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = 'life-audit-result.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('画像の保存に失敗しました:', error);
      alert('画像の保存に失敗しました。');
    }
  };

  return (
    <div className="space-y-4">
      {/* SNSボタングリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* X (Twitter) */}
        <button
          onClick={shareOnTwitter}
          className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-sm">X</span>
        </button>

        {/* LINE */}
        <button
          onClick={shareOnLine}
          className="flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          style={{ backgroundColor: '#06C755' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#05b04c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#06C755'}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span className="text-sm">LINE</span>
        </button>

        {/* Facebook */}
        <button
          onClick={shareOnFacebook}
          className="flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          style={{ backgroundColor: '#1877F2' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#166fe5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1877F2'}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm">Facebook</span>
        </button>

        {/* Threads */}
        <button
          onClick={shareOnThreads}
          className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.628-1.154.978-.016 1.946.09 2.9.315l.027.007c.038-.617.007-1.22-.089-1.785-.2-1.173-.704-2.06-1.456-2.563-.745-.498-1.717-.65-2.812-.439l-.376-1.96c1.528-.294 2.94-.078 4.078.626 1.14.705 1.906 1.893 2.217 3.437.122.602.166 1.27.138 2.007.442.2.856.433 1.24.698 1.62 1.12 2.583 2.804 2.708 4.738h.003c.084 1.296-.203 2.526-.853 3.657-.655 1.142-1.593 2.1-2.788 2.848-1.588 1.003-3.483 1.576-5.63 1.7l-.154.004zm-1.12-7.345c-.936.025-1.717.234-2.263.606-.577.394-.84.892-.807 1.522.032.595.322 1.087.84 1.423.56.363 1.343.539 2.198.493 1.105-.06 1.965-.463 2.558-1.2.487-.607.806-1.407.948-2.382-.9-.222-1.82-.348-2.755-.36l-.719-.102z" />
          </svg>
          <span className="text-sm">Threads</span>
        </button>

        {/* Instagram用 画像保存 */}
        <button
          onClick={saveAsImage}
          className="flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg col-span-2 sm:col-span-1"
          style={{
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="text-sm">画像保存</span>
        </button>
      </div>

      {/* 補足テキスト */}
      <p className="text-xs text-gray-500 text-center">
        ※「画像保存」でスクリーンショットを保存し、Instagramにシェアできます
      </p>
    </div>
  );
}
