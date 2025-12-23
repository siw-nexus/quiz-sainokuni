'use client'

// ▼ 画面遷移（リダイレクト）を行うためのフック
import { useRouter } from 'next/navigation';
// ▼ 副作用（データの変化を監視して処理を実行する）のためのフック
import { useEffect } from 'react';
import { useActionState } from 'react';
// ▼ リンク作成用（新規登録画面などへの移動）
import Link from 'next/link';

// ログイン処理をインポート
import { login } from '@/actions/auth';

export default function LoginForm() {
  // ▼ ルーター機能を使うための準備（ページ移動に使います）
  const router = useRouter();

  // エラーメッセージなどを受け取るフック
  const [state, formAction, isPending] = useActionState(login, null); 

  // ▼ state（ログイン結果）が変わるたびに実行される処理
  useEffect(() => {
    // バックエンドから { success: true } が返ってきたらホームへ移動
    if (state?.success) {
      router.push('/home'); 
      router.refresh(); // 画面のデータを最新の状態に更新
    }
  }, [state, router]);

  return (
    // ▼ 画面中央に配置するためのレイアウト設定
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        
        {/* ヘッダー部分 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">ログイン</h2>
          <p className="mt-2 text-sm text-gray-600">アカウント情報を入力してください</p>
        </div>

        {/* ▼ formActionを指定することで、送信時にサーバーのlogin関数が動きます */}
        <form action={formAction} className="mt-8 space-y-6">
          
          {/* ▼ サーバーからメッセージ（エラー等）がある場合のみ表示 */}
          {state?.message && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              {/* state.messageの中身を表示 */}
              <p>⚠️ {state.message}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* メールアドレス入力欄 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              {/* ▼ name属性はサーバーがデータを受け取るための「キー（鍵）」になります。必須です。 */}
              <input 
                name="email" 
                type="email" 
                className='block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                required 
                placeholder="example@mail.com"
              />
            </div>

            {/* パスワード入力欄 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              
              {/* ▼ type="password" にすることで入力文字が伏せ字（●●●）になります */}
              <input 
                name="password" 
                type="password" 
                className='block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                required 
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <button 
            type="submit" 
            disabled={isPending} // ▼ 送信中はボタンを押せないように無効化
            className={`flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isPending 
                ? 'bg-blue-400 cursor-not-allowed' // 送信中のスタイル（薄くする）
                : 'bg-blue-600 hover:bg-blue-700'  // 通常時のスタイル
              }`}
          >
            {/* ▼ 送信中かどうかで表示する文字を切り替え */}
            {isPending ? 'ログイン中...' : 'ログイン'}
          </button>

          <div className="space-y-3 text-center text-sm">
            
            {/* 新規登録画面へのリンク */}
            <div>
              <span className="text-gray-600">アカウントをお持ちでない方は </span>
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                新規登録
              </Link>
            </div>

            {/* パスワードリセット画面へのリンク */}
            <div>
              <Link 
                href="/password-reset" 
                className="text-blue-600 hover:text-gray-700 hover:underline text-xs"
              >
                パスワードをお忘れですか？
              </Link>
            </div>

          </div>

          

        </form>
      </div>
    </div>
  );
}