import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

// 型の定義をインポート
import { JWTPayload } from '@/types/auth'


// クッキーからアクセストークンを取得する
export async function getAccessToken() {
  // クッキーからアクセストークンを取得
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // アクセストークンが無かったら空配列を返す
  if (!token) return [];

  return token;
}


// JWTトークンが有効かどうかを判定する
export function isTokenValid(token: string | undefined): boolean {
  // JWTトークンが無かったら終了
  if (!token) return false;

  // JWTトークンの有効期限を確認
  try {
    // トークンをでコード
    const decoded = jwtDecode<JWTPayload>(token);

    // 現在時刻を取得
    const currentTime = Math.floor(Date.now() / 1000);

    // 期限(exp) が 現在より先なら有効
    return decoded.exp > currentTime;
  } catch (error) {
    // デコード失敗
    return false;
  }
}