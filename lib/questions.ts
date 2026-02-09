import { AuditCategory, DisplayCategory, Region } from "@/types/audit";

export interface SelectOption {
  value: string | number;
  label: string;
  lossMultiplier?: number;
}

export interface Question {
  id: string;
  text: string;
  category: AuditCategory;
  displayCategory: string; // ローカライズされたカテゴリ名が入る
  type: 'boolean' | 'number' | 'select';
  multiple?: boolean;
  options?: SelectOption[];
  followUp?: Question;
  followUpCondition?: 'yes' | 'no' | 'specific';
  followUpTriggerValues?: (string | number | boolean)[];
  baseAmount?: number;
  meta?: {
    unit?: string;
    suggestions?: number[];
    rationale: string;
    action: string;
    reasoningTemplate: string;
  };
}

// ========================================
// 日本向け質問セット (JP)
// ========================================
const JP_QUESTIONS: Question[] = [
  // 資産診断
  {
    id: 'asset-1',
    text: '新NISA（つみたて投資枠）やiDeCoを活用していますか？',
    category: AuditCategory.INVESTMENT,
    displayCategory: '資産診断',
    type: 'select',
    options: [
      { value: 'both', label: '両方活用している', lossMultiplier: 0 },
      { value: 'nisa_only', label: '新NISAのみ', lossMultiplier: 0.3 },
      { value: 'ideco_only', label: 'iDeCoのみ', lossMultiplier: 0.5 },
      { value: 'none', label: 'どちらも利用していない', lossMultiplier: 1 },
    ],
    followUp: {
      id: 'asset-1a',
      text: 'もし毎月積み立てるとしたら、いくら投資できそうですか？',
      category: AuditCategory.INVESTMENT,
      displayCategory: '資産診断',
      type: 'number',
      meta: {
        unit: '円/月',
        suggestions: [5000, 10000, 30000, 50000, 100000],
        rationale: '月々の積立額を年利5%で複利運用した場合の機会損失です。新NISAなら運用益が非課税になります。',
        action: 'ネット証券で新NISA口座を開設し、月1,000円からでも積立投資を始めましょう。',
        reasoningTemplate: '月額{amount}円 × 12ヶ月 × {remainingYears}年 × 複利効果(年利5%) + 非課税メリット(20.315%)',
      },
    },
    followUpCondition: 'specific',
    followUpTriggerValues: ['none', 'nisa_only', 'ideco_only'],
    meta: {
      rationale: '投資の非課税制度を活用しないことによる税金面での損失です。',
      action: 'まずは新NISA口座を開設することから始めましょう。',
      reasoningTemplate: '制度未活用による機会損失を算出しています。',
    },
  },
  {
    id: 'asset-2',
    text: 'クレジットカードのポイントを効率的に貯めて活用していますか？',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'select',
    options: [
      { value: 'optimized', label: '還元率を意識して使い分けている', lossMultiplier: 0 },
      { value: 'single', label: '1枚のカードをメインで使用', lossMultiplier: 0.3 },
      { value: 'cash', label: '現金払いが多い', lossMultiplier: 1 },
      { value: 'unused', label: 'ポイントを失効させることがある', lossMultiplier: 1.2 },
    ],
    baseAmount: 30000,
    meta: {
      rationale: 'クレカのポイント還元を活用しないことによる損失です（年間支出300万円×1%還元想定）。',
      action: '高還元率のクレジットカードに切り替え、ポイントの有効期限を管理しましょう。',
      reasoningTemplate: '年間支出300万円 × 還元率1% × {remainingYears}年 = 年間{amount}円の機会損失',
    },
  },
  {
    id: 'asset-3',
    text: '利用頻度が低い（月1回未満）のサブスクリプションを放置していますか？',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'boolean',
    followUp: {
      id: 'asset-3a',
      text: '放置しているサブスクの合計月額料金はいくらですか？',
      category: AuditCategory.SAVINGS,
      displayCategory: '資産診断',
      type: 'number',
      meta: {
        unit: '円/月',
        suggestions: [500, 1000, 3000, 5000, 10000],
        rationale: '使っていないサービスへの支払いは純粋な損失です。',
        action: 'サブスクの棚卸しを行い、不要なものは即解約しましょう。',
        reasoningTemplate: '月額{amount}円 × 12ヶ月 × {remainingYears}年 × 精神的コスト係数1.25',
      },
    },
    followUpCondition: 'yes',
    meta: {
      rationale: '未使用サブスクへの支払いは純粋な損失です。',
      action: 'クレジットカード明細を確認し、不要なサブスクを解約しましょう。',
      reasoningTemplate: 'サブスク月額 × 12ヶ月 × {remainingYears}年',
    },
  },
  {
    id: 'asset-4',
    text: 'ATMの時間外手数料や振込手数料をどのくらい支払っていますか？',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'select',
    options: [
      { value: 'never', label: '無料の方法を使っている', lossMultiplier: 0 },
      { value: 'rarely', label: '月1-2回程度', lossMultiplier: 0.5 },
      { value: 'sometimes', label: '月3-5回程度', lossMultiplier: 1 },
      { value: 'often', label: '月6回以上', lossMultiplier: 2 },
    ],
    baseAmount: 6000,
    meta: {
      rationale: 'ATM・振込手数料の年間支払い累積です。',
      action: 'ネット銀行や特定条件で手数料無料になるサービスを利用しましょう。',
      reasoningTemplate: '月{amount}円 × 12ヶ月 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'asset-5',
    text: '特に目的もなく、週3回以上コンビニで買い物をしますか？',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'boolean',
    baseAmount: 36000,
    meta: {
      rationale: '習慣的な少額出費（ついで買い）の年間累積です。',
      action: 'コンビニに立ち寄る回数を減らし、必要なものはスーパーでまとめ買いしましょう。',
      reasoningTemplate: '週3回 × 1回500円 × 52週 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'asset-6',
    text: '賞味期限切れで食材を捨てることがどのくらいありますか？',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'select',
    options: [
      { value: 'never', label: 'ほぼない', lossMultiplier: 0 },
      { value: 'monthly', label: '月1-2回', lossMultiplier: 0.5 },
      { value: 'weekly', label: '週1回程度', lossMultiplier: 1 },
      { value: 'often', label: '週に複数回', lossMultiplier: 2 },
    ],
    baseAmount: 12000,
    meta: {
      rationale: '廃棄食材の年間購入費用です。',
      action: '買い物前に冷蔵庫の中身を確認し、献立を計画してから購入しましょう。',
      reasoningTemplate: '年間{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'asset-7',
    text: 'ふるさと納税を上限額まで活用していますか？',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'boolean',
    baseAmount: 30000,
    meta: {
      rationale: 'ふるさと納税の返礼品（実質還元率30%想定）を受け取らないことによる損失です。',
      action: 'シミュレーターで控除上限額を確認し、ふるさと納税ポータルサイトで申し込みましょう。',
      reasoningTemplate: '控除上限10万円 × 返礼率30% × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'asset-8',
    text: '生命保険・医療保険を3年以上見直していませんか？',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'boolean',
    baseAmount: 50000,
    meta: {
      rationale: '不要な保障への過払い、または新しい安価なプランへの乗り換え機会損失です。',
      action: '保険の無料相談サービスで、現在の保障内容と保険料が適正かチェックしましょう。',
      reasoningTemplate: '年間{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'asset-9',
    text: '住宅ローンの借り換えを検討したことがありますか？（金利0.5%以上の持ち家の方）',
    category: AuditCategory.SAVINGS,
    displayCategory: '資産診断',
    type: 'boolean',
    baseAmount: 100000,
    meta: {
      rationale: '高金利ローンの継続による過剰な利息支払いです。',
      action: '住宅ローン借り換えサービスで、どのくらい削減できるかシミュレーションしましょう。',
      reasoningTemplate: '残債3000万円 × 金利差0.5% × {remainingYears}年想定の平均損失',
    },
  },

  // 健康診断
  {
    id: 'health-1',
    text: '歯科検診やクリーニングをどのくらい先延ばしにしていますか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康診断',
    type: 'select',
    options: [
      { value: 'regular', label: '定期的に通院している（半年に1回以上）', lossMultiplier: 0 },
      { value: '1year', label: '1年くらい行っていない', lossMultiplier: 0.5 },
      { value: '2years', label: '2-3年行っていない', lossMultiplier: 1 },
      { value: 'longer', label: '4年以上行っていない', lossMultiplier: 2 },
    ],
    baseAmount: 100000,
    meta: {
      rationale: '放置による将来の重症化リスク（歯周病・インプラント等）に伴う高額治療費です。',
      action: '症状がなくても歯科医院を予約し、現状をチェックしてもらいましょう。',
      reasoningTemplate: '治療費期待値{amount}円（インプラント1本30-50万円の発生確率込み）× 精神的コスト係数1.25',
    },
  },
  {
    id: 'health-2',
    text: '平均睡眠時間はどのくらいですか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康診断',
    type: 'select',
    options: [
      { value: '7plus', label: '7時間以上', lossMultiplier: 0 },
      { value: '6to7', label: '6-7時間', lossMultiplier: 0.3 },
      { value: '5to6', label: '5-6時間', lossMultiplier: 0.7 },
      { value: 'under5', label: '5時間未満', lossMultiplier: 1 },
    ],
    followUp: {
      id: 'health-2a',
      text: '睡眠不足を感じる日が週に何日ありますか？',
      category: AuditCategory.HEALTH,
      displayCategory: '健康診断',
      type: 'number',
      meta: {
        unit: '日/週',
        suggestions: [1, 2, 3, 4, 5, 6, 7],
        rationale: '睡眠不足による生産性低下を時給換算しています。',
        action: '就寝前のスマホ利用を控え、寝室環境を整えましょう休。',
        reasoningTemplate: '週{amount}日 × 生産性低下25% × 時給{hourWage}円 × 52週 × {remainingYears}年',
      },
    },
    followUpCondition: 'specific',
    followUpTriggerValues: ['5to6', 'under5'],
    meta: {
      rationale: '睡眠不足による生産性低下・健康リスク増加を金額換算しています。',
      action: '睡眠の質を高めるため、就寝時間を固定し、寝室を暗く涼しく保ちましょう。',
      reasoningTemplate: '睡眠不足による生産性低下20-30% × 時給{hourWage}円 × {remainingYears}年',
    },
  },

  // キャリア診断
  {
    id: 'career-1',
    text: '転職や年収アップについてどのように考えていますか？',
    category: AuditCategory.CAREER,
    displayCategory: 'キャリア診断',
    type: 'select',
    options: [
      { value: 'satisfied', label: '現職に満足している', lossMultiplier: 0 },
      { value: 'interested', label: '興味はあるが動いていない', lossMultiplier: 0.7 },
      { value: 'delayed', label: '転職したいが先延ばしにしている', lossMultiplier: 1 },
      { value: 'active', label: '積極的に活動中', lossMultiplier: 0 },
    ],
    followUp: {
      id: 'career-1a',
      text: '転職した場合、年収がいくら上がると思いますか？',
      category: AuditCategory.CAREER,
      displayCategory: 'キャリア診断',
      type: 'select',
      options: [
        { value: 50, label: '50万円くらい', lossMultiplier: 0 },
        { value: 100, label: '100万円くらい', lossMultiplier: 0 },
        { value: 200, label: '200万円くらい', lossMultiplier: 0 },
        { value: 300, label: '300万円以上', lossMultiplier: 0 },
      ],
      meta: {
        unit: '万円/年',
        rationale: '転職による年収アップの機会損失です。',
        action: '転職サイトに登録して、自分の市場価値を確認しましょう。',
        reasoningTemplate: '年収アップ{amount}万円 × {remainingYears}年（40歳以降は50%で計算）',
      },
    },
    followUpCondition: 'specific',
    followUpTriggerValues: ['interested', 'delayed'],
    meta: {
      rationale: '転職機会を逃すことによる生涯収入への影響です。',
      action: 'まずは転職サイトに登録して市場価値を把握しましょう。',
      reasoningTemplate: '転職による年収アップ機会 × {remainingYears}年',
    },
  },

  // 時間・環境診断
  {
    id: 'time-1',
    text: '探し物に費やす時間はどのくらいですか？',
    category: AuditCategory.TIME,
    displayCategory: '時間・環境診断',
    type: 'select',
    options: [
      { value: 'none', label: 'ほとんどない', lossMultiplier: 0 },
      { value: 'sometimes', label: '週に1-2回程度', lossMultiplier: 0.5 },
      { value: 'often', label: '毎日のように探している', lossMultiplier: 1 },
      { value: 'always', label: 'いつも何かを探している', lossMultiplier: 1.5 },
    ],
    baseAmount: 36000,
    meta: {
      rationale: '探し物による時間の浪費を時給換算しています。',
      action: '物の定位置を決め、使ったら戻す習慣をつけましょう。',
      reasoningTemplate: '1日10分 × 365日 × 時給{hourWage}円 × {remainingYears}年',
    },
  },
];

// ========================================
// 米国向け質問セット (US) - 仮
// ========================================
const US_QUESTIONS: Question[] = [
  {
    id: 'asset-us-1',
    text: 'Are you maximizing your 401(k) employer match or contributing to a Roth IRA?',
    category: AuditCategory.INVESTMENT,
    displayCategory: 'Financial Diagnosis',
    type: 'select',
    options: [
      { value: 'max', label: 'Maximizing both', lossMultiplier: 0 },
      { value: 'match_only', label: 'Employer match only', lossMultiplier: 0.3 },
      { value: 'partially', label: 'Contributing partially', lossMultiplier: 0.6 },
      { value: 'none', label: 'Not contributing', lossMultiplier: 1 },
    ],
    followUp: {
      id: 'asset-us-1a',
      text: 'How much more could you realistically invest per month?',
      category: AuditCategory.INVESTMENT,
      displayCategory: 'Financial Diagnosis',
      type: 'number',
      meta: {
        unit: 'USD/Month',
        suggestions: [100, 500, 1000, 2000],
        rationale: 'Opportunity cost of not using tax-advantaged accounts compounded at 7% annually.',
        action: 'Talk to your HR or open a brokerage account to start contributing to a Roth IRA.',
        reasoningTemplate: '${amount} × 12 months × {remainingYears} years × 7% compounding + Tax benefits',
      },
    },
    followUpCondition: 'specific',
    followUpTriggerValues: ['none', 'partially', 'match_only'],
    meta: {
      rationale: 'Missing out on tax-free growth and employer free money.',
      action: 'Set up automatic contributions to your retirement accounts today.',
      reasoningTemplate: 'Calculated based on average market returns and tax savings.',
    },
  },
  {
    id: 'health-us-1',
    text: 'Do you have a Health Savings Account (HSA) and are you contributing to it?',
    category: AuditCategory.HEALTH,
    displayCategory: 'Health Diagnosis',
    type: 'boolean',
    baseAmount: 3000,
    meta: {
      unit: 'USD',
      rationale: 'Missing the triple tax advantage of an HSA if you have a high deductible plan.',
      action: 'Check if your health plan is HSA-eligible and start contributing.',
      reasoningTemplate: 'Tax savings + Potential growth over {remainingYears} years',
    },
  },
  {
    id: 'money-us-2',
    text: 'How often do you order food delivery or eat out per week?',
    category: AuditCategory.SAVINGS,
    displayCategory: 'Financial Diagnosis',
    type: 'select',
    options: [
      { value: 'daily', label: 'Almost daily', lossMultiplier: 2 },
      { value: 'often', label: '3-4 times a week', lossMultiplier: 1.5 },
      { value: 'sometimes', label: '1-2 times a week', lossMultiplier: 0.5 },
      { value: 'rarely', label: 'Rarely (Cook at home)', lossMultiplier: 0 },
    ],
    baseAmount: 3000, // Monthly base
    meta: {
      unit: 'USD',
      rationale: 'Eating out costs 3-4x more than cooking at home. Major wealth leak.',
      action: 'Meal prep on Sundays and delete delivery apps.',
      reasoningTemplate: 'Avg $20/meal difference x frequency x 52 weeks x {remainingYears} years',
    },
  },
  {
    id: 'career-us-1',
    text: 'Have you negotiated your salary or changed jobs in the last 3 years?',
    category: AuditCategory.CAREER,
    displayCategory: 'Career Diagnosis',
    type: 'boolean',
    baseAmount: 10000, // Annual base diff
    meta: {
      unit: 'USD',
      rationale: 'Staying in the same job often leads to salary stagnation vs market rate.',
      action: 'Update your LinkedIn and interview once a year to know your worth.',
      reasoningTemplate: 'Potential 15-20% salary bump missing x {remainingYears} years',
    },
  },
  {
    id: 'money-us-3',
    text: 'Do you check your Credit Score regularily?',
    category: AuditCategory.SAVINGS,
    displayCategory: 'Financial Diagnosis',
    type: 'boolean',
    baseAmount: 5000, // Interest rate impact
    meta: {
      unit: 'USD',
      rationale: 'Low credit score means higher interest rates on mortgages and car loans.',
      action: 'Use free credit monitoring tools and keep utilization under 30%.',
      reasoningTemplate: 'Interest rate difference (e.g. 1%) on future loans x {remainingYears} years',
    },
  },
  {
    id: 'sub-us-1',
    text: 'Do you have subscriptions (streaming, gym, apps) that you rarely use?',
    category: AuditCategory.SAVINGS,
    displayCategory: 'Financial Diagnosis',
    type: 'boolean',
    followUp: {
      id: 'sub-us-1a',
      text: 'What is the total monthly cost of these unused subscriptions?',
      category: AuditCategory.SAVINGS,
      displayCategory: 'Financial Diagnosis',
      type: 'number',
      meta: {
        unit: 'USD/Month',
        suggestions: [10, 20, 50, 100],
        rationale: 'Unused subscriptions are a pure leak of wealth. $50/mo is $600/year.',
        action: 'Review your bank statement and cancel them today.',
        reasoningTemplate: '${amount} × 12 months × {remainingYears} years × 1.25 (mental cost)',
      },
    },
    followUpCondition: 'yes',
    meta: {
      rationale: 'Subscription fatigue is real. Unused services drain your budget silently.',
      action: 'Audit your recurring payments.',
      reasoningTemplate: 'Monthly cost × 12 months × {remainingYears} years',
    },
  },
  {
    id: 'health-us-2',
    text: 'Do you skip dental checkups or cleanings for more than a year?',
    category: AuditCategory.HEALTH,
    displayCategory: 'Health Diagnosis',
    type: 'select',
    options: [
      { value: 'regular', label: 'No, I go regularly', lossMultiplier: 0 },
      { value: '1year', label: 'Over a year', lossMultiplier: 0.5 },
      { value: '2years', label: '2-3 years', lossMultiplier: 1 },
      { value: 'longer', label: '4+ years', lossMultiplier: 2 },
    ],
    baseAmount: 5000,
    meta: {
      unit: 'USD',
      rationale: 'Preventative care is cheap; Root canals and crowns are expensive ($1k-$2k+).',
      action: 'Book a cleaning. Most insurance covers it 100%.',
      reasoningTemplate: 'Expected future treatment cost ${amount} × risk factor',
    },
  },
  {
    id: 'health-us-3',
    text: 'What is your average sleep duration?',
    category: AuditCategory.HEALTH,
    displayCategory: 'Health Diagnosis',
    type: 'select',
    options: [
      { value: '7plus', label: '7+ hours', lossMultiplier: 0 },
      { value: '6to7', label: '6-7 hours', lossMultiplier: 0.3 },
      { value: '5to6', label: '5-6 hours', lossMultiplier: 0.7 },
      { value: 'under5', label: 'Under 5 hours', lossMultiplier: 1 },
    ],
    followUp: {
      id: 'health-us-3a',
      text: 'How many days a week do you feel sleep deprived?',
      category: AuditCategory.HEALTH,
      displayCategory: 'Health Diagnosis',
      type: 'number',
      meta: {
        unit: 'days/week',
        suggestions: [1, 2, 3, 5, 7],
        rationale: 'Sleep deprivation reduces cognitive performance by 20-30%.',
        action: 'Prioritize 7 hours of sleep for better earning potential.',
        reasoningTemplate: '{amount} days/week × 25% productivity loss × Hourly Wage × 52 weeks × {remainingYears} years',
      },
    },
    followUpCondition: 'specific',
    followUpTriggerValues: ['5to6', 'under5'],
    meta: {
      rationale: 'Health is your biggest asset. Poor sleep equals poor decision making.',
      action: 'Fix your sleep hygiene.',
      reasoningTemplate: 'Productivity loss calculation based on sleep debt.',
    },
  },
];

// リージョンごとの質問マッピング
export const REGION_QUESTIONS: Record<Region, Question[]> = {
  JP: JP_QUESTIONS,
  US: US_QUESTIONS,
};

// 全質問を統合（後方互換性のため）
export const AUDIT_QUESTIONS: Question[] = [
  ...JP_QUESTIONS,
  ...US_QUESTIONS,
];

// カテゴリ別に質問を取得
export function getQuestionsByCategory(category: string, region: Region = 'JP'): Question[] {
  return REGION_QUESTIONS[region].filter(q => q.displayCategory === category);
}

// 質問IDから質問を取得（フォローアップ含む）
export function findQuestionById(id: string): Question | undefined {
  for (const q of AUDIT_QUESTIONS) {
    if (q.id === id) return q;
    if (q.followUp && q.followUp.id === id) return q; // フォローアップ自体を返す
  }
  return undefined;
}

// 特定リージョンの全質問を取得
export function getQuestionsByRegion(region: Region): Question[] {
  return REGION_QUESTIONS[region] || JP_QUESTIONS;
}
