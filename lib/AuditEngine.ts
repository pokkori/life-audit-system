import {
  AuditCategory,
  AuditItemInput,
  AuditItemResult,
  AuditResultReport,
  UserProfile,
  RecommendedPatch,
  DisplayCategory,
  RankInfo,
  LossAnalogy,
  CategoryBreakdown,
  Region,
  Locale,
} from '@/types/audit';
import { AUDIT_QUESTIONS, Question, findQuestionById } from './questions';

// 定数
export const MENTAL_COST_MULTIPLIER = 1.25;
export const LIFETIME_AGE = 85;
const DEFAULT_ANNUAL_INTEREST_RATE = 0.05;
const DEFAULT_HOUR_WAGE = 2000;
const NISA_TAX_BENEFIT = 0.20315;

// 係数の論理的説明
// 係数の論理的説明 (JP)
const REASONING_EXPLANATIONS_JP = {
  mentalCost: '精神的コスト係数1.25は、金銭的損失に加えて「やらなかった」という後悔や不安が心理的負担となることを数値化したものです（プロスペクト理論に基づく）。',
  interestRate: '年利5%は全世界株式インデックス(MSCI ACWI等)の1980年以降の長期平均リターンに基づいています。',
  nisaBenefit: '新NISAでは運用益が非課税となり、通常かかる20.315%の税金を節約できます。',
  healthTime: '年間50時間は、健康問題による生産性低下・通院時間・体調不良による休息時間を保守的に見積もった値です。',
  careerRisk: 'リスク係数0.2は、キャリア機会を逃す確率(20%)を表します。基準年収50万円は、転職・昇進による平均的な年収アップ額です。',
};

// Reasoning Explanations (US)
const REASONING_EXPLANATIONS_US = {
  mentalCost: 'Mental Cost Factor 1.25 quantifies the psychological burden of regret and anxiety from inaction (based on Prospect Theory).',
  interestRate: '5% annual return is based on long-term average returns of global stock indices (like MSCI ACWI) since 1980.',
  nisaBenefit: 'Tax-advantaged accounts (Roth IRA/401k) allow tax-free growth, saving capital gains taxes.',
  healthTime: '50 hours/year is a conservative estimate of productivity loss, medical visits, and recovery time due to health issues.',
  careerRisk: 'Risk Factor 0.2 represents a 20% probability of missing career opportunities. Base $5k represents average salary bump from promotion/switch.',
};

// ランク判定 (JP)
const RANK_CONFIG_JP: RankInfo[] = [
  { rank: 'S', title: '資産の脆弱性が深刻', color: '#FF0000', glowColor: '#FF000080', description: '今すぐ対策が必要です', gradient: 'from-red-900 via-red-600 to-orange-500' },
  { rank: 'A', title: '複数の改善ポイント有', color: '#FF6600', glowColor: '#FF660080', description: '優先順位をつけて対策しましょう', gradient: 'from-orange-900 via-orange-600 to-yellow-500' },
  { rank: 'B', title: '一般的な先延ばし傾向', color: '#FFCC00', glowColor: '#FFCC0080', description: '小さな改善から始めましょう', gradient: 'from-yellow-900 via-yellow-600 to-lime-500' },
  { rank: 'C', title: '軽度の改善余地あり', color: '#00CC66', glowColor: '#00CC6680', description: '良好な状態です', gradient: 'from-green-900 via-green-600 to-teal-500' },
  { rank: 'D', title: '優秀な自己管理', color: '#0099FF', glowColor: '#0099FF80', description: '素晴らしい習慣です', gradient: 'from-blue-900 via-blue-600 to-cyan-500' },
];

