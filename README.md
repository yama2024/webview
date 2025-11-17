# HTML & Mermaid Visualizer

HTMLとMermaid図表を統合してリアルタイムプレビュー表示するWEBアプリケーションです。1つのページでHTMLとMermaid図表を同時に表示できます。

## 特徴

- **統合プレビュー**: HTMLとMermaid図表を1つのページで同時表示
- **リアルタイムプレビュー**: コードを入力すると即座にプレビューが更新されます
- **Markdownスタイル**: \`\`\`mermaidブロックで図表を埋め込み
- **プレビュー最大化**: 全画面でプレビューを表示可能
- **シンプルなUI**: 直感的で使いやすいインターフェース
- **レスポンシブデザイン**: PC・タブレット・スマートフォンに対応
- **安全性**: iframeのsandbox属性により安全にHTMLを表示
- **自動保存**: 入力内容をLocalStorageに自動保存
- **サンプル機能**: ワンクリックでサンプルコードを読み込み可能

## 使い方

1. `index.html` をブラウザで開く
2. 左側のテキストエリアにHTMLとMermaidコードを入力
3. 右側のプレビューエリアに統合された結果が自動表示されます

### 基本的な記述方法

このアプリケーションは2つの入力方法をサポートしています:

#### 1. 部分的なHTML + Mermaidブロック記法

HTMLとMermaid図表を組み合わせて記述できます。Mermaid図表は\`\`\`mermaidブロックで囲んでください。

**例:**
```html
<h1>プロジェクト概要</h1>
<p>プロジェクトのワークフローを以下に示します。</p>

\`\`\`mermaid
graph LR
    A[開始] --> B[処理]
    B --> C[終了]
    style B fill:#4CAF50
\`\`\`

<p>上記のフローで処理を進めます。</p>
```

#### 2. 完全なHTMLドキュメント

完全なHTMLドキュメント（`<!DOCTYPE html>`、`<html>`、`<head>`、`<body>`タグを含む）を入力することもできます。この場合、アプリケーションはそのまま表示します。

**例:**
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
</head>
<body>
    <h1>サンプルページ</h1>
    <div class="mermaid">
        graph TD
            A[開始] --> B[処理]
            B --> C[終了]
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true });
    </script>
</body>
</html>
```

### 複数のMermaid図表

複数のMermaid図表を同じページに表示することができます。それぞれを\`\`\`mermaidブロックで囲んでください。

**注意事項:**
- Mermaid 10.x系では`<br>`や`<br/>`タグの使用を避けてください
- ノードラベルは角括弧のみで囲み、ダブルクォートは不要です: `A[ラベル名]`
- 改行が必要な場合はハイフン`-`や中黒`・`を使用してテキストを区切ってください
- 推奨例: `A[時給3000円-年収360万]` や `A[時給3000円・年収360万]`
- 括弧を使う場合は全角に置き換えるとより安全です: `A[時給3000円（年収360万）]`

### ボタン機能

- **クリア**: 入力内容をすべて削除
- **サンプルを読み込む**: HTMLとMermaidを統合したサンプルコードを読み込み
- **最大化ボタン**: プレビューを全画面表示（ESCキーで閉じる）

## ファイル構成

```
/webview
├── index.html          # メインHTMLファイル
├── styles.css          # スタイルシート
├── script.js           # JavaScriptロジック
└── README.md          # このファイル
```

## 技術スタック

- **HTML5**: アプリケーションの構造
- **CSS3**: スタイリング（グリッドレイアウト、グラデーション、アニメーション）
- **Vanilla JavaScript**: プレビュー機能とモード切り替えの実装
- **Mermaid.js**: テキストから図表を生成するライブラリ

## セキュリティ

iframeに`sandbox="allow-same-origin allow-scripts"`属性を設定しています。
- `allow-same-origin`: 同一オリジンポリシーを許可
- `allow-scripts`: Mermaid図表レンダリングに必要なJavaScript実行を許可

ユーザー入力は信頼できないコードとして隔離されたiframe内で実行されるため、安全性が確保されています。

## ブラウザ対応

- Chrome（推奨）
- Firefox
- Safari
- Edge

## ライセンス

MIT License

## 開発者

このプロジェクトは学習・デモンストレーション目的で作成されました。
