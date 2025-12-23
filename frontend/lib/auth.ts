import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  exp: number;
};


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