// Rank Config (US)
const RANK_CONFIG_US: RankInfo[] = [
  { rank: 'S', title: 'Critical Financial Vulnerability', color: '#FF0000', glowColor: '#FF000080', description: 'Immediate action required to stop wealth leak.', gradient: 'from-red-900 via-red-600 to-orange-500' },
  { rank: 'A', title: 'Multiple Risk Factors Detected', color: '#FF6600', glowColor: '#FF660080', description: 'Prioritize high-impact fixes.', gradient: 'from-orange-900 via-orange-600 to-yellow-500' },
  { rank: 'B', title: 'Procrastination Tendencies', color: '#FFCC00', glowColor: '#FFCC0080', description: 'Start with small improvements.', gradient: 'from-yellow-900 via-yellow-600 to-lime-500' },
  { rank: 'C', title: 'Minor Optimization Needed', color: '#00CC66', glowColor: '#00CC6680', description: 'You are in good shape.', gradient: 'from-green-900 via-green-600 to-teal-500' },
  { rank: 'D', title: 'Excellent Self-Management', color: '#0099FF', glowColor: '#0099FF80', description: 'Keep up the great habits.', gradient: 'from-blue-900 via-blue-600 to-cyan-500' },
];

export interface AffiliateInfo {
  title: string;
  link: string;
  icon: string;
  actionLabel: string;
}



// リージョン別アフィリエイトリンク
export const REGIONAL_AFFILIATE_LINKS: Record<Region, Partial<Record<AuditCategory, AffiliateInfo>>> = {
  JP: {
    [AuditCategory.INVESTMENT]: { title: 'DMM FXで資産運用を開始', link: 'https://px.a8.net/svt/ejp?a8mat=4AX74G+4ASQ2A+1WP2+6CHB7', icon: '📈', actionLabel: '無料口座開設(PR)' },
    [AuditCategory.SAVINGS]: { title: '住宅ローン借り換えで固定費を削減', link: 'https://mogecheck.jp/', icon: '🏠', actionLabel: '無料シミュレーション' },
    [AuditCategory.HEALTH]: { title: 'パーソナルジムで健康寿命を延ばす', link: 'https://www.rizap.jp/', icon: '🏃', actionLabel: '無料カウンセリング' },
    [AuditCategory.CAREER]: { title: 'A8.netで副業を開始', link: 'https://px.a8.net/svt/ejp?a8mat=4AX74G+4A7AGI+0K+ZTNGZ', icon: '💼', actionLabel: '無料会員登録(PR)' },
    [AuditCategory.TIME]: { title: '楽天市場で時短家電を探す', link: 'https://rpx.a8.net/svt/ejp?a8mat=4AX74G+4BE5O2+2HOM+6GRMR&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26020977247_4AX74G_4BE5O2_2HOM_6GRMR%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F', icon: '🛍️', actionLabel: '人気ランキングを見る' },
    [AuditCategory.ENVIRONMENT]: { title: '不用品買取で居住環境を整える', link: 'https://www.treasure-f.com/', icon: '📦', actionLabel: '査定を依頼する' },
    [AuditCategory.LEARNING]: { title: '自分だけのドメインを取得', link: 'https://px.a8.net/svt/ejp?a8mat=4AX74G+4BZL9U+50+2HE0RM', icon: '🌐', actionLabel: 'お名前.comで検索' },
    [AuditCategory.RELATIONSHIP]: { title: '専門家への相談で悩みを解決', link: 'https://menta.work/', icon: '🤝', actionLabel: '相談相手を探す' },
    [AuditCategory.HOUSEHOLD]: { title: '家事代行で心にゆとりを', link: 'https://casy.co.jp/', icon: '🧹', actionLabel: '初回の予約をする' },
  },
  US: {
    [AuditCategory.INVESTMENT]: { title: 'Start investing with a Brokerage Account', link: 'https://robinhood.com/', icon: '📈', actionLabel: 'Open Account' },
    [AuditCategory.SAVINGS]: { title: 'Reduce your interest with Refinance', link: 'https://www.sofi.com/', icon: '🏠', actionLabel: 'Check Rates' },
    [AuditCategory.HEALTH]: { title: 'Get a personalized health checkup', link: 'https://www.forward.com/', icon: '🏃', actionLabel: 'Learn More' },
    [AuditCategory.CAREER]: { title: 'Maximize your income with Career Coach', link: 'https://www.betterup.com/', icon: '💼', actionLabel: 'Find Coach' },
    [AuditCategory.TIME]: { title: 'Save time with Smart Home devices', link: 'https://www.amazon.com/', icon: '⏰', actionLabel: 'Shop Now' },
    [AuditCategory.LEARNING]: { title: 'Master high-demand skills online', link: 'https://www.coursera.org/', icon: '📚', actionLabel: 'Browse Courses' },
    [AuditCategory.ENVIRONMENT]: { title: 'Declutter and sell your items', link: 'https://www.ebay.com/', icon: '📦', actionLabel: 'Start Selling' },
  }
};

