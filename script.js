// DOM要素の取得
const htmlInput = document.getElementById('htmlInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const maximizedOverlay = document.getElementById('maximizedOverlay');
const previewMaximized = document.getElementById('previewMaximized');
const closeMaximizeBtn = document.getElementById('closeMaximizeBtn');

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
    const htmlContent = htmlInput.value;

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
        htmlInput.value = sampleHTML;
        updatePreview();
    }
});

// ページ読み込み時の初期化
window.addEventListener('DOMContentLoaded', () => {
    // 初期表示としてサンプルを読み込む
    if (htmlInput.value.trim() === '') {
        htmlInput.value = sampleHTML;
        updatePreview();
    }
});

// LocalStorageに自動保存する機能（オプション）
// 入力内容を保存
htmlInput.addEventListener('input', () => {
    localStorage.setItem('htmlViewerContent', htmlInput.value);
});

// ページ読み込み時に保存された内容を復元
window.addEventListener('DOMContentLoaded', () => {
    const savedContent = localStorage.getItem('htmlViewerContent');
    if (savedContent) {
        htmlInput.value = savedContent;
        updatePreview();
    }
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
