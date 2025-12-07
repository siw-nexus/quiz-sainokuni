'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'

const QUESTION_TYPES = {'tourist': '観光地', 'gourmet': 'グルメ'};

export default function QuestionTypeSelectBtn() {
    const [type, setType] = useState('tourist');
    const router = useRouter();

    // クイズ画面に遷移する関数
    const handleClick = (key: string) => {
      setType(key)
      router.push(`/quiz?spot_type=${key}`)
    }
  
    return (
        <div>
        {Object.entries(QUESTION_TYPES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            className='border'
          >
            {label}
          </button>
        ))}
        </div>
    );
  }