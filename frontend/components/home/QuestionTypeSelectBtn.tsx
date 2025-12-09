'use client';

import { useState } from 'react';

const QUESTION_TYPES = {'tourist': '観光地', 'gourmet': 'グルメ'};

export default function QuestionTypeSelectBtn() {
    const [type, setType] = useState('tourist');
  
    return (
        <div>
        {Object.entries(QUESTION_TYPES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setType(key)}
            className='border'
          >
            {label}
          </button>
        ))}
        </div>
    );
  }