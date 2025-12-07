'use client';

import { useState, useEffect } from 'react';

// questionsの型を定義
type Question = {
  id: number;
  spot_type: 'tourist' | 'gourmet';
  spot_id: number;
  question_text: string;
}

// 選択肢の型を定義
type Option = {
  id: number;
  option_text: string;
  is_correct: number;
}

type Props = {
  questions: Question[];
  spot_type: 'tourist' | 'gourmet';
}

// 選択肢を取得する関数
const getOptions = async (apiUrl: string, spot_type: 'tourist' | 'gourmet', spot_id: number): Promise<Option[]> => {
  console.log(`${apiUrl}/option?spot_type=${spot_type}&spot_id=${spot_id}`);
  // 選択肢を取得する
  const res = await fetch(
    `${apiUrl}/option?spot_type=${spot_type}&spot_id=${spot_id}`,
    { cache: "no-cache"} // キャッシュを無効化
  );

  // レスポンスの確認
  if (!res.ok) {
    throw new Error("選択肢の取得に失敗しました");
  }

  const options = await res.json();

  return options;
}

// 正誤判定をする関数
const handleOption = (is_correct: number) => {
  if (is_correct === 1) {
    console.log('正解');
  } else {
    console.log('不正解');
  }
}


export default function OptionBtn({ questions, spot_type }: Props) {
  const [options, setOptions] = useState<Option[]>([]);

  // APIのエンドポイント
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // questions[0]が存在するかチェック
        if (questions && questions.length > 0) {
            const data = await getOptions(apiUrl, spot_type, questions[0].id);
            setOptions(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchOptions();
  }, [apiUrl, spot_type, questions]);

  return (
    <div>
      {options.map((option) => (
        <button
          key={option.id}
          className='border'
          onClick={() => handleOption(option.is_correct)} // 正誤判定をする関数を呼び出し
        >
          {option.option_text}
        </button>
      ))}
    </div>
  );
}