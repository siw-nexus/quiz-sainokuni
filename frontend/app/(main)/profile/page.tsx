export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";

// APIリクエストの関数をインポート
import { getAccessToken, isTokenValid } from "@/lib/auth";
import { getUser } from "@/lib/api/user";
import { getInterest } from "@/lib/api/interest";
import { getHistory } from "@/lib/api/question"; // ▼ 追加: 履歴取得API

// 型の定義をインポート
import { User } from "@/types/user";
import { interest } from "@/types/interest";
import { QuizHistory } from "@/types/history";

// コンポーネントをインポート
import ProfileScreen from "@/components/profile/ProfileScreen";

export default async function Profile() {
  // アクセストークンを取得する関数を呼び出す
  // ▼ サーバー側のクッキーなどからトークンを取り出します
  const token: string = await getAccessToken();

  // アクセストークンが有効かどうかを確認する関数を呼び出す
  // ▼ 有効期限切れなどをチェックします
  const isLoggedIn: boolean = await isTokenValid(token);

  // トークンが無い場合か有効じゃない場合はホーム画面に移動
  if (!token || !isLoggedIn) {
    // ▼ redirect関数は内部でエラーを投げて処理を中断し、ページを移動させます
    redirect('/')
  }

  // ユーザー情報を取得する関数を呼び出す
  // ▼ 画面表示に必要なユーザー名やメアドを取得
  const userData = await getUser(token);

  if (!userData) redirect('/login');

  const user: User = userData;

  // 興味がある一覧を取得する関数を呼び出す
  const interests: interest[] = await getInterest(token);

  // ▼▼▼ 追加: 回答履歴を取得する関数を呼び出す ▼▼▼
  const histories: QuizHistory[] = await getHistory(token);

  return(
    // 取得した各データをコンポーネントに渡す
    <ProfileScreen 
      user={user} 
      interests={interests} 
      histories={histories} // ▼ 追加
    />
  );
}