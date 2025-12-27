import { redirect } from "next/navigation";

// APIリクエストの関数をインポート
import { getAccessToken, isTokenValid } from "@/lib/auth";
import { getUser } from "@/lib/api/user";
import { getInterest } from "@/lib/api/interest";

// 型の定義をインポート
import { User } from "@/types/user";
import { interest } from "@/types/interest";

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
  const user: User = await getUser(token);

  // 興味がある一覧を取得する関数を呼び出す
  // ▼ お気に入り登録した観光地やグルメのリストを取得
  const interests: interest[] = await getInterest(token)

  return(
    // ▼ 取得したデータをクライアントコンポーネントに渡して表示
    <ProfileScreen user={user} interests={interests} />
  );
}