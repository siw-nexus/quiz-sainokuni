'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

// ログイン処理
export async function login(prevState: any, formData: FormData) {
  // ログインフォームから入力された値を取得
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    // ログインAPI
    const res = await fetch(`${apiUrl}/token`, {
      method: 'POST',
      body: params,
    });
  
    // レスポンスの確認
    if (!res.ok) return { message: 'メールアドレスまたはパスワードが間違っています' };
  
    // レスポンスの中身を取得
    const data = await res.json();

    const cookiesStore = await cookies();
    // 受け取ったトークンをクッキーに保存
    cookiesStore.set('access_token', data.access_token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      maxAge: 60 * 60 * 24, // 1日
      path: '/',
      sameSite: 'lax',
    })
  } catch (e) {
    console.error(e);
  }

  // ホーム画面に移動
  redirect('/')
}