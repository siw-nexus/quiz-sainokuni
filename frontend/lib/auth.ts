import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  exp: number;
};


// クッキーからアクセストークンを取得する
export asycn function getAccessToken() {
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