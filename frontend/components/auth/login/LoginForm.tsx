'use client'

import { useActionState } from 'react';

// ログイン処理をインポート
import { login } from '@/actions/auth';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null); // エラーメッセージなどを受け取るフック

  return (
    <div>
      <form action={formAction}>
        {state?.message && (
          <p>{state.message}</p>
        )}
        <div>
          <label>メールアドレス</label>
          <input name="email" type="email" className='border' required />
        </div>
        <div>
          <label>パスワード</label>
          <input name="password" type="password" className='border' required />
        </div>
        <button type="submit" disabled={isPending} className='border'>
          {isPending ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}