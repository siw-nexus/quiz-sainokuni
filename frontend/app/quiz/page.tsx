// コンポーネントのインポート
import QuestionText from "@/components/quiz/QuestionText";
import OptionBtn from "@/components/quiz/OptionBtn";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


export default async function Quiz({ searchParams }: Props) {
  // APIのエンドポイント
  const apiUrl = process.env.INTERNAL_API_URL

  // URLのパラメーターを取得
  const params = await searchParams;
  const spot_type = params.spot_type; // spot_typeの値を取得
  const limit = params.limit;         // limitの値を取得

  // 問題を取得する
  const res = await fetch(
    `${apiUrl}/question?spot_type=${spot_type}&limit=${limit}`,
    { cache: "no-cache"} // キャッシュを無効化
  )

  // レスポンスの確認
  if (!res.ok) {
    throw new Error("問題の取得に失敗しました");
  }

  // レスポンスの中身を取得
  const questions = await res.json();

  
  return (
    <main>
      <QuestionText questions={questions} />
      <OptionBtn questions={questions} spot_type={spot_type}/>
    </main>
  );
}