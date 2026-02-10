'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuditItemResult, Locale, Region } from '@/types/audit';
import { formatCurrency } from '@/lib/i18n';

interface AccordionCardProps {
  itemResult: AuditItemResult;
  remainingYears: number;
  locale?: Locale;
  region?: Region;
}

// 数値をハイライト表示するための関数
function highlightNumbers(text: string): React.ReactNode {
  if (!text) return text;

  // 数値パターン（カンマ区切り含む）をマッチ
  const parts = text.split(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?%?円?年?時間?倍?)/g);

  return parts.map((part, index) => {
    if (/^\d/.test(part)) {
      return (
        <span key={index} className="text-amber-300 font-bold">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function AccordionCard({ itemResult, remainingYears, locale = 'ja-JP', region = 'JP' }: AccordionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-750 transition-colors"
      >
        <p className="text-white flex-1 pr-4 text-sm">{itemResult.item.title}</p>
        <div className="text-right flex items-center gap-2 flex-shrink-0">
          <div>
            <p className="text-red-400 font-mono text-lg font-bold">
              {formatCurrency(itemResult.financialLoss, region, locale)}
            </p>
            <p className="text-xs text-gray-500">/ {remainingYears}{locale === 'en-US' ? 'years' : '年間'}</p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-gray-300 space-y-4 border-t border-gray-700 pt-4">
              {/* あなたの回答 */}
              <div className="flex items-start gap-2">
                <span className="text-gray-400 font-bold whitespace-nowrap">{locale === 'en-US' ? 'Answer:' : '回答:'}</span>
                <span className="text-white">{itemResult.item.rawValue}</span>
              </div>

              {/* 算出根拠（Reasoning）セクション - 改善版 */}
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg p-4 space-y-3 border border-gray-700">
                <h4 className="font-bold text-amber-400 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {locale === 'en-US' ? 'Calculation Basis' : '算出根拠'}
                </h4>

                {/* 計算式 - コードブロック風 */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{locale === 'en-US' ? 'Formula' : '計算式'}</p>
                  <div className="bg-[#0d1117] border border-gray-600 rounded-md p-3 font-mono text-sm text-amber-100 overflow-x-auto whitespace-pre-wrap break-all">
                    {highlightNumbers(itemResult.reasoningFormula || itemResult.calculationProcess)}
                  </div>
                </div>

                {/* 係数の説明 */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{locale === 'en-US' ? 'Reasoning' : 'なぜこの係数か'}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {itemResult.reasoningExplanation || itemResult.rationale}
                  </p>
                </div>

                {/* 最終計算結果 */}
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{locale === 'en-US' ? 'Lifetime Loss' : '生涯損失額'}</span>
                    <span className="text-red-500 font-mono font-bold text-lg">
                      {formatCurrency(itemResult.financialLoss, region, locale)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 推奨アクション */}
              <div className="bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg p-3">
                <h4 className="font-bold text-yellow-400 text-sm mb-1">{locale === 'en-US' ? 'Recommended Action' : '推奨アクション'}</h4>
                <p className="text-gray-300 text-sm">{itemResult.action}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
