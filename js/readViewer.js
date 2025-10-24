/**
 * えほんのくに - 絵本ビューワー（修正版）
 * 画像パスの問題を自動修正
 */

// 現在表示中の絵本データ
let currentStory = null;
let currentPage = 0;
let totalPages = 0;
let currentBookType = 'user';

// 画像URLを修正する関数
function fixImageUrl(url) {
    if (!url) return null;
    
    // 文字列の前後の余分な引用符を削除
    let fixedUrl = url.replace(/^["']|["']$/g, '');
    fixedUrl = fixedUrl.replace(/\\"/g, '');
    
    console.log('URL修正前:', url);
    console.log('URL修正後（ステップ1）:', fixedUrl);
    
    // Windowsの絶対パスを相対パスに変換
    if (fixedUrl.includes(':\\') || fixedUrl.includes(':/')) {
        // パスから必要な部分だけ抽出
        // "assets\images" または "assets/images" を探す
        const assetsIndex = fixedUrl.toLowerCase().indexOf('assets');
        if (assetsIndex !== -1) {
            fixedUrl = fixedUrl.substring(assetsIndex);
        }
        
        // バックスラッシュをスラッシュに変換
        fixedUrl = fixedUrl.replace(/\\/g, '/');
        
        console.log('URL修正後（ステップ2）:', fixedUrl);
    }
    
    // 先頭のスラッシュやバックスラッシュを削除
    fixedUrl = fixedUrl.replace(/^[\/\\]+/, '');
    
    console.log('最終的なURL:', fixedUrl);
    return fixedUrl;
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');
    const bookType = urlParams.get('type') || 'user';
    
    console.log('====================');
    console.log('読み込み開始');
    console.log('====================');
    console.log('絵本ID:', storyId);
    console.log('絵本タイプ:', bookType);
    
    currentBookType = bookType;
    
    if (storyId) {
        loadStory(storyId, bookType);
    } else {
        showError('絵本IDが指定されていません');
    }
    
    // ナビゲーションボタンのイベント
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    
    // キーボードイベント
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevPage();
        else if (e.key === 'ArrowRight') nextPage();
    });
    
    // 戻るボタン
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            navigate(currentBookType === 'official' ? 'read-list.html' : 'user-books.html');
        });
    }
});

// 絵本データを読み込む
function loadStory(storyId, bookType = 'user') {
    console.log('====================');
    console.log('絵本読み込み処理開始');
    console.log('====================');
    
    try {
        let stories = [];
        const storageKey = bookType === 'official' ? 'officialBooks' : 'generatedStories';
        stories = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        console.log(`${bookType === 'official' ? '管理者' : 'ユーザー'}絵本を取得:`, stories.length, '冊');
        
        const story = stories.find(s => s.id === storyId);
        
        if (!story) {
            console.error('絵本が見つかりません。ID:', storyId);
            showError('指定された絵本が見つかりません');
            return;
        }
        
        console.log('絵本タイトル:', story.title);
        console.log('ページ数:', story.pages ? story.pages.length : 'なし');
        
        // 画像URLを修正
        if (story.pages && Array.isArray(story.pages)) {
            console.log('====================');
            console.log('画像URLの修正処理');
            console.log('====================');
            
            story.pages.forEach((page, index) => {
                if (page.imageUrl) {
                    const originalUrl = page.imageUrl;
                    page.imageUrl = fixImageUrl(page.imageUrl);
                    
                    if (originalUrl !== page.imageUrl) {
                        console.log(`ページ${index + 1}の画像URL修正完了`);
                    }
                }
            });
        }
        
        currentStory = story;
        currentPage = 0;
        totalPages = story.pages ? story.pages.length : 1;
        
        displayStory(story);
        
    } catch (error) {
        console.error('エラー発生:', error);
        showError('絵本の読み込みに失敗しました');
    }
}

// 絵本データを表示
function displayStory(story) {
    console.log('====================');
    console.log('絵本表示開始');
    console.log('====================');
    
    // タイトルと作者を表示
    const titleElement = document.getElementById('book-title');
    const authorElement = document.getElementById('book-author');
    
    if (titleElement) titleElement.textContent = story.title || 'タイトルなし';
    if (authorElement) authorElement.textContent = story.author || '名前なし';
    
    if (story.pages && Array.isArray(story.pages) && story.pages.length > 0) {
        displayPagedStory(story);
    } else {
        displaySinglePageStory(story);
    }
}

// ページ形式の絵本を表示
function displayPagedStory(story) {
    console.log('ページ形式の絵本を表示');
    totalPages = story.pages.length;
    displayPage(0);
    updateNavigationButtons();
}

