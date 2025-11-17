# CLAUDE.md - 開発者・AI向けプロジェクトドキュメント

## プロジェクト概要

HTML & Mermaid Visualizer は、HTMLとMermaid図表を統合してリアルタイムプレビュー表示するWebアプリケーションです。

### 主な目的
- HTMLとMermaid.jsの統合可視化
- リアルタイムプレビュー機能
- ブラウザベースの軽量ツール
- 学習・デモンストレーション用途

### 技術スタック
- **フロントエンド**: Vanilla JavaScript (ES6+)
- **スタイリング**: CSS3 (Grid Layout, Flexbox, Animations)
- **図表ライブラリ**: Mermaid.js v10.x
- **ストレージ**: LocalStorage API
- **セキュリティ**: iframe sandbox 属性

---

## 開発履歴

### Phase 1: 基本機能実装
- HTML入力とリアルタイムプレビュー
- iframe sandboxによる安全な表示
- グリッドレイアウトによるUI構築

### Phase 2: Mermaid統合
- ```mermaidブロック自動検出
- HTMLとMermaidの統合プレビュー
- 複数のMermaid図表対応

### Phase 3: Mermaid 10.x構文修正
**課題**: Mermaid 10.9.5/10.6.1でsyntax errorが発生

**修正内容**:
1. `graph` → `flowchart` への変更（v10.x推奨構文）
2. 予約語 `End` → `Finish` へ変更
3. ノードラベルの二重引用符削除: `A["label"]` → `A[label]`
4. `<pre class="mermaid">` → `<div class="mermaid">` へ変更
5. CSS `display: flex` → `display: block` へ変更（SVG injection問題）
6. `mermaid.run()` の async/await 対応

**関連コミット**:
- `3ee3f00` - Fix Mermaid syntax error for version 10.9.5
- `f3e5b60` - Fix Mermaid diagram rendering functionality
- `028e72c` - Fix Mermaid rendering issue - correct HTML structure and async handling

### Phase 4: UI/UX拡張
- プレビュー最大化機能（フルスクリーンモード）
- ESCキーによるモーダル閉じる機能
- レスポンシブデザイン対応

### Phase 5: 履歴管理機能
**実装内容**:
- LocalStorageベースの履歴保存（最大20件）
- `<h1>`タグからの自動タイトル抽出
- グリッド表示のモーダルUI
- 読み込み・削除・一括削除機能
- 上書き確認ダイアログ

**追加ファイル**:
- `index.html`: 履歴モーダルHTML構造追加
- `styles.css`: 履歴UI用CSS追加（214行）
- `script.js`: 履歴管理ロジック追加（209行）

**関連コミット**:
- `2bc17a2` - Add history management feature with LocalStorage

### Phase 6: 機能拡張リサーチ
- 10カテゴリ、50+機能の調査
- 優先度・実装難易度の分析
- 競合分析（CodePen, JSFiddle, Mermaid Live Editor）
- `FEATURE_IDEAS.md` 作成（394行）

**関連コミット**:
- `7fb8d90` - Add comprehensive feature research document

---

## 技術的実装詳細

### Mermaidレンダリングメカニズム

#### HTML生成プロセス
```javascript
// 1. ```mermaidブロックを正規表現で検出
const mermaidRegex = /```mermaid\s*([\s\S]*?)```/g;

// 2. プレースホルダーに置換
processedHTML = processedHTML.replace(match[0], `___MERMAID_PLACEHOLDER_${index}___`);

// 3. Mermaid用HTMLに変換
const mermaidHTML = `<div class="mermaid-diagram"><div class="mermaid">${code}</div></div>`;

