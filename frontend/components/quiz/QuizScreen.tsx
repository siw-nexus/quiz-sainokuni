'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

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
  const [questionCount, setQuestionCount] = useState(1);      // 現在何問目かをカウントする変数
  const [isResponding, setIsResponding] = useState(true);     // 回答中かどうかのフラグ
  const [isCorrectText, setIsCorrectText] = useState('')      // 「正解」か「不正解」の文字列を格納
  const router = useRouter();

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
    // 回答中のフラグをfalseにする
    setIsResponding(false);
    
    if (result) {
      setIsCorrectText("正解");
    } else {
      setIsCorrectText("不正解");
    }
  };

  // 次の問題へ行く関数
  const handleNextQuiz = () => {
    // 次か何問目か
    const nextCount = questionCount + 1;

    // 次の問題へ
    setQuestionCount(questionCount + 1)
    
    // 出題数が取得した問題数を超えたらfinish画面に移動
    if (questions.length < nextCount) {
      router.push('/finish')
    } else {
      // 出題数が取得した問題数を超えていなかったら回答中のフラグをtrueにする
      setIsResponding(true)
    }
  };

  // 回答中フラグがtrueだったら問題と選択肢を表示
  if (isResponding) {
    return (
      <main>
        <p>{questionCount}問目</p>
        <QuestionText questions={questions} questionCount={questionCount}/>
        <OptionBtn questions={questions} spot_type={spot_type} questionCount={questionCount} onResult={handleAnswerResult}/>
      </main>
    );
  } else {
    // 回答中フラグがfalseだったら答えを表示
    return (
      <main>
        <p>{isCorrectText}</p>
        <button onClick={() => handleNextQuiz()}>次の問題へ</button>
      </main>
    );
  }
}