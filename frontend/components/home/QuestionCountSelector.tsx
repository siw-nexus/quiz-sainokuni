'use client';

import { useState } from 'react';

const QUESTION_COUNTS = [5, 10, 15];

export default function QuestionCountSelector() {
    const [count, setCount] = useState(5);
  
    return (
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
    );
  }