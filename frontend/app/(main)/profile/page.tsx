import { redirect } from "next/navigation";

// APIリクエストの関数をインポート
import { getAccessToken, isTokenValid } from "@/lib/auth";
import { getUser } from "@/lib/api/user";

// 型の定義をインポート
import { User } from "@/types/user";

// コンポーネントをインポート
import ProfileScreen from "@/components/profile/ProfileScreen";

export default async function Profile() {
  // アクセストークンを取得する関数を呼び出す
  const token: string = await getAccessToken();

  // アクセストークンが有効かどうかを確認する関数を呼び出す
  const isLoggedIn: boolean = await isTokenValid(token);

  // トークンが無い場合か有効じゃない場合はホーム画面に移動
  if (!token || !isLoggedIn) {
    redirect('/')
  }

  // ユーザー情報を取得する関数を呼び出す
  const user: User = await getUser(token);

  return(
    <ProfileScreen user={user} />
  );
}