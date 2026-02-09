# CLAUDE.md - プロジェクトルール

## 開発ルール

### 設計書の同期
**重要**: コードを改修した場合は、必ず `設計書.md` も更新すること。

更新が必要なケース:
- 新しいファイルの追加・削除
- 型定義の変更（`types/audit.ts`）
- 質問の追加・変更・削除（`lib/questions.ts`）
- 計算ロジックの変更（`lib/AuditEngine.ts`）
- APIエンドポイントの変更（`app/api/`）
- コンポーネントの追加・変更（`components/`）
- 依存パッケージの追加・削除（`package.json`）

設計書で更新すべきセクション:
- ディレクトリ構成（セクション3）
- データモデル設計（セクション4）
- 質問データ設計（セクション5）
- 損失計算エンジン（セクション6）
- UI/UX設計（セクション7）
- API設計（セクション8）
- 技術スタック（セクション1.3）

## プロジェクト概要

- **名前**: Life Audit System
- **目的**: 先延ばし習慣による生涯損失額の診断
- **技術**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion

## コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
npm run start  # 本番サーバー起動
npm run lint   # ESLint実行
```

## ファイル構成

- `app/` - Next.js App Router
- `components/ui/` - UIコンポーネント
- `lib/` - ビジネスロジック（質問、計算エンジン）
- `types/` - TypeScript型定義
- `設計書.md` - システム設計書（コード改修時に同期更新必須）
