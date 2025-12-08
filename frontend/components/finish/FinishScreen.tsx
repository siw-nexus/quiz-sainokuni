'use client'

import { useRouter } from 'next/navigation';

export default function FinishScreen() {
  const router = useRouter();

  const handleHomeBtn = () => {
    router.push('/')
  }


  return (
    <>
      <p>クイズ終了</p>
      <button className='border' onClick={() => handleHomeBtn()}>ホームへ</button>
    </>
  );
}