// デフォルトのアフィリエイトリンク
export const DEFAULT_AFFILIATE: AffiliateInfo = {
  title: 'Better habits, better life',
  link: 'https://www.amazon.com/',
  icon: '✨',
  actionLabel: 'Learn More'
};

// カテゴリアイコン
const CATEGORY_ICONS: Record<string, string> = {
  '資産診断': '💎',
  '健康診断': '❤️',
  'キャリア診断': '🚀',
  '時間・環境診断': '⏱️',
  'Financial Diagnosis': '💎',
  'Health Diagnosis': '❤️',
  'Career Diagnosis': '🚀',
  'Time & Environment Diagnosis': '⏱️',
};

/**
 * 年齢のバリデーション（NaN防止）
 */
function validateAge(age: number | undefined): number {
  if (age === undefined || age === null || isNaN(age)) {
    return 30;
  }
  const validAge = Math.floor(age);
  if (validAge < 1 || validAge > 120) {
    return 30;
  }
  return validAge;
}

/**
 * 時給のバリデーション
 */
function validateHourWage(hourWage: number | undefined): number {
  if (hourWage === undefined || hourWage === null || isNaN(hourWage)) {
    return DEFAULT_HOUR_WAGE;
  }
  if (hourWage < 0 || hourWage > 100000) {
    return DEFAULT_HOUR_WAGE;
  }
  return Math.floor(hourWage);
}

/**
 * 数値の安全な変換
 */
function safeNumber(value: any, defaultValue: number = 0): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }
  return num;
}

/**
 * ランク判定
 */
/**
 * ランク判定
 */
function calculateRank(totalLoss: number, region: Region = 'JP'): RankInfo {
  const config = region === 'US' ? RANK_CONFIG_US : RANK_CONFIG_JP;

  if (region === 'US') {
    if (totalLoss >= 500000) return config[0]; // S
    if (totalLoss >= 300000) return config[1]; // A
    if (totalLoss >= 100000) return config[2]; // B
    if (totalLoss >= 50000) return config[3];  // C
    return config[4]; // D
  } else {
    if (totalLoss >= 50000000) return config[0]; // S
    if (totalLoss >= 30000000) return config[1]; // A
    if (totalLoss >= 10000000) return config[2]; // B
    if (totalLoss >= 5000000) return config[3];  // C
    return config[4]; // D
  }
}

export class AuditEngine {
  private readonly annualRate: number;
  private readonly hourWage: number;
  private readonly remainingYears: number;
  private readonly validatedAge: number;
  private readonly region: Region;
  private readonly locale: Locale;

  constructor(profile: UserProfile = {}) {
    this.hourWage = validateHourWage(profile.hourWage);
    this.validatedAge = validateAge(profile.age);
    this.remainingYears = Math.max(1, LIFETIME_AGE - this.validatedAge);
    this.annualRate = DEFAULT_ANNUAL_INTEREST_RATE;
    this.region = profile.region || 'JP';
    this.locale = profile.locale || 'ja-JP';
  }

  private get reasoningExplanations() {
    return this.region === 'US' ? REASONING_EXPLANATIONS_US : REASONING_EXPLANATIONS_JP;
  }

