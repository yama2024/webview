# HTML & Mermaid Visualizer

シンプルなHTML＋Mermaid図表の統合ビジュアライザー

## クイックスタート

1. `index.html` をブラウザで開く
2. テキストエリアにHTMLとMermaidコードを入力
3. リアルタイムでプレビューが表示されます

## 基本的な使い方

### HTMLとMermaidを組み合わせる

```html
<h1>タイトル</h1>
<p>説明文</p>

```mermaid
flowchart LR
    A[開始] --> B[処理] --> C[完了]
```

<p>続きのテキスト</p>
```

### ボタン機能

- **クリア**: 入力内容をクリア
- **サンプルを読み込む**: チュートリアルサンプルを表示
- **履歴を保存**: 現在の内容を保存（最大20件）
- **履歴**: 保存した履歴を管理
- **最大化**: プレビューを全画面表示

## 主な機能

| 機能 | 説明 |
|------|------|
| リアルタイムプレビュー | 入力と同時にプレビュー更新 |
| Mermaid統合 | ```mermaidブロックで図表挿入 |
| 履歴管理 | LocalStorageに自動保存 |
| 最大化モード | プレビューを全画面表示 |
| 安全性 | iframe sandboxで隔離 |

## Mermaid構文の注意点

### 推奨される構文（Mermaid 10.x）

```mermaid
flowchart LR
    A[ノード1] --> B[ノード2]
    B --> C[ノード3]
    style A fill:#4CAF50
```

### 避けるべき構文

- ❌ `graph LR` → ✅ `flowchart LR` を使用
- ❌ `End[終了]` → ✅ `Finish[完了]` （予約語を避ける）
- ❌ `A["ラベル"]` → ✅ `A[ラベル]` （二重引用符不要）
- ❌ `A -->|テキスト| B` → ✅ `A --> B` （エッジラベル避ける）

## ファイル構成

```
/webview
├── index.html          # メインHTML
├── styles.css          # スタイルシート
├── script.js           # JavaScriptロジック
├── README.md          # 詳細ドキュメント（日本語）
├── readme.md          # このファイル（クイックガイド）
├── CLAUDE.md          # 開発者・AI向けドキュメント
└── FEATURE_IDEAS.md   # 機能拡張アイデア集
```

## ブラウザ対応

- ✅ Chrome（推奨）
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 技術スタック

- Vanilla JavaScript（ES6+）
- CSS3（Grid、Flexbox）
- Mermaid.js v10.x
- LocalStorage API

## ドキュメント

- **エンドユーザー向け**: `README.md` を参照
- **開発者・AI向け**: `CLAUDE.md` を参照
- **機能拡張計画**: `FEATURE_IDEAS.md` を参照

## ライセンス

MIT License

## 開発

```bash
# ファイルをブラウザで開くだけ - ビルド不要
open index.html

# または
python3 -m http.server 8000
# http://localhost:8000/ にアクセス
```

## サポート

このプロジェクトは学習・デモンストレーション目的で作成されました。