// 4. 完全なHTMLドキュメント生成（Mermaid CDN含む）
```

#### 重要な注意点
- **HTMLタグ**: `<div class="mermaid">` を使用（`<pre>` は不可）
- **CSS display**: `display: block` を使用（`flex` は不可）
- **非同期レンダリング**: `await mermaid.run()` を使用
- **遅延実行**: `setTimeout` で300ms待機してから `mermaid.run()` 実行

#### Mermaid初期化コード
```javascript
async function initializeMermaid() {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            logLevel: 'error'
        });

        setTimeout(async function() {
            await mermaid.run({ querySelector: '.mermaid' });
        }, 300);
    }
}
```

### 履歴管理システム

#### データ構造
```javascript
{
    id: "1699123456789",           // timestamp
    title: "タイトル（自動生成）",
    content: "完全なHTMLコンテンツ",
    timestamp: 1699123456789,
    preview: "最初の100文字..."
}
```

#### LocalStorage管理
- **キー**: `htmlViewerHistories`
- **最大件数**: 20件（FIFO方式）
- **タイトル生成**: `<h1>` タグから抽出、なければ日時

#### 履歴操作フロー
1. **保存**: `saveToHistory()` → 配列先頭に追加 → 20件超過分削除
2. **読み込み**: `loadHistoryItem(id)` → 確認ダイアログ → テキストエリア更新
3. **削除**: `deleteHistoryItem(id)` → 配列から除外 → LocalStorage更新
4. **表示更新**: `updateHistoryDisplay()` → グリッドHTML生成 → イベントリスナー設定

### セキュリティ考慮事項

#### iframe sandbox属性
```html
<iframe sandbox="allow-same-origin allow-scripts"></iframe>
```

- `allow-same-origin`: LocalStorage、Mermaidレンダリングに必要
- `allow-scripts`: Mermaid.jsの実行に必要
- 制限: フォーム送信、ポップアップ、トップレベルナビゲーションは禁止

#### XSS対策
- ユーザー入力はiframe内に隔離
- 履歴プレビューでHTMLエスケープ: `replace(/</g, '&lt;')`

---

## ファイル構成

```
/webview
├── index.html              # メインHTML（99行）
├── styles.css              # スタイルシート（519行）
├── script.js               # JavaScriptロジック（515行）
├── README.md              # ユーザー向けドキュメント
├── CLAUDE.md              # このファイル（開発者・AI向け）
└── FEATURE_IDEAS.md       # 機能拡張アイデア集
```

---

## 既知の問題と制約

### Mermaid構文制約
- Mermaid 10.x系では `flowchart` を使用（`graph` は非推奨）
- 予約語（`end`, `End`など）はノード名に使用不可
- エッジラベル（`-->|label|`）は構文エラーの原因になりやすい
- `<br>` タグは使用不可

### ブラウザ互換性
- LocalStorage対応ブラウザが必須
- Mermaid.js v10はモダンブラウザ推奨（Chrome, Firefox, Safari, Edge）

### パフォーマンス
- 大量のMermaid図表（10+）でレンダリング遅延の可能性
- LocalStorage容量制限（約5MB）

---

## 今後の拡張計画

詳細は `FEATURE_IDEAS.md` を参照してください。

### 最優先（実装容易＆効果大）
1. **HTMLファイルエクスポート** - Blob APIで実装可能
2. **シンタックスハイライト** - highlight.js/Prism導入
3. **行番号表示** - CSSで実装可能
4. **検索/置換機能** - 正規表現+DOM操作

### 高優先度
5. **PNG/SVG画像エクスポート** - html2canvas/dom-to-image
6. **ファイルインポート（ドラッグ&ドロップ）** - File API + Drag and Drop API
7. **レスポンシブプレビュー** - iframe幅動的変更
8. **エディタテーマ（ダークモード）** - CSS変数

---

## 開発時の注意事項

### Mermaidデバッグ
1. ブラウザコンソールで `mermaid.initialize()` の状態確認
2. `logLevel: 'debug'` に変更して詳細ログ出力
3. Mermaid Live Editorで構文検証: https://mermaid.live/

### Git開発フロー
- **ブランチ**: `claude/plan-html-viewer-app-01MwjyKch2M7SYDjncRHktC5`
- **コミットメッセージ**: 英語、具体的な変更内容を記載
- **既存機能の保護**: 全ての変更で既存機能が壊れないことを確認

### テスト項目
- [ ] HTMLのみの入力
- [ ] Mermaidのみの入力（```mermaidブロック）
- [ ] HTML + Mermaid混在
- [ ] 複数のMermaid図表
- [ ] 完全なHTMLドキュメント（<!DOCTYPE html>含む）
- [ ] 履歴保存・読み込み・削除
- [ ] 最大化モード
- [ ] レスポンシブ表示（モバイル）

---

## コード規約

### JavaScript
- ES6+構文使用
- `const`/`let` を使用（`var` 禁止）
- async/await for 非同期処理
- 関数名: キャメルケース（`updatePreview`）
- 定数: スネークケース大文字（`HISTORY_STORAGE_KEY`）

### CSS
- BEM的な命名（`history-item-title`）
- CSS GridとFlexboxの活用
- CSS変数は使用していない（将来的に導入検討）
- レスポンシブ: `@media (max-width: 768px)`

### HTML
- セマンティックHTML使用
- 属性順序: id → class → data-* → その他
- インデント: 4スペース

---

## 参考リンク

- **Mermaid公式**: https://mermaid.js.org/
- **Mermaid Live Editor**: https://mermaid.live/
- **MDN iframe sandbox**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
- **LocalStorage API**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

## ライセンス

MIT License

---

## 最終更新

2025-11-17 - FEATURE_IDEAS.md追加、履歴機能実装完了
