// コンポーネントのインポート
import QuizScreen from "@/components/quiz/QuizScreen";

// 型の定義をインポート
import { Question } from "@types/question";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

// 問題文を取得する関数
const getQuestion = async (spot_type: string, limit: number ): Promise<Question[]> => {
  try {
    const res = await fetch(
      `${apiUrl}/question?spot_type=${spot_type}&limit=${limit}`,
      { cache: "no-store"} // キャッシュを無効化
    );
    // レスポンスの確認
    if (!res.ok) throw new Error("問題の取得に失敗しました");

    // レスポンスの中身を取得
    const data = await res.json();
    
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};


export default async function Quiz({ searchParams }: Props) {
  // URLのパラメーターを取得
  const params = await searchParams;
  const spot_type = params.spot_type; // spot_typeの値を取得
  const limit = params.limit;         // limitの値を取得

  // 問題文を取得する関数を呼び出す
  const questions = await getQuestion(spot_type, limit);
  
  return (
    <main>
      <QuizScreen spot_type={spot_type} limit={limit}/>
    </main>
  );
}