  public generateAuditReport(items: AuditItemInput[]): AuditResultReport {
    const breakdown = items.map((item) => this.calculateItemLoss(item, items));
    const totalFinancialLoss = breakdown.reduce((sum, result) => sum + safeNumber(result.financialLoss), 0);
    const lossAnalogies = this.generateLossAnalogies(totalFinancialLoss);
    const lossAnalogy = lossAnalogies[0]?.text || '';
    const recommendedPatches = this.generateRecommendedPatches(breakdown);
    const rank = calculateRank(totalFinancialLoss, this.region);
    const categoryBreakdown = this.generateCategoryBreakdown(breakdown, totalFinancialLoss);
    const maxRecoverableLoss = safeNumber(totalFinancialLoss * 0.82); // 理論上の最大回復率を82%に設定

    return {
      totalFinancialLoss: safeNumber(totalFinancialLoss),
      totalTimeLossHours: safeNumber(totalFinancialLoss / this.hourWage),
      breakdown,
      summaryLogs: [],
      lossAnalogy,
      lossAnalogies,
      recommendedPatches,
      remainingYears: this.remainingYears,
      averageLossComparison: 0,
      rank,
      totalDiagnosedUsers: 0,
      categoryBreakdown,
      maxRecoverableLoss,
    };
  }

