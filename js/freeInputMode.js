/**
 * 自由入力モード機能
 */
function hideAllScreens(root = document){
    root.querySelectorAll('.screen').forEach((el) => {
        el.classList.remove('active');
        el.setAttribute('aria-hidden','true');
    });
}

function showScreen(id, root = document){
    hideAllScreens(root);
    const el = root.getElementById(id);
    if(!el){
        console.warn(`[showScreen] not found: #${id}`);
        return;
    }
    el.classList.add('active');
    el.removeAttribute('aria-hidden');
}

// 自由入力モードの開始
function startFreeMode() {
    console.log('自由入力モードを開始');
    
    // 画面切り替え
    hideAllScreens();
    document.getElementById('free-input-screen').classList.add('active');
    
    // 入力フィールドをクリア
    const inputEl = document.getElementById('story-input');
    if(inputEl){
        inputEl.value = '';
        updateNextButton();
        inputEl.focus();
    }
}

// ヒントを使用
function useHint(hintText) {
    const input = document.getElementById('story-input');
    input.value = hintText;
    updateNextButton();
    if (typeof playSound === 'function') playSound('select');
}

// 入力内容を確認
function confirmFreeInput() {
    const input = document.getElementById('story-input').value.trim();
    
    if (input.length === 0) {
        alert('おはなしを かいてね！');
        return;
    }
    
    // 入力内容を保存
    window.storyCreationData = {
        mode: 'free',
        userInput: input,
        createdAt: new Date().toISOString()
    };
    
    // 確認画面を表示
    showConfirmationScreen();
    
    if (typeof playSound === 'function') playSound('select');
}

// 確認画面を表示（自由入力用）
function showConfirmationScreen() {
    showScreen('confirmation-screen');

    const free = document.getElementById('free-input-confirmation');
    const sel = document.getElementById('select-mode-confirmation');
    if (free) free.style.display = 'block';
    if (sel) sel.style.display = 'none';

    const out = document.getElementById('input-text-display');
    if (out && window.storyCreationData){
        out.textContent = window.storyCreationData.userInput;
    }
}

// 入力フィールドのイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const storyInput = document.getElementById('story-input');
    if (storyInput) {
        storyInput.addEventListener('input', updateNextButton);
        storyInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                confirmFreeInput();
            }
        });
    }
});

// 次へボタンの有効/無効を更新
function updateNextButton() {
    const input = document.getElementById('story-input');
    const nextBtn = document.querySelector('#free-input-screen .next-btn');
    
    if (!input || !nextBtn) return;
    
    if (input.value.trim().length > 0) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// 音声入力の開始（voiceInput.jsで実装）
function startVoiceInput() {
    if (typeof startVoiceRecognition === 'function') {
        startVoiceRecognition();
    } else {
        alert('おんせいにゅうりょくは じゅんびちゅうです');
    }
}