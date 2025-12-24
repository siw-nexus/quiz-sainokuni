'use client'

import { useState } from 'react';
import Link from 'next/link';

// 型の定義をインポート
import { interest } from "@/types/interest"

// Propsの定義
type Props = {
  interests: interest[];
}

export default function InterestList({ interests }: Props) {
  const [isTourist, setIsTourist] = useState(true);
  const [isGourmet, setIsGourmet] = useState(false);
  // データをフィルタリング（表示判定用）
  const touristSpots = interests.filter((s) => s.spot_type === 'tourist');
  const gourmetSpots = interests.filter((s) => s.spot_type === 'gourmet');

  // サブコンポーネントを作成
  const SpotCard = ({ item }: { item: interest }) => (
    <div key={item.id}>
      <p>{item.name}</p>
      <p>{item.detail}</p>
      <Link
        href={`/spot_detail?spot_type=${item.spot_type}&spot_id=${item.spot_id}`}
        className="border"
      >
        詳細を見る
      </Link>
    </div>
  );

  // 観光地ボタンを押したら実行する関数
  const handleTourist = () => {
    if (isTourist) return;

    setIsTourist(true);
    setIsGourmet(false);
  }

  // グルメボタンを押したら実行する関数
  const handleGourmet = () => {
    if (isGourmet) return;

    setIsTourist(false);
    setIsGourmet(true);
  }

  return (
    <div>
      <div>
        <button 
          className='border'
          onClick={handleTourist}
        >
          観光地
        </button>
        <button 
          className='border'
          onClick={handleGourmet}
        >
          グルメ
        </button>
      </div>
      {isTourist ? (
        touristSpots.length > 0 ? (
          <div>
            {touristSpots.map((spot) => <SpotCard key={spot.id} item={spot} />)}
          </div>
      ) : (
        <p>観光地のお気に入りは登録されていません</p>
      )
    ) : null}
      

      {isGourmet ? (
        gourmetSpots.length > 0 ? (
          <div>
            {gourmetSpots.map((spot) => <SpotCard key={spot.id} item={spot} />)}
          </div>
        ) : (
          <p>グルメのお気に入りは登録されていません</p>
        )
      ) : null}
    </div>
  );
}