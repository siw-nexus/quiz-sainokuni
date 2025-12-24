'use client'

import { useState } from 'react';

// コンポーネントをインポート
import ProfileHeader from "./ProfileHeader"
import InterestList from './InterestList';

// 型の定義をインポート
import { User } from "@/types/user";
import { interest } from '@/types/interest';

// Propsの定義
type Props = {
  user: User;
  interests: interest;
}

export default function ProfileScreen({ user, interests }: Props) {
  const [isProfile, setIsProfile]: boolean = useState(false);
  const [isInterest, setIsInterest]: boolean = useState(true);

  return (
    <main>
      <div>
        <button className='border'>
          プロフィール
        </button>
        <button className='border'>
          興味がある一覧
        </button>
      </div>
      <div>
        {isProfile && <ProfileHeader user={user} />}
      </div>
      <div>
        {isInterest && <InterestList interests={interests}/>}
      </div>
    </main>
  )
}