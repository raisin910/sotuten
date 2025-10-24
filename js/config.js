/**
 * API設定ファイル
 * えほんのくに - Gemini API設定
 */

// ローカルの環境設定（js/config.local.js）で上書きされることを想定
const localConfig = window.__LOCAL_CONFIG__ || {};

// Gemini APIキー（本番環境では環境変数から読み込むことを推奨）
window.GEMINI_API_KEY = window.ENV_GEMINI_API_KEY || localConfig.GEMINI_API_KEY || '';

// デバッグ用
console.log('🔍 APIキー設定状態:', window.GEMINI_API_KEY ? '設定済み' : '未設定');

// API設定
window.API_CONFIG = {
    // APIキーがない場合は開発モードをONにする
    DEV_MODE: !window.GEMINI_API_KEY,
    
    // エンドポイント（安定版）
    ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    
    GENERATION_CONFIG: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
    }
};

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 えほんのくに - 設定読み込み完了');
    console.log('開発モード:', window.API_CONFIG.DEV_MODE ? 'ON（テンプレート使用）' : 'OFF（API使用）');
    
    if (!window.API_CONFIG.DEV_MODE && (!window.GEMINI_API_KEY || window.GEMINI_API_KEY === '')) {
        console.warn('⚠️ APIキーが設定されていません。開発モードをONにするか、js/config.local.jsでキーを設定してください。');
    }
});
