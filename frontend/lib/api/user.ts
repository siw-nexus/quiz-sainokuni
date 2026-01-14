// 型の定義をインポート
import { User } from "@/types/user";

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://nginx/api';

// ユーザー情報を取得する関数
export async function getUser(token: string) {
  // ユーザー情報を取得
  try {
    const res = await fetch(`${apiUrl}/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store', // キャッシュ無効か
    });

    // レスポンスの確認
    if (!res.ok) return null;

    // レスポンスの中身を取得して返す
    const data: User = await res.json();
    return data;

  } catch (e) {
    console.error(e);
    return null; // エラーならnullを返す
  }
}