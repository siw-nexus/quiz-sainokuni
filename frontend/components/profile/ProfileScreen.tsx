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

  // プロフィールボタンを押したら実行する関数
  const handleProfile = () => {
    if (isProfile) return;

    setIsProfile(true);
    setIsInterest(false);
  }

  // 興味がある一覧ボタンを押したら実行する関数
  const handleInterest = () => {
    if (isInterest) return;

    setIsProfile(false);
    setIsInterest(true);
  }

  return (
    <main>
      <div>
        <button 
          className='border'
          onClick={handleProfile}
        >
          プロフィール
        </button>
        <button 
          className='border'
          onClick={handleInterest}
        >
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