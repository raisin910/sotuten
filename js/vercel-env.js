/**
 * Vercel環境変数読み込み用スクリプト
 */
(function() {
  // Vercel環境変数を取得
  try {
    // Vercelのランタイム環境変数
    if (typeof window !== 'undefined') {
      window.ENV_GEMINI_API_KEY = '{{NEXT_PUBLIC_GEMINI_API_KEY}}';
      
      // プレースホルダーの場合は空文字にする
      if (window.ENV_GEMINI_API_KEY === '{{NEXT_PUBLIC_GEMINI_API_KEY}}') {
        window.ENV_GEMINI_API_KEY = '';
      }
      
      console.log('環境変数の読み込み: ', window.ENV_GEMINI_API_KEY ? '成功' : '未設定');
    }
  } catch (error) {
    console.warn('環境変数の読み込みに失敗しました:', error);
  }
})();