  private calculateItemLoss(item: AuditItemInput, allItems: AuditItemInput[]): AuditItemResult {
    const question = findQuestionById(item.id);
    if (!question) {
      return {
        item,
        financialLoss: 0,
        timeLossHours: 0,
        logs: [{ timestamp: new Date().toISOString(), level: 'WARNING', message: `Unknown question ID: ${item.id}`, module: 'AuditEngine' }],
        calculationProcess: '質問データが見つかりません', // Localize this later?
        rationale: 'N/A',
        reasoningFormula: 'N/A',
        reasoningExplanation: 'N/A',
        action: 'N/A',
      };
    }

    let calculatedBaseLoss = item.amount; // item.amount is now the base amount (e.g., question.baseAmount)
    let currentItemLossMultiplier = 1; // Multiplier derived from selected options

    // Determine the multiplier from question options based on raw answer(s)
    // Determine the multiplier from question options based on raw answer(s)
    if (item.id === 'career-1a') {
      // career-1a is a special case:
      // 1. It is a 'select' type now, but the value represents the Amount (Man-yen), not a multiplier.
      // 2. It is a follow-up, so it must inherit the multiplier from the parent (career-1).

      // Handle Amount: Convert Man-yen (e.g. 50) to Yen (500,000)
      const rawVal = Array.isArray(item.answerValueRaw) ? item.answerValueRaw[0] : item.answerValueRaw;
      calculatedBaseLoss = safeNumber(rawVal) * 10000;

      // Handle Multiplier: Force look up from parent (career-1)
      const parentQuestion = AUDIT_QUESTIONS.find(q => q.followUp?.id === question.id);
      if (parentQuestion) {
        const parentItem = allItems.find(i => i.id === parentQuestion.id);
        if (parentItem) {
          currentItemLossMultiplier = this.getLossMultiplier(parentQuestion, parentItem);
        }
      }
    } else if (question.type === 'select') {
      currentItemLossMultiplier = this.getLossMultiplier(question, item);
    } else {
      // For follow-up questions (number/boolean), check if there is a parent question with a multiplier
      const parentQuestion = AUDIT_QUESTIONS.find(q => q.followUp?.id === question.id);
      if (parentQuestion) {
        const parentItem = allItems.find(i => i.id === parentQuestion.id);
        if (parentItem) {
          currentItemLossMultiplier = this.getLossMultiplier(parentQuestion, parentItem);
        }
      }
    }
    // For boolean and number types, item.amount is already the value or baseAmount,
    // and its inherent 'multiplier' is often 1 or handled directly in their respective calculate*Loss functions.

    let process = '';
    let reasoningFormula = '';
    let reasoningExplanation = '';

    // Helper for US localized explanations
    const explanations = this.reasoningExplanations;

    switch (item.category) {
      case AuditCategory.INVESTMENT:
        // For investment, item.amount is monthly investment, currentItemLossMultiplier applies to option choices
        ({ loss: calculatedBaseLoss, process, reasoningFormula, reasoningExplanation } = this.calculateInvestmentLoss(item.amount, currentItemLossMultiplier));
        break;
      case AuditCategory.HEALTH:
        if (question.type === 'select') {
          // Health select questions like dental checkup (health-1) or exercise habit (health-3)
          // item.amount is baseAmount, currentItemLossMultiplier is from options
          ({ loss: calculatedBaseLoss, process, reasoningFormula, reasoningExplanation } = this.calculateHealthSelectLoss(item.amount, currentItemLossMultiplier));
        } else if (question.type === 'number' && item.id === 'health-2a') {
          // Specific sleep loss calculation for health-2a
          // item.amount is days per week (from question input)
          ({ loss: calculatedBaseLoss, process, reasoningFormula, reasoningExplanation } = this.calculateSleepLoss(item.amount, this.validatedAge));
        } else {
          // Other boolean/number health questions, item.amount is direct loss or baseAmount.
          calculatedBaseLoss = item.amount * currentItemLossMultiplier; // Apply multiplier for baseAmount if it exists
          process = `${item.amount.toLocaleString()}円 × 係数${currentItemLossMultiplier}`;
          reasoningFormula = `治療費期待値 ${item.amount.toLocaleString()}円 × リスク係数${currentItemLossMultiplier}`;
          reasoningExplanation = `${explanations.mentalCost} 放置による重症化リスクを加味した期待値です。`;
        }
        break;
      case AuditCategory.CAREER:
      case AuditCategory.LEARNING:
        // Assuming career and learning amounts are base amounts that need multiplier.
        ({ loss: calculatedBaseLoss, process, reasoningFormula, reasoningExplanation } = this.calculateCareerLoss(item.amount, currentItemLossMultiplier));
        break;
      case AuditCategory.TIME:
        ({ loss: calculatedBaseLoss, process, reasoningFormula, reasoningExplanation } = this.calculateTimeLoss(item.amount, currentItemLossMultiplier));
        break;
      case AuditCategory.SAVINGS: // For asset-2, asset-4, asset-6 select types
        if (question.type === 'select') {
          calculatedBaseLoss = item.amount * currentItemLossMultiplier;
          process = `基本損失額 ${item.amount.toLocaleString()}円 × 係数${currentItemLossMultiplier}`;
          reasoningFormula = `基本損失額 ${item.amount.toLocaleString()}円 × リスク係数${currentItemLossMultiplier}`;
          reasoningExplanation = `${explanations.mentalCost} 選択肢に応じた貯蓄機会損失を考慮。`;
        } else {
          calculatedBaseLoss = item.amount * currentItemLossMultiplier; // For boolean savings questions
          process = `${item.amount.toLocaleString()}円 × 係数${currentItemLossMultiplier}`;
          reasoningFormula = `金額 ${item.amount.toLocaleString()}円 × リスク係数${currentItemLossMultiplier}`;
          reasoningExplanation = `${explanations.mentalCost}`;
        }
        break;
      default: // Default case needs to apply the multiplier
        calculatedBaseLoss = item.amount * currentItemLossMultiplier;
        process = `${item.amount.toLocaleString()}円 × 係数${currentItemLossMultiplier}`;
        reasoningFormula = `金額 ${item.amount.toLocaleString()}円 × リスク係数${currentItemLossMultiplier}`;
        reasoningExplanation = explanations.mentalCost;
        break;
    }

    const financialLoss = safeNumber(calculatedBaseLoss * MENTAL_COST_MULTIPLIER);
    const calculationProcess = `${process} × 精神的コスト係数${MENTAL_COST_MULTIPLIER} = ${Math.round(financialLoss).toLocaleString()}円`;

    const generatedFormula = this.generateReasoningFormula(question, item);

    return {
      item,
      financialLoss,
      timeLossHours: safeNumber(financialLoss / this.hourWage),
      logs: [],
      calculationProcess,
      rationale: question?.meta?.rationale || 'N/A',
      reasoningFormula: generatedFormula || reasoningFormula,
      reasoningExplanation: reasoningExplanation || explanations.mentalCost,
      action: question?.meta?.action || '具体的なアクションプランを立てましょう。',
    };
  }

