'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'


// 問題数の配列
const QUESTION_COUNTS = [5, 10, 15];

// 問題の種類の配列
const QUESTION_TYPES = {'tourist': '観光地', 'gourmet': 'グルメ'};


export default function QuizSelect() {
  const [count, setCount] = useState(5);
  const router = useRouter();

  // クイズ画面に遷移する関数
  const handleClick = (key: string) => {
    router.push(`/quiz?spot_type=${key}&limit=${count}`)
  }

  return (
    <div>
      <div>
        <p>問題数</p>
        <select 
          name="num_of_question" 
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="border"
        >
          {QUESTION_COUNTS.map((c) => (
            <option key={c} value={c}>
              {c}問
            </option>
          ))}
        </select>
      </div>
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
    </div>
  );
}