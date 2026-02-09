import { AuditCategory, DisplayCategory } from "@/types/audit";

export interface SelectOption {
  value: string | number;
  label: string;
  lossMultiplier?: number;
}

export interface Question {
  id: string;
  text: string;
  category: AuditCategory;
  displayCategory: DisplayCategory;
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
// 資産監査（8問）
// ========================================
const ASSET_QUESTIONS: Question[] = [
  {
    id: 'asset-1',
    text: '新NISA（つみたて投資枠）やiDeCoを活用していますか？',
    category: AuditCategory.INVESTMENT,
    displayCategory: '資産監査',
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
      displayCategory: '資産監査',
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
    displayCategory: '資産監査',
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
    displayCategory: '資産監査',
    type: 'boolean',
    followUp: {
      id: 'asset-3a',
      text: '放置しているサブスクの合計月額料金はいくらですか？',
      category: AuditCategory.SAVINGS,
      displayCategory: '資産監査',
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
    displayCategory: '資産監査',
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
    displayCategory: '資産監査',
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
    displayCategory: '資産監査',
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
    displayCategory: '資産監査',
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
    displayCategory: '資産監査',
    type: 'boolean',
    baseAmount: 50000,
    meta: {
      rationale: '不要な保障への過払い、または新しい安価なプランへの乗り換え機会損失です。',
      action: '保険の無料相談サービスで、現在の保障内容と保険料が適正かチェックしましょう。',
      reasoningTemplate: '年間{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
];

// ========================================
// 健康監査（8問）
// ========================================
const HEALTH_QUESTIONS: Question[] = [
  {
    id: 'health-1',
    text: '歯科検診やクリーニングをどのくらい先延ばしにしていますか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康監査',
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
    displayCategory: '健康監査',
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
      displayCategory: '健康監査',
      type: 'number',
      meta: {
        unit: '日/週',
        suggestions: [1, 2, 3, 4, 5, 6, 7],
        rationale: '睡眠不足による生産性低下を時給換算しています。',
        action: '就寝前のスマホ利用を控え、寝室環境を整えましょう。',
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
  {
    id: 'health-3',
    text: '運動習慣はありますか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康監査',
    type: 'select',
    options: [
      { value: 'active', label: '週3回以上運動している', lossMultiplier: 0 },
      { value: 'moderate', label: '週1-2回運動している', lossMultiplier: 0.3 },
      { value: 'light', label: '月に数回程度', lossMultiplier: 0.7 },
      { value: 'none', label: 'ほとんど運動していない', lossMultiplier: 1 },
    ],
    followUp: {
      id: 'health-3a',
      text: '運動しない主な理由は何ですか？',
      category: AuditCategory.HEALTH,
      displayCategory: '健康監査',
      type: 'select',
      options: [
        { value: 'time', label: '時間がない', lossMultiplier: 1 },
        { value: 'motivation', label: 'やる気が出ない', lossMultiplier: 1 },
        { value: 'money', label: 'ジム代が高い', lossMultiplier: 1 },
        { value: 'other', label: 'その他', lossMultiplier: 1 },
      ],
      meta: {
        rationale: '運動不足は将来の医療費増加につながります。',
        action: '理由に合わせた対策を取りましょう。時間がないなら10分の運動から、費用なら公園でのウォーキングから。',
        reasoningTemplate: '運動不足による医療費増加リスク1.5倍 × 年間医療費30万円 × {remainingYears}年',
      },
    },
    followUpCondition: 'specific',
    followUpTriggerValues: ['light', 'none'],
    baseAmount: 150000,
    meta: {
      rationale: '運動不足による将来の医療費増加・生産性低下です。',
      action: '週に2回、30分程度のウォーキングから始めてみましょう。',
      reasoningTemplate: '医療費リスク増加50% × 年間医療費30万円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'health-4',
    text: '健康診断で「要再検査」「要精密検査」が出た場合、すぐに受診していますか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康監査',
    type: 'select',
    options: [
      { value: 'immediate', label: 'すぐに受診している', lossMultiplier: 0 },
      { value: 'delayed', label: '少し遅れるが受診する', lossMultiplier: 0.3 },
      { value: 'sometimes', label: '受診しないこともある', lossMultiplier: 0.7 },
      { value: 'never', label: 'ほとんど受診しない', lossMultiplier: 1 },
    ],
    baseAmount: 200000,
    meta: {
      rationale: '早期発見・早期治療の機会損失による将来の高額治療費リスクです。',
      action: '「要再検査」が出たら、2週間以内に専門医を受診しましょう。',
      reasoningTemplate: '重症化リスク × 治療費期待値{amount}円 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'health-5',
    text: '食事の栄養バランスについてどの程度意識していますか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康監査',
    type: 'select',
    options: [
      { value: 'careful', label: 'バランスを考えて食事している', lossMultiplier: 0 },
      { value: 'somewhat', label: 'ある程度は意識している', lossMultiplier: 0.3 },
      { value: 'rarely', label: 'あまり意識していない', lossMultiplier: 0.7 },
      { value: 'none', label: '全く意識していない', lossMultiplier: 1 },
    ],
    baseAmount: 30000,
    meta: {
      rationale: '栄養バランスの悪い食事による生産性低下・健康リスクです。',
      action: '野菜・タンパク質を意識した食事を週に数回取り入れましょう。',
      reasoningTemplate: '年間{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'health-6',
    text: '喫煙・過度な飲酒の習慣はありますか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康監査',
    type: 'select',
    options: [
      { value: 'none', label: 'どちらもない', lossMultiplier: 0 },
      { value: 'drink', label: '週3回以上飲酒', lossMultiplier: 0.5 },
      { value: 'smoke', label: '喫煙している', lossMultiplier: 1 },
      { value: 'both', label: '両方ある', lossMultiplier: 1.5 },
    ],
    baseAmount: 200000,
    meta: {
      rationale: '喫煙・過度な飲酒による健康リスク・支出増加です。',
      action: '禁煙外来や節酒アプリの活用を検討しましょう。',
      reasoningTemplate: '健康リスク増加 + 年間支出{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'health-7',
    text: 'ストレス解消やメンタルヘルスケアを意識的に行っていますか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康監査',
    type: 'boolean',
    baseAmount: 50000,
    meta: {
      rationale: 'メンタルヘルス問題による生産性低下・医療費リスクです。',
      action: '週に1回は趣味や運動でリフレッシュする時間を確保しましょう。',
      reasoningTemplate: '年間{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'health-8',
    text: '持病や慢性的な症状を放置していませんか？',
    category: AuditCategory.HEALTH,
    displayCategory: '健康監査',
    type: 'boolean',
    baseAmount: 150000,
    meta: {
      rationale: '持病の放置による重症化リスク・QOL低下です。',
      action: '気になる症状があれば、早めにかかりつけ医に相談しましょう。',
      reasoningTemplate: '重症化による治療費{amount}円 × 精神的コスト係数1.25',
    },
  },
];

// ========================================
// キャリア監査（8問）
// ========================================
const CAREER_QUESTIONS: Question[] = [
  {
    id: 'career-1',
    text: '転職や年収アップについてどのように考えていますか？',
    category: AuditCategory.CAREER,
    displayCategory: 'キャリア監査',
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
      displayCategory: 'キャリア監査',
      type: 'number',
      meta: {
        unit: '万円/年',
        suggestions: [30, 50, 100, 200, 300],
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
  {
    id: 'career-2',
    text: '英語学習についてどのような状況ですか？',
    category: AuditCategory.LEARNING,
    displayCategory: 'キャリア監査',
    type: 'select',
    options: [
      { value: 'fluent', label: 'ビジネスレベルで使える', lossMultiplier: 0 },
      { value: 'learning', label: '学習中', lossMultiplier: 0.3 },
      { value: 'stalled', label: '学習を始めたが止まっている', lossMultiplier: 0.7 },
      { value: 'none', label: '学習していない/必要ない', lossMultiplier: 1 },
    ],
    baseAmount: 500000,
    meta: {
      rationale: '英語スキルの有無による年収差（平均10-20%）を算出しています。',
      action: '毎日10分でも英語に触れる習慣をつけましょう。',
      reasoningTemplate: '英語力による年収差{amount}円 × {remainingYears}年 × 確率係数',
    },
  },
  {
    id: 'career-3',
    text: 'IT・デジタルスキル（Excel、プログラミング、データ分析など）の習得状況は？',
    category: AuditCategory.LEARNING,
    displayCategory: 'キャリア監査',
    type: 'select',
    options: [
      { value: 'advanced', label: '業務で高度に活用している', lossMultiplier: 0 },
      { value: 'intermediate', label: '基本的なスキルはある', lossMultiplier: 0.3 },
      { value: 'learning', label: '学習中・これから学ぶ', lossMultiplier: 0.5 },
      { value: 'none', label: 'ほとんど使えない', lossMultiplier: 1 },
    ],
    baseAmount: 300000,
    meta: {
      rationale: 'デジタルスキルの有無による市場価値の差です。',
      action: 'オンライン学習サービスでExcelやプログラミングの基礎を学びましょう。',
      reasoningTemplate: 'スキル格差による年収差{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'career-4',
    text: '「いつか取ろう」と思っている資格を半年以上先延ばしにしていますか？',
    category: AuditCategory.CAREER,
    displayCategory: 'キャリア監査',
    type: 'boolean',
    followUp: {
      id: 'career-4a',
      text: '目指している資格のジャンルは？',
      category: AuditCategory.CAREER,
      displayCategory: 'キャリア監査',
      type: 'select',
      options: [
        { value: 'national', label: '国家資格（士業など）', lossMultiplier: 2 },
        { value: 'it', label: 'IT関連資格', lossMultiplier: 1 },
        { value: 'language', label: '語学資格（TOEIC等）', lossMultiplier: 0.8 },
        { value: 'other', label: 'その他', lossMultiplier: 0.5 },
      ],
      meta: {
        rationale: '資格取得による昇進・昇給機会の損失です。',
        action: '試験日を決めて、学習計画を立てましょう。',
        reasoningTemplate: '資格による年収アップ × {remainingYears}年',
      },
    },
    followUpCondition: 'yes',
    baseAmount: 500000,
    meta: {
      rationale: '資格保有者は平均10-20%年収が高いという統計に基づいています。',
      action: 'まずは試験日を決めて、逆算で学習計画を立てましょう。',
      reasoningTemplate: '{remainingYears}年 × リスク係数0.2 × 基準年収{amount}円 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'career-5',
    text: '自分の履歴書・職務経歴書を1年以上更新していませんか？',
    category: AuditCategory.CAREER,
    displayCategory: 'キャリア監査',
    type: 'boolean',
    baseAmount: 200000,
    meta: {
      rationale: '突然のキャリアチャンスを逃すリスクです。',
      action: '半年に一度は自分の経歴やスキルを棚卸しする時間を設けましょう。',
      reasoningTemplate: '{remainingYears}年 × リスク係数0.1 × 機会損失{amount}円 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'career-6',
    text: '気乗りしない飲み会や付き合いにどのくらい参加していますか？',
    category: AuditCategory.RELATIONSHIP,
    displayCategory: 'キャリア監査',
    type: 'select',
    options: [
      { value: 'never', label: '断れている/そもそもない', lossMultiplier: 0 },
      { value: 'rarely', label: '年に数回程度', lossMultiplier: 0.3 },
      { value: 'monthly', label: '月1-2回', lossMultiplier: 0.7 },
      { value: 'weekly', label: '週1回以上', lossMultiplier: 1 },
    ],
    baseAmount: 100000,
    meta: {
      rationale: '不本意な飲み会への参加費用 + 時間の機会損失です。',
      action: '勇気を持って断ることも大切。自分の時間を優先しましょう。',
      reasoningTemplate: '(参加費5,000円 + 時間3時間 × 時給{hourWage}円) × 年間回数 × {remainingYears}年',
    },
  },
  {
    id: 'career-7',
    text: '副業・複業への取り組み状況は？',
    category: AuditCategory.CAREER,
    displayCategory: 'キャリア監査',
    type: 'select',
    options: [
      { value: 'active', label: '副業で収入を得ている', lossMultiplier: 0 },
      { value: 'preparing', label: '準備中・検討中', lossMultiplier: 0.3 },
      { value: 'interested', label: '興味はあるが動いていない', lossMultiplier: 0.7 },
      { value: 'none', label: '興味がない/禁止されている', lossMultiplier: 0 },
    ],
    baseAmount: 600000,
    meta: {
      rationale: '副業による追加収入の機会損失です（月5万円想定）。',
      action: 'スキルを活かせる副業プラットフォームに登録してみましょう。',
      reasoningTemplate: '月5万円 × 12ヶ月 × {remainingYears}年 × 実現可能性係数',
    },
  },
  {
    id: 'career-8',
    text: '年間の自己投資額（書籍、セミナー、オンライン講座など）はいくらですか？',
    category: AuditCategory.LEARNING,
    displayCategory: 'キャリア監査',
    type: 'number',
    meta: {
      unit: '円/年',
      suggestions: [10000, 30000, 50000, 100000, 300000],
      rationale: '自己投資が少ないことによるスキル陳腐化リスクです。',
      action: '年収の3-5%を自己投資に充てることを目標にしましょう。',
      reasoningTemplate: '適正投資額との差分 × {remainingYears}年 × スキル価値係数',
    },
  },
];

// ========================================
// 時間・環境監査（8問）
// ========================================
const TIME_ENVIRONMENT_QUESTIONS: Question[] = [
  {
    id: 'time-1',
    text: '探し物に費やす時間はどのくらいですか？',
    category: AuditCategory.TIME,
    displayCategory: '時間・環境監査',
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
  {
    id: 'time-2',
    text: '10年以上前の古い家電を使い続けていますか？',
    category: AuditCategory.ENVIRONMENT,
    displayCategory: '時間・環境監査',
    type: 'boolean',
    followUp: {
      id: 'time-2a',
      text: '該当する家電を選んでください（複数可）',
      category: AuditCategory.ENVIRONMENT,
      displayCategory: '時間・環境監査',
      type: 'select',
      multiple: true,
      options: [
        { value: 'refrigerator', label: '冷蔵庫', lossMultiplier: 1.2 },
        { value: 'aircon', label: 'エアコン', lossMultiplier: 1 },
        { value: 'washer', label: '洗濯機', lossMultiplier: 0.5 },
        { value: 'tv', label: 'テレビ', lossMultiplier: 0.3 },
      ],
      meta: {
        rationale: '旧式家電の過剰な電気代です。',
        action: '省エネ性能の高い最新家電への買い替えを検討しましょう。',
        reasoningTemplate: '年間電気代差額 × {remainingYears}年',
      },
    },
    followUpCondition: 'yes',
    baseAmount: 15000,
    meta: {
      rationale: '10年前の家電は最新機種より消費電力が30-50%高いです。',
      action: '省エネ性能の高い家電に買い替えることを検討しましょう。',
      reasoningTemplate: '年間{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'time-3',
    text: 'スマホの1日の平均スクリーンタイムはどのくらいですか？',
    category: AuditCategory.TIME,
    displayCategory: '時間・環境監査',
    type: 'select',
    options: [
      { value: 'low', label: '2時間未満', lossMultiplier: 0 },
      { value: 'moderate', label: '2-4時間', lossMultiplier: 0.3 },
      { value: 'high', label: '4-6時間', lossMultiplier: 0.7 },
      { value: 'excessive', label: '6時間以上', lossMultiplier: 1 },
    ],
    baseAmount: 365000,
    meta: {
      rationale: '生産的でないスマホ利用（SNS、ゲームなど）の機会損失です。',
      action: 'スクリーンタイムのアプリ制限機能を活用しましょう。',
      reasoningTemplate: '超過時間 × 時給{hourWage}円 × 0.5 × 365日 × {remainingYears}年',
    },
  },
  {
    id: 'time-4',
    text: '通勤時間をどのように活用していますか？',
    category: AuditCategory.TIME,
    displayCategory: '時間・環境監査',
    type: 'select',
    options: [
      { value: 'productive', label: '読書・学習・仕事に活用', lossMultiplier: 0 },
      { value: 'mixed', label: '半分くらいは有効活用', lossMultiplier: 0.5 },
      { value: 'entertainment', label: 'SNS・ゲーム・動画視聴', lossMultiplier: 0.8 },
      { value: 'nothing', label: '特に何もしていない', lossMultiplier: 1 },
    ],
    baseAmount: 100000,
    meta: {
      rationale: '通勤時間の有効活用による自己投資機会の損失です。',
      action: '通勤時間を読書やオーディオブック、語学学習に充てましょう。',
      reasoningTemplate: '通勤時間1時間/日 × 学習価値{amount}円/年 × {remainingYears}年',
    },
  },
  {
    id: 'time-5',
    text: '家事の効率化（時短家電、家事代行など）をしていますか？',
    category: AuditCategory.ENVIRONMENT,
    displayCategory: '時間・環境監査',
    type: 'select',
    options: [
      { value: 'optimized', label: '積極的に効率化している', lossMultiplier: 0 },
      { value: 'some', label: '一部は効率化している', lossMultiplier: 0.5 },
      { value: 'traditional', label: 'ほぼ手作業', lossMultiplier: 1 },
    ],
    baseAmount: 50000,
    meta: {
      rationale: '家事にかかる時間の機会損失です。',
      action: 'ロボット掃除機や食洗機の導入を検討しましょう。',
      reasoningTemplate: '時短効果 × 時給{hourWage}円 × {remainingYears}年',
    },
  },
  {
    id: 'time-6',
    text: '部屋の整理整頓状況はいかがですか？',
    category: AuditCategory.ENVIRONMENT,
    displayCategory: '時間・環境監査',
    type: 'select',
    options: [
      { value: 'tidy', label: '常に整理されている', lossMultiplier: 0 },
      { value: 'mostly', label: 'だいたい片付いている', lossMultiplier: 0.3 },
      { value: 'messy', label: '散らかりがち', lossMultiplier: 0.7 },
      { value: 'cluttered', label: '常に散らかっている', lossMultiplier: 1 },
    ],
    baseAmount: 30000,
    meta: {
      rationale: '散らかった環境による集中力低下・ストレスの影響です。',
      action: '1日15分の片付けタイムを習慣化しましょう。',
      reasoningTemplate: '生産性低下{amount}円/年 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
  {
    id: 'time-7',
    text: '日々の定型作業（Excelの集計、メール返信など）を自動化していますか？',
    category: AuditCategory.TIME,
    displayCategory: '時間・環境監査',
    type: 'boolean',
    baseAmount: 100000,
    meta: {
      rationale: '手作業による時間の浪費を時給換算しています。',
      action: 'ExcelマクロやRPAツールで業務を効率化しましょう。',
      reasoningTemplate: '週1時間 × 52週 × 時給{hourWage}円 × {remainingYears}年',
    },
  },
  {
    id: 'time-8',
    text: 'タスクの優先順位づけを意識的に行っていますか？',
    category: AuditCategory.TIME,
    displayCategory: '時間・環境監査',
    type: 'select',
    options: [
      { value: 'always', label: '常に優先順位をつけている', lossMultiplier: 0 },
      { value: 'sometimes', label: 'たまに意識する', lossMultiplier: 0.5 },
      { value: 'rarely', label: 'あまり意識していない', lossMultiplier: 0.8 },
      { value: 'never', label: '来た順にこなしている', lossMultiplier: 1 },
    ],
    baseAmount: 50000,
    meta: {
      rationale: '非効率なタスク処理による時間損失です。',
      action: '毎朝5分でその日の優先タスクを3つ決める習慣をつけましょう。',
      reasoningTemplate: '年間{amount}円 × {remainingYears}年 × 精神的コスト係数1.25',
    },
  },
];

// 全質問を統合
export const AUDIT_QUESTIONS: Question[] = [
  ...ASSET_QUESTIONS,
  ...HEALTH_QUESTIONS,
  ...CAREER_QUESTIONS,
  ...TIME_ENVIRONMENT_QUESTIONS,
];

// カテゴリ別に質問を取得
export function getQuestionsByCategory(category: DisplayCategory): Question[] {
  return AUDIT_QUESTIONS.filter(q => q.displayCategory === category);
}

// 質問IDから質問を取得（フォローアップ含む）
export function findQuestionById(id: string): Question | undefined {
  for (const q of AUDIT_QUESTIONS) {
    if (q.id === id) return q;
    if (q.followUp && q.followUp.id === id) return q.followUp;
  }
  return undefined;
}
