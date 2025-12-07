'use client'

import { useState, useEffect } from 'react';

// コンポーネントのインポート
import QuestionText from "./QuestionText";
import OptionBtn from "./OptionBtn";

// questionsの型を定義
type Question = {
  id: number;
  spot_type: 'tourist' | 'gourmet';
  spot_id: number;
  question_text: string;
}

type Props = {
  spot_type: 'tourist' | 'gourmet';
  limit: number;
  onResult: boolean;
}

export default function QuizScreen({ spot_type, limit, onResult }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]); // 問題文を格納
  const [questionCount, setQuestionCount] = useState(1);

  // APIのエンドポイント
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // 問題文を取得する
  useEffect(() => {
    const fetchQuestions = async (apiUrl: string, spot_type: 'tourist' | 'gourmet', limit: number) => {
      const res = await fetch(
        `${apiUrl}/question?spot_type=${spot_type}&limit=${limit}`,
        { cache: "no-cache"} // キャッシュを無効化
      )

      // レスポンスの確認
      if (!res.ok) {
        throw new Error("問題の取得に失敗しました");
      }

      // レスポンスの中身を取得
      const data = await res.json();

      setQuestions(data);
    };

    fetchQuestions(apiUrl, spot_type, limit);
  }, []);


  // OptionBtnコンポーネントから正誤判定の結果を受け取る
  const handleAnswerResult = (result: boolean) => {
    if (result === true) {
      console.log("正解");
    } else {
      console.log("残念");
    }

    // 次の問題
    setQuestionCount(questionCount + 1)
  };


  return (
    <main>
      <QuestionText questions={questions} questionCount={questionCount}/>
      <OptionBtn questions={questions} spot_type={spot_type} questionCount={questionCount} onResult={handleAnswerResult}/>
    </main>
  )
}