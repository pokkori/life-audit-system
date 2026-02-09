'use client';

import { useState, useEffect } from 'react';
import { Question, SelectOption } from '@/lib/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericInputWithSuggestions } from './NumericInputWithSuggestions';

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: string | number | boolean | (string | number)[]) => void;
  onNextMultiSelect?: () => void;
  initialSelectedMultiValues?: (string | number)[];
  initialValue?: string | number | boolean;
}

export function QuestionCard({
  question,
  onAnswer,
  onNextMultiSelect,
  initialSelectedMultiValues = [],
  initialValue,
}: QuestionCardProps) {
  const [inputValue, setInputValue] = useState<string>(initialValue !== undefined ? initialValue.toString() : '');
  const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>(initialSelectedMultiValues);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setInputValue(initialValue !== undefined ? initialValue.toString() : '');
    setSelectedOptions(initialSelectedMultiValues);
    setIsValid(false);
  }, [question.id, initialSelectedMultiValues, initialValue]);

  useEffect(() => {
    if (question.type === 'number') {
      const num = parseFloat(inputValue);
      setIsValid(!isNaN(num) && num >= 0);
    } else if (question.type === 'select' && question.multiple) {
      setIsValid(selectedOptions.length > 0);
    }
  }, [inputValue, selectedOptions, question.type, question.multiple]);

  const handleNumberSubmit = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num >= 0) {
      onAnswer(num);
    }
  };

  const handleSelectOption = (option: SelectOption) => {
    if (question.multiple) {
      setSelectedOptions(prev => {
        if (prev.includes(option.value)) {
          return prev.filter(v => v !== option.value);
        } else {
          return [...prev, option.value];
        }
      });
    } else {
      onAnswer(option.value);
    }
  };

  const handleMultipleSubmit = () => {
    if (selectedOptions.length > 0) {
      onAnswer(selectedOptions);
      if (onNextMultiSelect) {
        onNextMultiSelect();
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-8 text-center font-bold font-orbitron tracking-wider">
              {question.text}
            </h3>

            {question.type === 'boolean' && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => onAnswer(true)}
                  className="flex-1 max-w-xs bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105"
                >
                  <span className="text-xl font-orbitron">YES</span>
                </button>
                <button
                  onClick={() => onAnswer(false)}
                  className="flex-1 max-w-xs bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(75,85,99,0.4)] hover:shadow-[0_0_30px_rgba(75,85,99,0.6)] hover:scale-105"
                >
                  <span className="text-xl font-orbitron">NO</span>
                </button>
              </div>
            )}

            {question.type === 'number' && (
              <div className="space-y-4">
                <NumericInputWithSuggestions
                  value={inputValue}
                  onChange={setInputValue}
                  onEnter={handleNumberSubmit}
                  unit={question.meta?.unit || '円'}
                  suggestions={question.meta?.suggestions}
                />
                <button
                  onClick={handleNumberSubmit}
                  disabled={!isValid}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,200,255,0.4)] hover:shadow-[0_0_30px_rgba(0,200,255,0.6)] hover:scale-105"
                >
                  <span className="font-orbitron">NEXT</span>
                </button>
              </div>
            )}

            {question.type === 'select' && question.options && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {question.options.map(option => {
                    const isSelected = question.multiple
                      ? selectedOptions.includes(option.value)
                      : false;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelectOption(option)}
                        className={`
                          px-6 py-4 rounded-xl font-medium text-left transition-all duration-200
                          ${isSelected
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(0,200,255,0.4)] scale-[1.02]'
                            : 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-600 hover:border-cyan-500'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {question.multiple && (
                            <span
                              className={`
                                w-6 h-6 rounded border-2 flex items-center justify-center
                                ${isSelected ? 'bg-white border-white' : 'border-gray-500'}
                              `}
                            >
                              {isSelected && (
                                <svg
                                  className="w-4 h-4 text-cyan-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {question.multiple && (
                  <button
                    onClick={handleMultipleSubmit}
                    disabled={!isValid}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,200,255,0.4)] hover:shadow-[0_0_30px_rgba(0,200,255,0.6)] hover:scale-105 font-orbitron tracking-widest"
                  >
                    NEXT
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
