'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Propsの定義
type Props = {
  lat: string
  lon: string
  address: string
}

export default function DetailFooterBtn({ lat, lon, address }: Props) {
  const router = useRouter();

  return (
    <div>
      <button
        type='button'
        onClick={() => router.back()}
        className='border'
      >
        戻る
      </button>
      <Link 
        href={`/map$lat=${lat}&lon=${lon}&address=${address}`}
        className='border'
      >
        ここに行く
      </Link>
    </div>
  );
}