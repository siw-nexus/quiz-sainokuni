'use client'

// 型の定義をインポート
import { User } from "@/types/user"

// Propsの定義
type Props = {
  user: User;
}

export default function ProfileHeader({ user }: Props) {
  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  );
}