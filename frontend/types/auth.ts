// アクセストークンの型定義
export type JWTPayload = {
  exp: number;
  iat?: number;
  sub: string;
};