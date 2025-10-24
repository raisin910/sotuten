/**
 * えほんのくに - メインスクリプト
 * アプリケーション全体の共通処理を管理
 */

// グローバル設定
const APP_CONFIG = {
    appName: 'えほんのくに',
    version: '1.0.0'
};

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log(`${APP_CONFIG.appName} v${APP_CONFIG.version} を起動しています...`);
    
    // レイアウト調整
    adjustLayout();
    
    // デバイスチェック
    checkDevice();
});

// レイアウト調整
function adjustLayout() {
    const viewportHeight = window.innerHeight;
    const app = document.getElementById('app');
    if (app) {
        app.style.minHeight = viewportHeight + 'px';
    }
}

// デバイスの種類を判定
function checkDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
    
    if (isTouch) {
        document.body.classList.add('is-touch');
    }
    
    console.log(`デバイスタイプ: ${isMobile ? 'モバイル' : 'デスクトップ'}`);
}

// ウィンドウリサイズ時の処理
window.addEventListener('resize', adjustLayout);

// 効果音を再生（共通関数）
window.playSound = function(soundName) {
    console.log('効果音:', soundName);
    // 音声ファイルが準備できたら有効化
    // const audio = new Audio(`assets/audio/${soundName}.mp3`);
    // audio.volume = 0.5;
    // audio.play().catch(e => console.log('音声再生エラー:', e));
};

// グローバルエラーハンドリング
window.addEventListener('error', (event) => {
    console.error('エラーが発生しました:', event.error);
});