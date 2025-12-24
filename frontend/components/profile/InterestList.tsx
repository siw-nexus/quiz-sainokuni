'use client'

import Link from 'next/link';

// 型の定義をインポート
import { interest } from "@/types/interest"

// Propsの定義
type Props = {
  interests: interest[];
}

export default function InterestList({ interests }: Props) {
  return (
    <div>
      {interests?.map((interest) => (
        <div key={interest.id}>
          <p>{interest.name}</p>
          <p>{interest.detail}</p>
          <Link
            href={`/spot_detail?spot_type=${interest.spot_type}&spot_id=${interest.spot_id}`}
            className='border'
          >
            詳細を見る
          </Link>
        </div>
      ))}
    </div>
  );
}