  private getLossMultiplier(question: Question | undefined, item: AuditItemInput): number {
    if (!question?.options || item.answerValueRaw === undefined) {
      return 1; // Default multiplier if no options or no answer
    }

    let totalMultiplier = 0;
    const rawAnswers = Array.isArray(item.answerValueRaw) ? item.answerValueRaw : [item.answerValueRaw];

    for (const selectedValue of rawAnswers) {
      const selectedOption = question.options.find(o => o.value === selectedValue);
      totalMultiplier += (selectedOption?.lossMultiplier ?? 0);
    }

    // If totalMultiplier is 0 for a select question, it implies no loss or selected 'none'
    // If it's 0 because no options matched, that's an edge case.
    // For now, if no lossMultiplier is found for any selected option, it will be 0.
    return totalMultiplier;
  }

  private generateReasoningFormula(question: Question | undefined, item: AuditItemInput): string {
    if (!question?.meta?.reasoningTemplate) {
      return '';
    }

    const template = question.meta.reasoningTemplate;
    return template
      .replace(/{amount}/g, safeNumber(item.amount).toLocaleString())
      .replace(/{remainingYears}/g, this.remainingYears.toString())
      .replace(/{hourWage}/g, this.hourWage.toLocaleString())
      .replace(/{rate}/g, (this.annualRate * 100).toString())
      .replace(/{multiplier}/g, MENTAL_COST_MULTIPLIER.toString());
  }

  private calculateInvestmentLoss(monthlyAmount: number, multiplier: number): { loss: number; process: string; reasoningFormula: string; reasoningExplanation: string } {
    const amount = safeNumber(monthlyAmount); // This is item.amount (base)
    if (amount <= 0) {
      return {
        loss: 0,
        process: '投資額が0のため計算対象外。',
        reasoningFormula: '投資額 0円',
        reasoningExplanation: '投資額が入力されていないため、機会損失は発生しません。',
      };
    }

    // Apply multiplier to the monthly amount for effective calculation
    const effectiveMonthlyAmount = amount * multiplier;

    // 複利計算
    let futureValue = 0;
    for (let i = 0; i < this.remainingYears * 12; i++) {
      futureValue = futureValue * (1 + this.annualRate / 12) + effectiveMonthlyAmount;
    }
    const principal = effectiveMonthlyAmount * 12 * this.remainingYears;
    const gain = futureValue - principal;
    const taxBenefit = gain * NISA_TAX_BENEFIT;
    const loss = Math.round(gain + taxBenefit); // Multiplier already applied to effectiveMonthlyAmount

    const process = `月額${effectiveMonthlyAmount.toLocaleString()}円 × 12ヶ月 × ${this.remainingYears}年 × 複利効果 + 非課税メリット`;
    const reasoningFormula = `月額${amount.toLocaleString()}円 × 12ヶ月 × ${this.remainingYears}年 × 複利効果(年利5%) + 非課税メリット(20.315%) × 選択係数${multiplier}`;
    const reasoningExplanation = `${this.reasoningExplanations.interestRate} ${this.reasoningExplanations.nisaBenefit} ${this.reasoningExplanations.mentalCost}`;

    return { loss, process, reasoningFormula, reasoningExplanation };
  }

