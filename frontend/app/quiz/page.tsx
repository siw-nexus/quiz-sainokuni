// コンポーネントのインポート
import QuizScreen from "@/components/quiz/QuizScreen";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


export default async function Quiz({ searchParams }: Props) {
  // URLのパラメーターを取得
  const params = await searchParams;
  const spot_type = params.spot_type; // spot_typeの値を取得
  const limit = params.limit;         // limitの値を取得

  
  return (
    <main>
      <QuizScreen spot_type={spot_type} limit={limit}/>
    </main>
  );
}