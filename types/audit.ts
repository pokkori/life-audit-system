// Locale & Region definitions
export type Locale = 'ja-JP' | 'en-US';
export type Region = 'JP' | 'US';

// DisplayCategory - 4つの診断カテゴリ
export type DisplayCategory = '資産診断' | '健康診断' | 'キャリア診断' | '時間・環境診断';

// AuditCategory - 内部カテゴリ
export enum AuditCategory {
  INVESTMENT = 'INVESTMENT',
  SAVINGS = 'SAVINGS',
  HEALTH = 'HEALTH',
  CAREER = 'CAREER',
  TIME = 'TIME',
  ENVIRONMENT = 'ENVIRONMENT',
  RELATIONSHIP = 'RELATIONSHIP',
  HOUSEHOLD = 'HOUSEHOLD',
  LEARNING = 'LEARNING',
}

// AuditRank - 診断ランク
export type AuditRank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface RankInfo {
  rank: AuditRank;
  title: string;
  color: string;
  glowColor: string;
  description: string;
  gradient: string;
}

export interface AuditLog {
  timestamp: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  module: string;
}

export interface AuditItemInput {
  id: string;
  title: string;
  category: AuditCategory;
  displayCategory: DisplayCategory;
  deferredMonths: number;
  amount: number;
  rawValue: string;
  answerValueRaw?: string | number | (string | number)[]; // Stores the original raw answer(s)
}

export interface AuditItemResult {
  item: AuditItemInput;
  financialLoss: number;
  timeLossHours: number;
  logs: AuditLog[];
  calculationProcess: string;
  rationale: string;
  reasoningFormula: string;
  reasoningExplanation: string;
  action: string;
}

export interface RecommendedPatch {
  category: AuditCategory;
  title: string;
  copy: string;
  link: string;
  icon?: string;
  potentialRecovery: number;
  actionLabel?: string; // e.g., "今すぐ予約する"
  actionUrl?: string;   // e.g., "https://..."
}

export interface LossAnalogy {
  icon: string;
  text: string;
  value: number;
}

export interface CategoryBreakdown {
  category: DisplayCategory;
  loss: number;
  percentage: number;
  icon: string;
}

export interface AuditResultReport {
  totalFinancialLoss: number;
  totalTimeLossHours: number;
  breakdown: AuditItemResult[];
  summaryLogs: AuditLog[];
  lossAnalogy: string;
  lossAnalogies: LossAnalogy[];
  recommendedPatches: RecommendedPatch[];
  averageLossComparison: number;
  rank: RankInfo;
  totalDiagnosedUsers: number;
  remainingYears: number;
  categoryBreakdown: CategoryBreakdown[];
  maxRecoverableLoss: number; // 理論上の最大回復可能額
}

export interface UserProfile {
  hourWage?: number;
  age?: number;
  annualIncome?: number;
  locale?: Locale;
  region?: Region;
}
