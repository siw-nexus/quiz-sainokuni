import { cookies } from 'next/headers';

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

// 興味がある一覧を取得する関数
export async function getInterest() {
  // クッキーからアクセストークンを取得
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // トークンが無かったら空配列を返す
  if (!token) return [];

  // 興味がある一覧を取得
  try {
    const res = await fetch(`${apiUrl}/interests`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store', // キャッシュ無効か
    });

    // レスポンスの確認
    if (!res.ok) return { message: '興味データの取得に失敗しました' };

    // レスポンスの中身を取得して返す
    const data = await res.json();
    return data;

  } catch (e) {
    console.error(e);
    return []; // エラーなら空配列を返す
  }
}