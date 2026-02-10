import { Locale, Region } from "@/types/audit";

export interface TranslationDict {
    title: string;
    subtitle: string;
    start_diagnosis: string;
    select_age: string;
    hour_wage: string;
    annual_income: string;
    diagnosis_in_progress: string;
    calculating_loss: string;
    result_title: string;
    total_loss: string;
    recoverable_loss: string;
    improvement_roadmap: string;
    share_results: string;
    share_message_template: string;
    back: string;
    next: string;
    submit: string;
    currency_symbol: string;
    legal: {
        title: string;
        links: string;
        terms: {
            title: string;
            content: string[];
        };
        privacy: {
            title: string;
            content: string[];
        };
        back_to_diagnosis: string;
    };
    ui: {
        select_placeholder: string;
        manual_input: string;
        select_from_list: string;
        input_placeholder: string;
    };
}

const translations: Record<Locale, TranslationDict> = {
    'ja-JP': {
        title: '人生の生涯損失 診断レポート',
        subtitle: 'あなたの「先延ばし」を金額に換算します',
        start_diagnosis: '診断を開始する',
        select_age: '年齢を選択',
        hour_wage: '想定時給（円）',
        annual_income: '現在の年収（万円）',
        diagnosis_in_progress: '診断中...',
        calculating_loss: '脆弱性をスキャンしています...',
        result_title: '診断結果',
        total_loss: '生涯損失額',
        recoverable_loss: '今日からリカバー可能な金額',
        improvement_roadmap: '今日からの改善ロードマップ',
        share_results: '結果をシェアする',
        share_message_template: '生涯損失額は【{loss}】でした。最大のリスクは【{risk}】。\nあなたも人生の脆弱性をスキャンしませんか？ #人生の診断レポート',
        back: '戻る',
        next: '次へ',
        submit: '結果を見る',
        currency_symbol: '¥',
        legal: {
            title: 'LEGAL INFORMATION',
            links: '利用規約 / プライバシーポリシー',
            terms: {
                title: '利用規約',
                content: [
                    '本システム「Life Audit System」（以下「本サービス」）をご利用いただくにあたり、以下の規約に同意したものとみなします。',
                    'サービスの目的: 本サービスは、ユーザーの入力に基づいた推定的な損失額を算出するものであり、将来の結果を保証するものではありません。',
                    '免責事項: 本サービスの利用により生じた損害について、開発者は一切の責任を負いません。診断結果はあくまで一つの目安としてお楽しみください。',
                    '著作権: 本サービスのデザインおよびプログラムの著作権は、開発者「レボーナ」に帰属します。'
                ]
            },
            privacy: {
                title: 'プライバシーポリシー',
                content: [
                    '本サービスは、ユーザーのプライバシー保護を最優先事項として運営しています。',
                    'データの保持: 本サービスで入力された診断データ（年齢や年収、回答内容など）は、サーバーには一切保存されません。ブラウザのLocalStorage機能を使用して端末内にのみ一時保存されます。',
                    'クッキー（Cookie）の利用: サイトの利用状況分析や利便性向上のため、Google Analytics等のサービスを利用する場合があります。これにより、個人を特定しない情報の収集が行われることがあります。',
                    'アフィリエイトリンク: 本サービスは、広告配信（アフィリエイトプログラム）に参加しています。各リンク先での商品購入やサービス登録については、各運営元の規約に従ってください。'
                ]
            },
            back_to_diagnosis: '< 診断に戻る'
        },
        ui: {
            select_placeholder: '選択してください',
            manual_input: '数字を直接入力する',
            select_from_list: 'リストから選択する',
            input_placeholder: '金額を入力',
        }
    },
    'en-US': {
        title: 'Lifetime Loss Diagnosis Report',
        subtitle: 'Converting your "procrastination" into real numbers',
        start_diagnosis: 'Start Diagnosis',
        select_age: 'Select Age',
        hour_wage: 'Hourly Wage ($)',
        annual_income: 'Annual Income ($k)',
        diagnosis_in_progress: 'Diagnosing...',
        calculating_loss: 'Scanning vulnerabilities...',
        result_title: 'Diagnosis Result',
        total_loss: 'Lifetime Financial Loss',
        recoverable_loss: 'Recoverable Amount from Today',
        improvement_roadmap: 'Improvement Roadmap',
        share_results: 'Share Results',
        share_message_template: 'My estimated lifetime financial loss is {loss}. The biggest risk factor is {risk}.\nScan your life vulnerabilities now. #LifeAudit',
        back: 'Back',
        next: 'Next',
        submit: 'Show Results',
        currency_symbol: '$',
        legal: {
            title: 'LEGAL INFORMATION',
            links: 'Terms of Use / Privacy Policy',
            terms: {
                title: 'Terms of Use',
                content: [
                    'By using "Life Audit System" (hereinafter referred to as "this Service"), you are deemed to have agreed to the following terms.',
                    'Purpose: This Service calculates estimated financial losses based on user input and does not guarantee future results.',
                    'Disclaimer: The developer assumes no responsibility for any damages arising from the use of this Service. Please enjoy the diagnosis results as a reference only.',
                    'Copyright: The copyright of the design and program of this Service belongs to the developer "Levona".'
                ]
            },
            privacy: {
                title: 'Privacy Policy',
                content: [
                    'We operate this Service with the protection of user privacy as our top priority.',
                    'Data Retention: Diagnosis data entered in this Service (age, annual income, answers, etc.) is NOT saved on our servers. It is temporarily saved only on your device using the browser\'s LocalStorage function.',
                    'Use of Cookies: We may use services such as Google Analytics to analyze site usage and improve convenience. This may involve the collection of non-personally identifiable information.',
                    'Affiliate Links: This Service participates in affiliate programs. Please follow the terms of each operator regarding product purchases and service registrations at each link destination.'
                ]
            },
            back_to_diagnosis: '< BACK TO DIAGNOSIS'
        },
        ui: {
            select_placeholder: 'Please select',
            manual_input: 'Input number directly',
            select_from_list: 'Select from list',
            input_placeholder: 'Enter amount',
        }
    },
};

export function getTranslations(locale: Locale = 'ja-JP'): TranslationDict {
    return translations[locale] || translations['ja-JP'];
}

export function formatCurrency(amount: number, region: Region = 'JP', locale: Locale = 'ja-JP'): string {
    if (region === 'US' || locale === 'en-US') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    }
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
    }).format(amount);
}

export const REGION_CONFIG: Record<Region, { currency: string; defaultLocale: Locale }> = {
    JP: { currency: 'JPY', defaultLocale: 'ja-JP' },
    US: { currency: 'USD', defaultLocale: 'en-US' },
};