// 単一ページ形式の絵本を表示
function displaySinglePageStory(story) {
    console.log('単一ページ形式の絵本を表示');
    totalPages = 1;
    
    const pageNumberElement = document.getElementById('page-number');
    const pageTextElement = document.getElementById('page-text');
    const pageImageElement = document.getElementById('page-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (pageNumberElement) pageNumberElement.textContent = '1 / 1';
    if (pageTextElement) pageTextElement.textContent = story.content || story.summary || '本文がありません';
    
    if (pageImageElement) {
        if (story.imageUrl) {
            pageImageElement.src = fixImageUrl(story.imageUrl);
            pageImageElement.style.display = 'block';
        } else {
            pageImageElement.style.display = 'none';
        }
    }
    
    if (prevBtn) {
        prevBtn.disabled = true;
        prevBtn.classList.add('disabled');
    }
    
    if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
    }
}

// 指定ページを表示
function displayPage(pageIndex) {
    console.log('====================');
    console.log(`ページ ${pageIndex + 1} / ${totalPages} を表示`);
    console.log('====================');
    
    if (!currentStory || !currentStory.pages) {
        console.error('絵本データがありません');
        return;
    }
    
    if (pageIndex < 0 || pageIndex >= totalPages) {
        console.warn('無効なページインデックス:', pageIndex);
        return;
    }
    
    currentPage = pageIndex;
    const page = currentStory.pages[pageIndex];
    
    // テキストを表示
    const textElement = document.getElementById('page-text');
    if (textElement && page) {
        textElement.textContent = page.text || '';
        // デフォルトスタイルをリセット
        textElement.style = '';
        textElement.className = 'page-text';
    }
    
    // 画像を表示
    const imageElement = document.getElementById('page-image');
    if (imageElement) {
        if (page && page.imageUrl) {
            console.log('画像を設定:', page.imageUrl);
            
            // エラーハンドリング
            imageElement.onerror = function() {
                console.error('画像読み込み失敗:', page.imageUrl);
                this.style.display = 'none';
                
                // 画像がない場合はテキストを装飾
                if (textElement) {
                    textElement.style.fontSize = '28px';
                    textElement.style.padding = '40px';
                    textElement.style.background = 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)';
                    textElement.style.minHeight = '300px';
                    textElement.style.display = 'flex';
                    textElement.style.alignItems = 'center';
                    textElement.style.justifyContent = 'center';
                    textElement.style.borderRadius = '15px';
                    textElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
            };
            
            imageElement.onload = function() {
                console.log('画像読み込み成功:', page.imageUrl);
                // テキストスタイルをリセット
                if (textElement) {
                    textElement.style = '';
                    textElement.className = 'page-text';
                }
            };
            
            imageElement.src = page.imageUrl;
            imageElement.style.display = 'block';
        } else {
            imageElement.style.display = 'none';
            
            // 画像がない場合はテキストを装飾
            if (textElement) {
                textElement.style.fontSize = '28px';
                textElement.style.padding = '40px';
                textElement.style.background = 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)';
                textElement.style.minHeight = '300px';
                textElement.style.display = 'flex';
                textElement.style.alignItems = 'center';
                textElement.style.justifyContent = 'center';
                textElement.style.borderRadius = '15px';
                textElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        }
    }
    
    // ページ番号を表示
    const pageNumberElement = document.getElementById('page-number');
    if (pageNumberElement) {
        pageNumberElement.textContent = `${pageIndex + 1} / ${totalPages}`;
    }
    
    updateNavigationButtons();
}

// 前のページを表示
function prevPage() {
    if (currentPage > 0) {
        displayPage(currentPage - 1);
    }
}

// 次のページを表示
function nextPage() {
    if (currentPage < totalPages - 1) {
        displayPage(currentPage + 1);
    }
}

// ナビゲーションボタンの状態を更新
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.classList.toggle('disabled', currentPage === 0);
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages - 1;
        nextBtn.classList.toggle('disabled', currentPage === totalPages - 1);
    }
}

// エラーメッセージを表示
function showError(message) {
    const pageContent = document.getElementById('book-content');
    if (pageContent) {
        pageContent.innerHTML = `
            <div class="error-message">
                <p><i class="fas fa-exclamation-circle"></i> ${message}</p>
                <button class="back-btn" onclick="navigate('index.html')">ホームに戻る</button>
            </div>
        `;
    }
    console.error('エラー:', message);
}

console.log('readViewer.js 読み込み完了（修正版）');