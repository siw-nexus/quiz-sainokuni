// コンポーネントをインポート
import QuizHistory from "@/components/history/QuizHistory";

// 型の定義をインポート
import { interest } from "@/types/interest";

// APIリクエストの関数をインポート
import { getInterest } from "@/lib/api/interest";

export default async function HistoryPage() {
  // 興味がある一覧を取得する関数を呼び出し
  const interests: interest = await getInterest()

  return (
    <QuizHistory interests={interests}/>
  );
}