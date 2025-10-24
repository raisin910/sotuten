/**
 * API設定ファイル
 * えほんのくに - Gemini API設定
 */

// ローカルの環境設定（js/config.local.js）で上書きされることを想定
const localConfig = window.__LOCAL_CONFIG__ || {};

// Gemini APIキー（Vercel環境変数またはローカル設定から取得）
window.GEMINI_API_KEY = window.ENV_GEMINI_API_KEY || localConfig.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

// API設定
window.API_CONFIG = {
    DEV_MODE: false,  // APIを使用する場合はfalse
    
    // エンドポイント（修正版）
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
    
    if (!window.API_CONFIG.DEV_MODE && (!window.GEMINI_API_KEY || window.GEMINI_API_KEY === 'YOUR_API_KEY_HERE')) {
        console.warn('⚠️ APIキーが設定されていません。開発モードをONにするか、js/config.local.jsでキーを設定してください。');
    }
});