/**
 * Vercel環境変数読み込み用スクリプト（確実版）
 */
(function() {
  // Vercel環境でのAPI Key設定
  window.ENV_GEMINI_API_KEY = '';

  // Vercelが環境変数を埋め込む（デプロイ時に自動的に置換される）
  if (typeof window !== 'undefined') {
    try {
      // これはVercelのビルド時に実際のAPIキーに置換される
      const apiKey = 'REPLACE_WITH_API_KEY';
      
      if (apiKey && apiKey !== 'REPLACE_WITH_API_KEY') {
        window.ENV_GEMINI_API_KEY = apiKey;
        console.log('🔑 Vercel環境変数読み込み成功');
      } else {
        console.log('🔑 Vercel環境変数は設定されていません');
      }
    } catch (error) {
      console.warn('環境変数の読み込みに失敗:', error);
    }
  }
})();
