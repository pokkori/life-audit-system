'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getTranslations } from '@/lib/i18n';
import { Locale } from '@/types/audit';

interface NumericInputWithSuggestionsProps {
    value: string;
    onChange: (value: string) => void;
    onEnter: () => void;
    suggestions?: number[];
    unit: string;
    placeholder?: string;
    locale?: Locale;
}

export function NumericInputWithSuggestions({
    value,
    onChange,
    onEnter,
    suggestions,
    unit,
    placeholder,
    locale = 'ja-JP',
}: NumericInputWithSuggestionsProps) {
    const [isManual, setIsManual] = useState(!suggestions || suggestions.length === 0);
    const t = getTranslations(locale);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    {isManual ? (
                        <div className="relative">
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || parseFloat(val) >= 0) {
                                        onChange(val);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e') e.preventDefault();
                                    if (e.key === 'Enter') onEnter();
                                }}
                                min="0"
                                placeholder={placeholder || t.ui.input_placeholder}
                                className="w-full px-6 py-4 bg-gray-800 text-white text-xl border-2 border-cyan-500/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all font-roboto-mono pr-16 appearance-none"
                                autoFocus
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold select-none">{unit}</span>
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-800 text-white text-xl border-2 border-cyan-500/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 font-bold appearance-none cursor-pointer hover:border-cyan-400 transition-colors shadow-inner pr-12"
                            >
                                <option value="" disabled className="bg-gray-800">{t.ui.select_placeholder}</option>
                                {suggestions?.map((val) => (
                                    <option key={val} value={val} className="bg-gray-800">
                                        {val.toLocaleString()} {unit}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                                <ChevronDown size={28} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {suggestions && suggestions.length > 0 && (
                <button
                    type="button"
                    onClick={() => setIsManual(!isManual)}
                    className="w-full text-center text-sm text-cyan-400/70 hover:text-cyan-400 transition-colors underline py-2"
                >
                    {isManual ? t.ui.select_from_list : t.ui.manual_input}
                </button>
            )}
        </div>
    );
}
