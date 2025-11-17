// DOM要素の取得
const htmlInput = document.getElementById('htmlInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const maximizedOverlay = document.getElementById('maximizedOverlay');
const previewMaximized = document.getElementById('previewMaximized');
const closeMaximizeBtn = document.getElementById('closeMaximizeBtn');
const saveHistoryBtn = document.getElementById('saveHistoryBtn');
const historyBtn = document.getElementById('historyBtn');
const historyOverlay = document.getElementById('historyOverlay');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');
const historyContent = document.getElementById('historyContent');
const historyCount = document.getElementById('historyCount');

// サンプル統合コード（HTML + Mermaid）
const sampleCode = `<h1>HTML & Mermaid Visualizer の使い方</h1>
<p>このツールでは、HTMLとMermaid図表を組み合わせた文書を簡単に作成できます。</p>

<h2>1. 基本的なフローチャート</h2>
<p>Mermaid図表は <code>\`\`\`mermaid</code> と <code>\`\`\`</code> で囲みます。</p>

\`\`\`mermaid
flowchart LR
    A[開始] --> B[処理]
    B --> C[完了]
    style B fill:#4CAF50
\`\`\`

<h2>2. 縦方向のフロー</h2>
<p>flowchart TBで上から下への流れを表現できます。</p>

\`\`\`mermaid
flowchart TB
    Start[スタート] --> Step1[ステップ1]
    Step1 --> Step2[ステップ2]
    Step2 --> Finish[完了]
    style Start fill:#2196F3
    style Finish fill:#4CAF50
\`\`\`

<h2>3. 条件分岐の表現</h2>
<p>菱形{}を使って条件分岐を表現できます。</p>

\`\`\`mermaid
flowchart TD
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
    <li>Mermaid 10.x系では <code>flowchart</code> を使用（<code>graph</code> は非推奨）</li>
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
        const mermaidHTML = `<div class="mermaid-diagram"><div class="mermaid">${code}</div></div>`;
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
            text-align: center;
        }
        .mermaid {
            display: block;
            text-align: center;
            min-height: 200px;
        }
        .mermaid svg {
            max-width: 100%;
            height: auto;
            display: inline-block;
        }
    </style>
</head>
<body>
    ${processedHTML}
    <script>
        // Mermaidライブラリが読み込まれるまで待機
        async function initializeMermaid() {
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
                    setTimeout(async function() {
                        try {
                            await mermaid.run({
                                querySelector: '.mermaid'
                            });
                        } catch (error) {
                            console.error('Mermaid rendering error:', error);
                        }
                    }, 300);
                } catch (error) {
                    console.error('Mermaid initialization error:', error);
                }
            } else {
                setTimeout(initializeMermaid, 100);
            }
        }

        // ページロード後に初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMermaid);
        } else {
            initializeMermaid();
        }
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
    if (e.key === 'Escape') {
        if (!maximizedOverlay.classList.contains('hidden')) {
            closeMaximize();
        } else if (!historyOverlay.classList.contains('hidden')) {
            closeHistory();
        }
    }
});

// オーバーレイの背景をクリックして閉じる（オプション）
maximizedOverlay.addEventListener('click', (e) => {
    if (e.target === maximizedOverlay) {
        closeMaximize();
    }
});

// ===== 履歴管理機能 =====

// 履歴の保存・読み込み
const HISTORY_STORAGE_KEY = 'htmlViewerHistories';
const MAX_HISTORY_COUNT = 20;

// 履歴を取得する関数
function getHistories() {
    try {
        const histories = localStorage.getItem(HISTORY_STORAGE_KEY);
        return histories ? JSON.parse(histories) : [];
    } catch (error) {
        console.error('履歴の読み込みエラー:', error);
        return [];
    }
}

// 履歴を保存する関数
function saveHistories(histories) {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(histories));
    } catch (error) {
        console.error('履歴の保存エラー:', error);
        alert('履歴の保存に失敗しました。LocalStorageの容量を確認してください。');
    }
}

// タイトルを自動生成する関数
function generateTitle(content) {
    // <h1>タグからタイトルを抽出
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1].trim()) {
        // HTMLタグを除去
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = h1Match[1];
        return tempDiv.textContent.trim().substring(0, 50);
    }

    // <h1>がない場合は日時をタイトルにする
    const now = new Date();
    return `保存 ${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// 現在のコンテンツを履歴に保存する関数
function saveToHistory() {
    const content = htmlInput.value.trim();

    if (!content) {
        alert('保存するコンテンツがありません');
        return;
    }

    const histories = getHistories();
    const timestamp = Date.now();
    const title = generateTitle(content);
    const preview = content.substring(0, 100);

    // 新しい履歴アイテムを作成
    const newHistoryItem = {
        id: timestamp.toString(),
        title: title,
        content: content,
        timestamp: timestamp,
        preview: preview
    };

    // 履歴の先頭に追加
    histories.unshift(newHistoryItem);

    // 上限を超えた場合は古いものを削除
    if (histories.length > MAX_HISTORY_COUNT) {
        histories.splice(MAX_HISTORY_COUNT);
    }

    saveHistories(histories);
    updateHistoryDisplay();
    alert('履歴に保存しました');
}

// 履歴表示を更新する関数
function updateHistoryDisplay() {
    const histories = getHistories();
    historyCount.textContent = histories.length;

    if (histories.length === 0) {
        historyContent.innerHTML = '<p class="history-empty">保存された履歴がありません</p>';
        return;
    }

    // グリッド表示を作成
    const gridHTML = histories.map(item => {
        const date = new Date(item.timestamp);
        const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

        return `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-title" title="${item.title}">${item.title}</div>
                <div class="history-item-date">${dateStr}</div>
                <div class="history-item-preview">${item.preview.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                <div class="history-item-actions">
                    <button class="btn btn-primary btn-load-history" data-id="${item.id}">読み込み</button>
                    <button class="btn btn-danger btn-delete-history" data-id="${item.id}">削除</button>
                </div>
            </div>
        `;
    }).join('');

    historyContent.innerHTML = `<div class="history-grid">${gridHTML}</div>`;

    // イベントリスナーを設定
    document.querySelectorAll('.btn-load-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            loadHistoryItem(id);
        });
    });

    document.querySelectorAll('.btn-delete-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteHistoryItem(id);
        });
    });
}

