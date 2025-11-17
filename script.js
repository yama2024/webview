// DOM要素の取得
const htmlInput = document.getElementById('htmlInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const maximizedOverlay = document.getElementById('maximizedOverlay');
const previewMaximized = document.getElementById('previewMaximized');
const closeMaximizeBtn = document.getElementById('closeMaximizeBtn');
const htmlModeBtn = document.getElementById('htmlModeBtn');
const mermaidModeBtn = document.getElementById('mermaidModeBtn');
const editorTitle = document.getElementById('editorTitle');

// 現在のモード管理
let currentMode = 'html'; // 'html' or 'mermaid'

// サンプルMermaidコード
const sampleMermaid = `graph LR
    A["企画段階"] --> B["グループ作成前"]
    B --> C["開催可能"]
    C --> D["開催済み"]
    D --> E["精算完了"]
    A -.->|自動通知| F["担当者チャット"]
    B -.->|自動作成| G["登壇者チャット"]
    C -.->|リマインド| H["参加者通知"]
    D -.->|自動集計| I["参加者データ"]
    style C fill:#4CAF50
    style E fill:#2196F3

---

graph TD
    A["時給3000円<br/>年収360万"] --> B["Larkコンサル<br/>年3件受注"]
    B --> C["年収738万"]
    C --> D["約2倍の収入"]
    style C fill:#4CAF50
    style D fill:#FFC107

---

graph TB
    Start["開始"] --> Input["データ入力"]
    Input --> Process["データ処理"]
    Process --> Decision{"条件判定"}
    Decision -->|Yes| Success["成功"]
    Decision -->|No| Error["エラー"]
    Error --> Input
    Success --> End["終了"]
    style Success fill:#4CAF50
    style Error fill:#f44336`;

// サンプルHTMLコード
const sampleHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(to bottom, #e0f7fa, #ffffff);
        }
        h1 {
            color: #00796b;
            text-align: center;
            border-bottom: 3px solid #00796b;
            padding-bottom: 10px;
        }
        .card {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .highlight {
            background: #ffeb3b;
            padding: 2px 5px;
            border-radius: 3px;
        }
        ul {
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <h1>サンプルHTMLページ</h1>

    <div class="card">
        <h2>ようこそ！</h2>
        <p>これは<span class="highlight">HTML Viewer</span>のサンプルページです。</p>
        <p>左側のエディタでHTMLコードを編集すると、リアルタイムでプレビューが更新されます。</p>
    </div>

    <div class="card">
        <h2>主な機能</h2>
        <ul>
            <li>リアルタイムHTMLプレビュー</li>
            <li>シンプルで使いやすいインターフェース</li>
            <li>レスポンシブデザイン対応</li>
            <li>安全なサンドボックス環境</li>
        </ul>
    </div>

    <div class="card">
        <h2>使い方</h2>
        <ol>
            <li>左側のテキストエリアにHTMLコードを入力</li>
            <li>自動的に右側にプレビューが表示されます</li>
            <li>「クリア」ボタンで内容をリセット</li>
        </ol>
    </div>
</body>
</html>`;

// HTMLプレビューを更新する関数
function updatePreview() {
    let htmlContent;

    if (currentMode === 'mermaid') {
        // Mermaidモード: Mermaid記法をHTMLに変換
        htmlContent = generateMermaidHTML(htmlInput.value);
    } else {
        // HTMLモード: そのまま表示
        htmlContent = htmlInput.value;
    }

    // 通常のプレビューiframeを更新
    const iframeDoc = preview.contentDocument || preview.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // 最大化プレビューiframeも更新
    const maximizedIframeDoc = previewMaximized.contentDocument || previewMaximized.contentWindow.document;
    maximizedIframeDoc.open();
    maximizedIframeDoc.write(htmlContent);
    maximizedIframeDoc.close();
}

// Mermaid記法をHTMLに変換する関数
function generateMermaidHTML(mermaidCode) {
    // 空の場合
    if (!mermaidCode.trim()) {
        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            color: #666;
        }
    </style>
</head>
<body>
    <p>Mermaid記法を入力してください...</p>
</body>
</html>`;
    }

    // ---で区切られた複数の図を処理
    const diagrams = mermaidCode.split(/\n---\n/).filter(d => d.trim());

    let diagramsHTML = diagrams.map((diagram, index) => {
        return `<div class="mermaid-container">
            <pre class="mermaid">${diagram.trim()}</pre>
        </div>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .mermaid-container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin: 20px auto;
            max-width: 1200px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow-x: auto;
        }
        .mermaid-container:first-child {
            margin-top: 0;
        }
        .mermaid {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
        }
        /* Mermaidのスタイルカスタマイズ */
        .mermaid svg {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${diagramsHTML}
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    </script>
</body>
</html>`;
}

// 入力時のイベントリスナー（リアルタイムプレビュー）
htmlInput.addEventListener('input', updatePreview);

// クリアボタンのイベントリスナー
clearBtn.addEventListener('click', () => {
    if (htmlInput.value.trim() === '' || confirm('入力内容をクリアしてもよろしいですか？')) {
        htmlInput.value = '';
        updatePreview();
    }
});

// サンプル読み込みボタンのイベントリスナー
sampleBtn.addEventListener('click', () => {
    if (htmlInput.value.trim() === '' || confirm('現在の内容をサンプルで上書きしてもよろしいですか？')) {
        if (currentMode === 'mermaid') {
            htmlInput.value = sampleMermaid;
        } else {
            htmlInput.value = sampleHTML;
        }
        updatePreview();
    }
});

// モード切り替え機能
function switchMode(mode) {
    currentMode = mode;

    // ボタンのアクティブ状態を切り替え
    if (mode === 'html') {
        htmlModeBtn.classList.add('active');
        mermaidModeBtn.classList.remove('active');
        editorTitle.textContent = 'HTMLコード入力';
        htmlInput.placeholder = 'ここにHTMLコードを入力してください...\n\n例:\n<h1>こんにちは</h1>\n<p>これはサンプルです</p>';
    } else {
        htmlModeBtn.classList.remove('active');
        mermaidModeBtn.classList.add('active');
        editorTitle.textContent = 'Mermaid図表コード入力';
        htmlInput.placeholder = 'ここにMermaid記法を入力してください...\n\n例:\ngraph TD\n    A[開始] --> B[処理]\n    B --> C[終了]';
    }

    // LocalStorageにモードを保存
    localStorage.setItem('htmlViewerMode', mode);

    // プレビューを更新
    updatePreview();
}

// モード切り替えボタンのイベントリスナー
htmlModeBtn.addEventListener('click', () => switchMode('html'));
mermaidModeBtn.addEventListener('click', () => switchMode('mermaid'));

// ページ読み込み時の初期化
window.addEventListener('DOMContentLoaded', () => {
    // 保存されたモードを復元
    const savedMode = localStorage.getItem('htmlViewerMode');
    if (savedMode && (savedMode === 'html' || savedMode === 'mermaid')) {
        switchMode(savedMode);
    }

    // 保存されたコンテンツを復元
    const savedContent = localStorage.getItem('htmlViewerContent');
    if (savedContent) {
        htmlInput.value = savedContent;
        updatePreview();
    } else {
        // 保存されていない場合はサンプルを表示
        if (currentMode === 'mermaid') {
            htmlInput.value = sampleMermaid;
        } else {
            htmlInput.value = sampleHTML;
        }
        updatePreview();
    }
});

// LocalStorageに自動保存する機能
htmlInput.addEventListener('input', () => {
    localStorage.setItem('htmlViewerContent', htmlInput.value);
});

// ===== 最大化機能 =====

// プレビューを最大化する関数
function maximizePreview() {
    maximizedOverlay.classList.remove('hidden');
    // body のスクロールを無効化
    document.body.style.overflow = 'hidden';
}

// プレビューを閉じる関数
function closeMaximize() {
    maximizedOverlay.classList.add('hidden');
    // body のスクロールを有効化
    document.body.style.overflow = '';
}

// 最大化ボタンのイベントリスナー
maximizeBtn.addEventListener('click', maximizePreview);

// 閉じるボタンのイベントリスナー
closeMaximizeBtn.addEventListener('click', closeMaximize);

// ESCキーで閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !maximizedOverlay.classList.contains('hidden')) {
        closeMaximize();
    }
});

// オーバーレイの背景をクリックして閉じる（オプション）
maximizedOverlay.addEventListener('click', (e) => {
    if (e.target === maximizedOverlay) {
        closeMaximize();
    }
});
