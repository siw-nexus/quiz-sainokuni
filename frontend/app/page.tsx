// コンポーネントのインポート
import QuizSelect from "@/components/home/QuizSelect";

// 認証関係の関数をインポート
import { getAccessToken, isTokenValid } from '@/lib/auth';

export default async function Home() {
  // アクセストークンを取得する関数を呼び出す
  const token: string | undefined = await getAccessToken();

  // アクセストークンが有効かどうかを確認する関数を呼び出す
  const isLoggedIn: boolean = await isTokenValid(token);
  
  return (
    <main>
      <QuizSelect isLoggedIn={isLoggedIn}/>
    </main>
  );
}