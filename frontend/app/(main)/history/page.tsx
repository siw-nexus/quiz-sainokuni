// コンポーネントをインポート
import QuizHistory from "@/components/history/QuizHistory";

// 型の定義をインポート
import { interest } from "@/types/interest";

// APIリクエストの関数をインポート
import { getAccessToken, isTokenValid } from "@/lib/auth";
import { getInterest } from "@/lib/api/interest";

export default async function HistoryPage() {
  // アクセストークンを取得する関数を呼び出す
  const token: string = await getAccessToken();

  // アクセストークンが有効かどうかを確認する関数を呼び出す
  const isLoggedIn: boolean = await isTokenValid(token);

  // 興味がある一覧を格納する配列を準備
  let interests: interest[] = [];

  // トークンが場合のみ興味がある一覧を取得
  if (token && isLoggedIn) {
    // 興味がある一覧を取得する関数を呼び出し
    interests = await getInterest(token);
  }

  return (
    <QuizHistory interests={interests}/>
  );
}