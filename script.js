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
const sampleCode = `<h1>プロジェクト管理フロー</h1>
<p>このページでは、HTMLとMermaid図表を統合して表示できます。</p>

<h2>ワークフローの流れ</h2>
<p>以下の図は、企画から精算完了までのプロセスを示しています。</p>

\`\`\`mermaid
graph LR
    A[企画段階] --> B[グループ作成前]
    B --> C[開催可能]
    C --> D[開催済み]
    D --> E[精算完了]
    A -.->|自動通知| F[担当者チャット]
    B -.->|自動作成| G[登壇者チャット]
    C -.->|リマインド| H[参加者通知]
    D -.->|自動集計| I[参加者データ]
    style C fill:#4CAF50
    style E fill:#2196F3
\`\`\`

<h2>収入比較分析</h2>
<p>時給制とコンサル受注の収入を比較したグラフです。</p>

\`\`\`mermaid
graph TD
    A[時給3000円-年収360万] --> B[Larkコンサル-年3件受注]
    B --> C[年収738万]
    C --> D[約2倍の収入]
    style C fill:#4CAF50
    style D fill:#FFC107
\`\`\`

<h2>データ処理フロー</h2>

\`\`\`mermaid
graph TB
    Start[開始] --> Input[データ入力]
    Input --> Process[データ処理]
    Process --> Decision{条件判定}
    Decision -->|Yes| Success[成功]
    Decision -->|No| Error[エラー]
    Error --> Input
    Success --> End[終了]
    style Success fill:#4CAF50
    style Error fill:#f44336
\`\`\`

<hr>
<p><strong>注意:</strong> Mermaid図表は <code>\`\`\`mermaid</code> ブロックで囲んでください。</p>`;

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
