'use client'

// コンポーネントをインポート
import ProfileHeader from "./ProfileHeader"

// 型の定義をインポート
import { User } from "@/types/user"

// Propsの定義
type Props = {
  user: User;
}

export default function ProfileScreen({ user }: Props) {
  return(
    <main>
      <ProfileHeader user={user} />
    </main>
  );
}