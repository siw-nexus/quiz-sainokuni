'use client'

import Link from 'next/link';

// 型の定義をインポート
import { NearbySpot } from "@/types/spot";

// Propsを定義
type Props = {
  nearbySpots: NearbySpot[]
}

const roundWithScale = (value: number, scale: number) => {
  return Math.round(value * 10 ** scale) / 10 ** scale;
};

export default function NearbySpotsList({ nearbySpots }: Props) {
  return (
    <div>
      周辺の観光地
      {nearbySpots
        .filter((nearbySpot) => nearbySpot.spot_type === 'tourist')
        .map((nearbySpot) => (
          <div key={nearbySpot.id}>
            <p>{nearbySpot.name}</p>
            <p>約{nearbySpot.distance >= 1 ? `${roundWithScale(nearbySpot.distance, 1)}km` : `${Math.round(nearbySpot.distance * 1000)}m`}</p>
            <Link
              href={`/spot_detail?spot_type=${nearbySpot.spot_type}&spot_id=${nearbySpot.id}`}
              className='border'
            >
              詳細を見る
            </Link>
          </div>
      ))}
      周辺のグルメ
      {nearbySpots
        .filter((nearbySpot) => nearbySpot.spot_type === 'gourmet')
        .map((nearbySpot) => (
          <div key={nearbySpot.id}>
            <p>{nearbySpot.name}</p>
            <p>約{nearbySpot.distance >= 1 ? `${roundWithScale(nearbySpot.distance, 1)}km` : `${Math.round(nearbySpot.distance * 1000)}m`}</p>
            <Link
              href={`/spot_detail?spot_type=${nearbySpot.spot_type}&spot_id=${nearbySpot.id}`}
              className='border'
            >
              詳細を見る
            </Link>
          </div>
      ))}
    </div>
  );
}