  // Modified sleep loss to take daysShort (amount) and age (validatedAge)
  private calculateSleepLoss(daysShort: number, age: number): { loss: number; process: string; reasoningFormula: string; reasoningExplanation: string } {
    // Assuming 'daysShort' here is the answer from health-2a (e.g., number of days per week feeling sleep deprived)
    const hoursShortPerDay = 2; // Assuming 2 hours short per day for significant sleep debt
    const productivityLossFactor = 0.25; // 25% productivity loss per hour short
    const weeklyLoss = daysShort * hoursShortPerDay * productivityLossFactor * this.hourWage;
    const loss = weeklyLoss * 52 * this.remainingYears; // this.remainingYears uses validatedAge already

    const process = `週${daysShort}日 × ${hoursShortPerDay}時間/日 × 生産性低下${productivityLossFactor * 100}% × 時給${this.hourWage.toLocaleString()}円 × 52週 × ${this.remainingYears}年`;
    const reasoningFormula = `週${daysShort}日 × 生産性低下25% × 時給${this.hourWage.toLocaleString()}円 × 52週 × {remainingYears}年`;
    const reasoningExplanation = `${this.reasoningExplanations.mentalCost} 睡眠不足による集中力・判断力低下を金銭換算。`;
    return { loss: safeNumber(loss), process, reasoningFormula, reasoningExplanation };
  }

  // calculateCareerLoss needs to be updated to take baseAmount and multiplier
  private calculateCareerLoss(baseAmount: number, multiplier: number): { loss: number; process: string; reasoningFormula: string; reasoningExplanation: string } {
    const amount = safeNumber(baseAmount); // baseAmount is item.amount
    const riskFactor = 0.2; // Example risk factor
    const loss = this.remainingYears * riskFactor * amount * multiplier;
    const process = `${this.remainingYears}年 × 係数${riskFactor} × 基準年収${amount.toLocaleString()}円 × 係数${multiplier}`;
    const reasoningFormula = `${this.remainingYears}年 × リスク係数0.2 × 基準${amount.toLocaleString()}円 × 選択係数${multiplier}`;
    const reasoningExplanation = `${this.reasoningExplanations.careerRisk} ${this.reasoningExplanations.mentalCost}`;
    return { loss: safeNumber(loss), process, reasoningFormula, reasoningExplanation };
  }

  // calculateTimeLoss needs to be updated to take baseAmount and multiplier
  private calculateTimeLoss(baseAmount: number, multiplier: number): { loss: number; process: string; reasoningFormula: string; reasoningExplanation: string } {
    const amount = safeNumber(baseAmount); // baseAmount is item.amount
    const loss = amount * this.remainingYears * multiplier;
    const process = `年間${amount.toLocaleString()}円 × ${this.remainingYears}年 × 係数${multiplier}`;
    const reasoningFormula = `年間${amount.toLocaleString()}円 × ${this.remainingYears}年 × 選択係数${multiplier}`;
    const reasoningExplanation = this.reasoningExplanations.mentalCost;
    return { loss: safeNumber(loss), process, reasoningFormula, reasoningExplanation };
  }

  // calculateDefaultLoss needs to be updated to take baseAmount and multiplier
  private calculateDefaultLoss(baseAmount: number, multiplier: number): { loss: number; process: string; reasoningFormula: string; reasoningExplanation: string } {
    const amount = safeNumber(baseAmount); // baseAmount is item.amount
    const loss = amount * this.remainingYears * multiplier;
    const process = `年間${amount.toLocaleString()}円 × ${this.remainingYears}年 × 係数${multiplier}`;
    const reasoningFormula = `年間${amount.toLocaleString()}円 × ${this.remainingYears}年 × 選択係数${multiplier}`;
    const reasoningExplanation = this.reasoningExplanations.mentalCost;
    return { loss: safeNumber(loss), process, reasoningFormula, reasoningExplanation };
  }

