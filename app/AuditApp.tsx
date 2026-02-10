'use client';

import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuditResultReport, AuditItemInput, Locale, Region, DisplayCategory } from '@/types/audit';
import { AUDIT_QUESTIONS, Question, getQuestionsByRegion } from '@/lib/questions';
import { AuditEngine } from '@/lib/AuditEngine';
import { getNextQuestion } from '@/lib/branchingLogic';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { AuditReport } from '@/components/ui/AuditReport';
import { ScanningAnimation } from '@/components/ui/ScanningAnimation';
import { InterimReport } from '@/components/ui/InterimReport';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { getTranslations } from '@/lib/i18n';

type AnswerValue = boolean | number | (string | number)[];
type Answer = { questionId: string; value: AnswerValue; };

const STORAGE_KEY = 'life_audit_state';

function AgeInputForm({ onSubmit, locale = 'ja-JP' }: { onSubmit: (age: number) => void, locale?: Locale }) {
  const [age, setAge] = useState('28');
  const t = getTranslations(locale);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (ageNum > 0 && ageNum < 100) {
      onSubmit(ageNum);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-6 py-4 bg-gray-800 text-white border-2 border-green-500/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 text-xl font-bold appearance-none cursor-pointer hover:border-green-400 transition-colors shadow-inner"
          >
            {Array.from({ length: 85 }, (_, i) => i + 10).map(val => (
              <option key={val} value={val} className="bg-gray-800">
                {val} {locale === 'ja-JP' ? '歳' : 'y.o.'}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-green-500">
            <ChevronDown size={28} />
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-xl transition-all text-xl shadow-xl shadow-green-500/30 transform hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          {locale === 'ja-JP' ? '開始' : 'Start'}
        </button>
      </form>
    </div>
  );
}

type WizardStep = 'welcome' | 'age-input' | 'auditing' | 'interim-report' | 'result' | 'analyzing';

interface AuditAppProps {
  initialLocale?: Locale;
}

export default function AuditApp({ initialLocale = 'ja-JP' }: AuditAppProps) {
  // Initialize state with locale from props if available
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [region, setRegion] = useState<Region>(initialLocale === 'en-US' ? 'US' : 'JP');

  const [step, setStep] = useState<WizardStep>('welcome');
  const [age, setAge] = useState<number>(0);

  // Initialize activeQuestions based on the derived region
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => getQuestionsByRegion(initialLocale === 'en-US' ? 'US' : 'JP'));

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [result, setResult] = useState<AuditResultReport | null>(null);
  const [interimLoss, setInterimLoss] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRestored, setIsRestored] = useState(false);

  const t = getTranslations(locale);

  // Updated handleLanguageChange to use URL param approach ideally, 
  // but for client-side switch we keep state sync.
  const handleLanguageChange = (newLocale: Locale) => {
    const newRegion = newLocale === 'en-US' ? 'US' : 'JP';
    setLocale(newLocale);
    setRegion(newRegion);

    // Switch questions and reset
    const newQuestions = getQuestionsByRegion(newRegion);
    setActiveQuestions(newQuestions);

    // Reset process
    setStep('welcome');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setHistory([]);
    setResult(null);
    setInterimLoss(0);
    localStorage.removeItem(STORAGE_KEY);
    setIsRestored(false);

    // Update URL without reload to make it shareable? 
    // Ideally we pushState, but next/navigation router is better.
    // For now, simpler state management.
  };

  // Persistence: Load state from LocalStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.answers && state.answers.length > 0) {
          // If loaded state has different region, we might ignore answers or warn?
          // For simplicity, we trust the saved state but if we want to enforce prop locale...
          // Let's prioritize saved state if it exists.
          setIsRestored(true);
          if (state.locale) setLocale(state.locale);
          if (state.region) setRegion(state.region);
          if (state.region) {
            setActiveQuestions(getQuestionsByRegion(state.region));
          }
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  // Save state to LocalStorage
  useEffect(() => {
    if (step === 'welcome' || step === 'result') return;
    const stateToSave = {
      step,
      age,
      activeQuestions, // Saving active questions is risky if definition changes, but needed for restore
      currentQuestionIndex,
      answers,
      history,
      locale,
      region
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [step, age, activeQuestions, currentQuestionIndex, answers, history, locale, region]);

  const handleRestore = () => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      setStep(state.step);
      setAge(state.age);
      setActiveQuestions(state.activeQuestions);
      setCurrentQuestionIndex(state.currentQuestionIndex);
      setAnswers(state.answers);
      setHistory(state.history || []);
      if (state.locale) setLocale(state.locale);
      if (state.region) setRegion(state.region);
    }
    setIsRestored(false);
  };

  const handleClearRestore = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsRestored(false);
  };

  const allQuestionsMap = useMemo(() => {
    const map = new Map<string, Question>();
    AUDIT_QUESTIONS.forEach(q => {
      map.set(q.id, q);
      if (q.followUp) map.set(q.followUp.id, q.followUp);
    });
    return map;
  }, []);

  const totalQuestionsInFlow = useMemo(() => {
    let count = 0;
    // We should count based on ACTIVE questions only for progress bar consistency in current set
    activeQuestions.forEach(q => {
      count++;
      if (q.followUp) count++;
    });
    return count;
  }, [activeQuestions]);

  const calculateInterimLoss = (currentAnswers: Answer[]) => {
    const auditItems: AuditItemInput[] = [];
    currentAnswers.forEach(answer => {
      if (!activeQuestions.some(q => q.id === answer.questionId)) return;

      const question = allQuestionsMap.get(answer.questionId);
      if (!question) return;

      let baseAmountForEngine = 0;
      if (question.type === 'number') {
        baseAmountForEngine = answer.value as number;
      } else if (question.type === 'boolean' && answer.value === true) {
        baseAmountForEngine = question.baseAmount || 0;
      } else if (question.type === 'select') {
        const option = question.options?.find(o => o.value === answer.value);
        if (question.id === 'career-1a' && typeof answer.value === 'number') {
          baseAmountForEngine = answer.value;
        } else {
          baseAmountForEngine = question.baseAmount || 0;
        }
      }

      if (baseAmountForEngine > 0 || (typeof answer.value === 'boolean' && answer.value === true)) {
        auditItems.push({
          id: question.id,
          title: question.text,
          category: question.category,
          displayCategory: question.displayCategory as DisplayCategory,
          deferredMonths: 12,
          amount: baseAmountForEngine,
          rawValue: '',
          answerValueRaw: answer.value as string | number | (string | number)[] | undefined,
        });
      }
    });

    const engine = new AuditEngine({ age });
    const report = engine.generateAuditReport(auditItems);
    return report.totalFinancialLoss;
  };

  const handleAnswer = (value: AnswerValue) => {
    const currentQuestion = activeQuestions[currentQuestionIndex];
    let newAnswers: Answer[] = [];

    setAnswers(prevAnswers => {
      const existingAnswerIndex = prevAnswers.findIndex(a => a.questionId === currentQuestion.id);
      if (existingAnswerIndex !== -1) {
        newAnswers = [...prevAnswers];
        newAnswers[existingAnswerIndex] = { questionId: currentQuestion.id, value };
      } else {
        newAnswers = [...prevAnswers, { questionId: currentQuestion.id, value }];
      }
      return newAnswers;
    });

    if (!(currentQuestion.type === 'select' && currentQuestion.multiple)) {
      const calculatedNext = getNextQuestion(currentQuestion, value, activeQuestions);

      if (calculatedNext && calculatedNext.id === currentQuestion.followUp?.id) {
        const nextIndex = currentQuestionIndex + 1;
        setActiveQuestions(prev => {
          const isAlreadyThere = prev[nextIndex]?.id === calculatedNext.id;
          if (isAlreadyThere) return prev;
          return [...prev.slice(0, nextIndex), calculatedNext, ...prev.slice(nextIndex)];
        });
        setHistory(prev => [...prev, currentQuestionIndex]);
        setCurrentQuestionIndex(nextIndex);
      } else {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= activeQuestions.length) {
          setStep('analyzing');
        } else {
          const answerCount = answers.length + 1;
          if (answerCount === 20) {
            setInterimLoss(calculateInterimLoss([...answers, { questionId: currentQuestion.id, value }]));
            setStep('interim-report');
          } else {
            setHistory(prev => [...prev, currentQuestionIndex]);
            setCurrentQuestionIndex(nextIndex);
          }
        }
      }
    }
  };

  const handleNextMultiSelect = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= activeQuestions.length) {
      setStep('analyzing');
    } else {
      const answerCount = answers.length;
      if (answerCount === 20) {
        setInterimLoss(calculateInterimLoss(answers));
        setStep('interim-report');
      } else {
        setHistory(prev => [...prev, currentQuestionIndex]);
        setCurrentQuestionIndex(nextIndex);
      }
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentQuestionIndex(lastIndex);
  };

  const handleContinueAudit = () => {
    setStep('auditing');
    setHistory(prev => [...prev, currentQuestionIndex]);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const submitAudit = async (currentAnswers: Answer[]) => {
    setIsLoading(true);
    setError(null);
    const auditItems: AuditItemInput[] = [];
    currentAnswers.forEach(answer => {
      if (!activeQuestions.some(q => q.id === answer.questionId)) return;

      const question = allQuestionsMap.get(answer.questionId);
      if (!question) return;

      let rawValue = '';
      if (typeof answer.value === 'number') {
        rawValue = `${answer.value.toLocaleString()} ${question.meta?.unit || (locale === 'en-US' ? 'USD' : '円')}`;
      } else if (typeof answer.value === 'boolean') {
        rawValue = answer.value ? (locale === 'en-US' ? 'Yes' : 'はい') : (locale === 'en-US' ? 'No' : 'いいえ');
      } else if (Array.isArray(answer.value)) {
        const selectedLabels = question.options
          ?.filter(opt => (answer.value as (string | number)[]).includes(opt.value))
          .map(opt => opt.label)
          .join(', ');
        rawValue = selectedLabels || '';
      }

      if (answer.value !== false) {
        let baseAmountForEngine = 0;
        if (question.type === 'number') {
          baseAmountForEngine = answer.value as number;
        } else if (question.type === 'boolean' && answer.value === true) {
          baseAmountForEngine = question.baseAmount || 0;
        } else if (question.type === 'select') {
          if (question.id === 'career-1a' && typeof answer.value === 'number') {
            baseAmountForEngine = answer.value;
          } else {
            baseAmountForEngine = question.baseAmount || 0;
          }
        }

        if (baseAmountForEngine > 0 || (typeof answer.value === 'boolean' && answer.value === true)) {
          auditItems.push({
            id: question.id,
            title: question.text,
            category: question.category,
            displayCategory: question.displayCategory as DisplayCategory,
            deferredMonths: 12,
            amount: baseAmountForEngine,
            rawValue: rawValue,
            answerValueRaw: answer.value as string | number | (string | number)[] | undefined,
          });
        }
      }
    });

    try {
      const engine = new AuditEngine({ age });
      const data: AuditResultReport = engine.generateAuditReport(auditItems);
      setResult(data);
      setStep('result');
      localStorage.removeItem(STORAGE_KEY);
    } catch (e: any) {
      console.error('Audit calculation error:', e);
      setError(e.message || '診断に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white relative">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => handleLanguageChange('ja-JP')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${locale === 'ja-JP' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          JP
        </button>
        <button
          onClick={() => handleLanguageChange('en-US')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${locale === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          EN
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-12 tracking-tight leading-relaxed">
              {locale === 'en-US'
                ? <>{t.title}<br /><span className="text-xl font-normal text-gray-400 mt-2 block">{t.subtitle}</span></>
                : <>{t.title}<br className="md:hidden" />{t.subtitle}</>
              }
            </h1>

            {isRestored ? (
              <div className="bg-gray-800/50 p-6 rounded-xl border border-green-500/30 mb-8 max-w-sm mx-auto">
                <p className="text-green-400 mb-4 text-sm">
                  {locale === 'en-US' ? 'Previous session found. Resume?' : '前回の診断データが見つかりました。<br />続きから開始しますか？'}
                </p>
                <div className="flex gap-4 justify-center">
                  <button onClick={handleRestore} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm">
                    {locale === 'en-US' ? 'Resume' : '続きから再開'}
                  </button>
                  <button onClick={handleClearRestore} className="text-gray-400 hover:text-white transition-colors text-sm underline">
                    {locale === 'en-US' ? 'Start New' : '新しく始める'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setStep('age-input')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-lg transition-colors text-2xl shadow-lg shadow-green-500/20">
                {t.start_diagnosis}
              </button>
            )}
          </motion.div>
        )}

        {step === 'age-input' && (
          <motion.div key="age-input" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-full max-w-md">
            <h3 className="text-xl md:text-2xl text-white mb-6 text-center font-orbitron">
              {locale === 'en-US' ? 'First, tell us your age.' : 'まず、あなたの年齢を教えてください。'}
            </h3>
            <AgeInputForm onSubmit={(inputAge) => { setAge(inputAge); setStep('auditing'); }} locale={locale} />
          </motion.div>
        )}

        {step === 'auditing' && (
          <motion.div key="auditing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl">
            <div className="mb-4 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                disabled={history.length === 0}
                className={`p-2 rounded-full border border-gray-700 transition-colors ${history.length === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-800'}`}
              >
                <ChevronLeft size={20} className="text-amber-500" />
              </motion.button>
              <div className="flex-1">
                <p className="text-center font-orbitron text-amber-500 mb-2">
                  Question {currentQuestionIndex + 1}
                </p>
                <ProgressBar value={((currentQuestionIndex + 1) / totalQuestionsInFlow) * 100} />
              </div>
            </div>
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {activeQuestions[currentQuestionIndex] && (
                  <QuestionCard
                    key={activeQuestions[currentQuestionIndex].id}
                    question={activeQuestions[currentQuestionIndex]}
                    onAnswer={(val) => handleAnswer(val as AnswerValue)}
                    onNextMultiSelect={handleNextMultiSelect}
                    initialValue={
                      !(activeQuestions[currentQuestionIndex].type === 'select' && activeQuestions[currentQuestionIndex].multiple)
                        ? answers.find(a => a.questionId === activeQuestions[currentQuestionIndex].id)?.value as string | number | boolean
                        : undefined
                    }
                    initialSelectedMultiValues={
                      (Array.isArray(answers.find(a => a.questionId === activeQuestions[currentQuestionIndex].id)?.value)
                        ? (answers.find(a => a.questionId === activeQuestions[currentQuestionIndex].id)?.value as (string | number)[])
                        : [])
                    } />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 'interim-report' && (
          <motion.div key="interim-report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl">
            <InterimReport
              currentLoss={interimLoss}
              questionCount={answers.length}
              onContinue={handleContinueAudit}
            />
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl">
            <ScanningAnimation onComplete={() => submitAudit(answers)} />
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl">
            <AuditReport report={result} age={age} locale={locale} region={region} />
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </main>
  );
}
