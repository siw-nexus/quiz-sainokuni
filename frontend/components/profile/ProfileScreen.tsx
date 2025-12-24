'use client'

import { useState } from 'react';

// コンポーネントをインポート
import ProfileHeader from "./ProfileHeader"

// 型の定義をインポート
import { User } from "@/types/user"

// Propsの定義
type Props = {
  user: User;
}

export default function ProfileScreen({ user }: Props) {
  const [isProfile, serIsProfile]: boolean = useState(true);

  // isProfileがtrueならProfileHeaderを表示
  if (isProfile) {
    return(
      <main>
        <ProfileHeader user={user} />
      </main>
    );
  }
}