  // New function for health select types
  private calculateHealthSelectLoss(baseAmount: number, multiplier: number): { loss: number; process: string; reasoningFormula: string; reasoningExplanation: string } {
    const loss = baseAmount * multiplier;
    const process = `基本損失額 ${baseAmount.toLocaleString()}円 × 係数${multiplier}`;
    const reasoningFormula = `基本損失額 ${baseAmount.toLocaleString()}円 × リスク係数${multiplier}`;
    const reasoningExplanation = `${this.reasoningExplanations.mentalCost} 選択肢に応じた健康リスクを考慮。`;
    return { loss: safeNumber(loss), process, reasoningFormula, reasoningExplanation };
  }

  private generateLossAnalogies(totalLoss: number): LossAnalogy[] {
    const analogies: LossAnalogy[] = [];
    const loss = safeNumber(totalLoss);

    // 時間換算
    const hours = Math.round(loss / this.hourWage);
    analogies.push({
      icon: '⏰',
      text: this.region === 'US' ? `${hours.toLocaleString()} hours of your life` : `あなたの人生 ${hours.toLocaleString()} 時間分`,
      value: hours,
    });

    // 旅行
    const tripCost = this.region === 'US' ? 2000 : 300000;
    const trips = loss / tripCost;
    if (trips >= 1) {
      analogies.push({
        icon: '🌴',
        text: this.region === 'US' ? `${trips.toFixed(1)} Hawaiian vacations` : `ハワイ旅行 ${trips.toFixed(1)} 回分`,
        value: tripCost,
      });
    }

    // 車
    const carCost = this.region === 'US' ? 50000 : 8000000;
    const cars = loss / carCost;
    if (cars >= 0.5) {
      analogies.push({
        icon: '🚗',
        text: this.region === 'US' ? `${cars.toFixed(1)} Luxury Cars` : `国産高級車 ${cars.toFixed(1)} 台分`,
        value: carCost,
      });
    }

    return analogies;
  }

  private generateCategoryBreakdown(breakdown: AuditItemResult[], totalLoss: number): CategoryBreakdown[] {
    const categoryMap = new Map<DisplayCategory, number>();

    breakdown.forEach(item => {
      const category = item.item.displayCategory;
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + safeNumber(item.financialLoss));
    });

    const result: CategoryBreakdown[] = [];
    categoryMap.forEach((loss, category) => {
      result.push({
        category,
        loss,
        percentage: totalLoss > 0 ? Math.round((loss / totalLoss) * 100) : 0,
        icon: CATEGORY_ICONS[category] || '📊',
      });
    });

    return result.sort((a, b) => b.loss - a.loss);
  }

  private generateRecommendedPatches(breakdown: AuditItemResult[]): RecommendedPatch[] {
    const sortedBreakdown = [...breakdown].sort((a, b) => b.financialLoss - a.financialLoss);
    // Unique categories using filter to avoid Set iteration issues in some TS targets
    const topCategories = sortedBreakdown
      .map(item => item.item.category)
      .filter((val, idx, arr) => arr.indexOf(val) === idx)
      .slice(0, 3);

    return topCategories.map(category => {
      const categoryLoss = breakdown
        .filter(item => item.item.category === category)
        .reduce((sum, item) => sum + safeNumber(item.financialLoss), 0);

      const adInfo = REGIONAL_AFFILIATE_LINKS[this.region][category] || DEFAULT_AFFILIATE;

      const copy = this.region === 'US'
        ? `Recover approx. $${Math.round(categoryLoss).toLocaleString()} over your lifetime`
        : `この対策で生涯 約${Math.round(categoryLoss).toLocaleString()}円 をリカバー`;

      return {
        category,
        title: adInfo.title,
        copy,
        link: adInfo.link,
        icon: adInfo.icon,
        potentialRecovery: categoryLoss,
        actionLabel: adInfo.actionLabel,
        actionUrl: adInfo.link,
      };
    });
  }
}