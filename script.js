// DOM要素の取得
const htmlInput = document.getElementById('htmlInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const maximizedOverlay = document.getElementById('maximizedOverlay');
const previewMaximized = document.getElementById('previewMaximized');
const closeMaximizeBtn = document.getElementById('closeMaximizeBtn');

// サンプル統合コード（HTML + Mermaid）
const sampleCode = `<h1>HTML & Mermaid Visualizer の使い方</h1>
<p>このツールでは、HTMLとMermaid図表を組み合わせた文書を簡単に作成できます。</p>

<h2>1. 基本的なフローチャート</h2>
<p>Mermaid図表は <code>\`\`\`mermaid</code> と <code>\`\`\`</code> で囲みます。</p>

\`\`\`mermaid
graph LR
    A[開始] --> B[処理]
    B --> C[完了]
    style B fill:#4CAF50
\`\`\`

<h2>2. 縦方向のフロー</h2>
<p>graph TBで上から下への流れを表現できます。</p>

\`\`\`mermaid
graph TB
    Start[スタート] --> Step1[ステップ1]
    Step1 --> Step2[ステップ2]
    Step2 --> End[終了]
    style Start fill:#2196F3
    style End fill:#4CAF50
\`\`\`

<h2>3. 条件分岐の表現</h2>
<p>菱形{}を使って条件分岐を表現できます。</p>

\`\`\`mermaid
graph TD
    A[開始] --> B{判定}
    B --> C[YES]
    B --> D[NO]
    C --> E[終了]
    D --> E
    style B fill:#FFC107
    style E fill:#4CAF50
\`\`\`

<hr>
<h2>使い方のポイント</h2>
<ul>
    <li>ノードラベルは角括弧で囲む: <code>A[ラベル]</code></li>
    <li>矢印は <code>--&gt;</code> を使用</li>
    <li>色付けは <code>style ノード名 fill:#色コード</code></li>
    <li>HTMLとMermaidを自由に組み合わせ可能</li>
</ul>

<p><strong>ヒント:</strong> 左側のテキストエリアで編集すると、右側にリアルタイムでプレビューが表示されます。</p>`;

// HTMLプレビューを更新する関数
function updatePreview() {
    // 入力されたコードから```mermaidブロックを検出して統合HTMLを生成
    const htmlContent = generateIntegratedHTML(htmlInput.value);

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

// HTML + Mermaid統合コードを生成する関数
function generateIntegratedHTML(inputCode) {
    // 空の場合
    if (!inputCode.trim()) {
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
    <p>HTMLコードまたはMermaid記法を入力してください...</p>
</body>
</html>`;
    }

    // 完全なHTMLドキュメントかどうかを判定
    const isCompleteHTML = /<!DOCTYPE\s+html/i.test(inputCode) ||
                           /<html[\s>]/i.test(inputCode) ||
                           (/<head[\s>]/i.test(inputCode) && /<body[\s>]/i.test(inputCode));

    // 完全なHTMLドキュメントの場合はそのまま返す
    if (isCompleteHTML) {
        return inputCode;
    }

    // ```mermaid ブロックを検出して置換（部分的なHTMLの場合）
    let processedHTML = inputCode;
    const mermaidBlocks = [];
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    let match;
    let index = 0;

    // Mermaidブロックを一時的にプレースホルダーに置き換え
    while ((match = mermaidRegex.exec(inputCode)) !== null) {
        const mermaidCode = match[1].trim();
        mermaidBlocks.push(mermaidCode);
        processedHTML = processedHTML.replace(match[0], `___MERMAID_PLACEHOLDER_${index}___`);
        index++;
    }

    // プレースホルダーをMermaid HTMLに置き換え
    mermaidBlocks.forEach((code, idx) => {
        const mermaidHTML = `<div class="mermaid-diagram"><pre class="mermaid">${code}</pre></div>`;
        processedHTML = processedHTML.replace(`___MERMAID_PLACEHOLDER_${idx}___`, mermaidHTML);
    });

    // 完全なHTMLドキュメントを生成
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            line-height: 1.8;
            color: #333;
        }
        h1, h2, h3 {
            color: #2c3e50;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 { font-size: 2.5em; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        h2 { font-size: 2em; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
        h3 { font-size: 1.5em; }
        p { margin: 1em 0; }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        hr {
            border: none;
            border-top: 2px solid #ddd;
            margin: 2em 0;
        }
        .mermaid-diagram {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow-x: auto;
        }
        .mermaid {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
        }
        .mermaid svg {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${processedHTML}
    <script>
        // Mermaidライブラリが読み込まれるまで待機
        function initializeMermaid() {
            if (typeof mermaid !== 'undefined') {
                try {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'default',
                        themeVariables: {
                            fontSize: '16px'
                        },
                        flowchart: {
                            useMaxWidth: true,
                            htmlLabels: true,
                            curve: 'basis'
                        },
                        securityLevel: 'loose',
                        logLevel: 'error'
                    });

                    // すべての.mermaid要素をレンダリング
                    setTimeout(function() {
                        try {
                            mermaid.run({
                                querySelector: '.mermaid'
                            }).catch(function(error) {
                                console.error('Mermaid rendering error:', error);
                            });
                        } catch (e) {
                            console.error('Mermaid run error:', e);
                        }
                    }, 200);
                } catch (error) {
                    console.error('Mermaid initialization error:', error);
                }
            } else {
                setTimeout(initializeMermaid, 100);
            }
        }

        // ページロード後に初期化
        window.addEventListener('load', initializeMermaid);
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
        htmlInput.value = sampleCode;
        updatePreview();
    }
});

// ページ読み込み時の初期化
window.addEventListener('DOMContentLoaded', () => {
    // 保存されたコンテンツを復元
    const savedContent = localStorage.getItem('htmlViewerContent');
    if (savedContent) {
        htmlInput.value = savedContent;
        updatePreview();
    } else {
        // 保存されていない場合はサンプルを表示
        htmlInput.value = sampleCode;
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
