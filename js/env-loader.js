/**
 * 環境変数読み込み用スクリプト
 * .envファイルから環境変数を読み込みます
 */

// Node.jsでの環境変数読み込み例（サーバーサイド実行時）
if (typeof require !== 'undefined') {
  try {
    require('dotenv').config();
  } catch (error) {
    console.warn('dotenvモジュールがインストールされていません。npm install dotenv を実行してください。');
  }
}

// ブラウザ環境での環境変数のモックアップ（開発時のみ）
if (typeof window !== 'undefined' && typeof process === 'undefined') {
  window.process = { env: {} };
  
  // ローカル開発時は.envファイルの代わりにconfig.local.jsを使用
  console.log('ブラウザ環境で実行中: 環境変数の代わりにconfig.local.jsを使用します');
}