// 履歴アイテムを読み込む関数
function loadHistoryItem(id) {
    const histories = getHistories();
    const item = histories.find(h => h.id === id);

    if (!item) {
        alert('履歴が見つかりませんでした');
        return;
    }

    if (htmlInput.value.trim() !== '' && !confirm('現在の内容を履歴で上書きしてもよろしいですか？')) {
        return;
    }

    htmlInput.value = item.content;
    updatePreview();
    closeHistory();
    alert('履歴を読み込みました');
}

// 履歴アイテムを削除する関数
function deleteHistoryItem(id) {
    if (!confirm('この履歴を削除してもよろしいですか？')) {
        return;
    }

    let histories = getHistories();
    histories = histories.filter(h => h.id !== id);
    saveHistories(histories);
    updateHistoryDisplay();
}

// 全履歴を削除する関数
function clearAllHistory() {
    if (!confirm('全ての履歴を削除してもよろしいですか？この操作は取り消せません。')) {
        return;
    }

    localStorage.removeItem(HISTORY_STORAGE_KEY);
    updateHistoryDisplay();
    alert('全ての履歴を削除しました');
}

// 履歴モーダルを開く関数
function openHistory() {
    updateHistoryDisplay();
    historyOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// 履歴モーダルを閉じる関数
function closeHistory() {
    historyOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

// イベントリスナー
saveHistoryBtn.addEventListener('click', saveToHistory);
historyBtn.addEventListener('click', openHistory);
closeHistoryBtn.addEventListener('click', closeHistory);
clearAllHistoryBtn.addEventListener('click', clearAllHistory);

// オーバーレイの背景をクリックして閉じる
historyOverlay.addEventListener('click', (e) => {
    if (e.target === historyOverlay) {
        closeHistory();
    }
});
