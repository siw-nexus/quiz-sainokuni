// コンポーネントのインポート
import QuizScreen from "@/components/quiz/QuizScreen";

// 型の定義をインポート
import { Question } from "@/types/question";
import { interest } from "@/types/interest";

// APIリクエストの関数をインポート
import { getAccessToken, isTokenValid } from "@/lib/auth";
import { getInterest } from "@/lib/api/interest";

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
    <main>
      <QuizScreen spot_type={spot_type} limit={limit} questions={questions} interests={interests} token={token} isLoggedIn={isLoggedIn}/>
    </main>
  );
}