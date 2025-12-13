'use client'

// 型の定義をインポート
import { Question } from '@/types/question';


type Props = {
  questions: Question[];
  questionCount: number;
}


export default function QuestionText({ questions, questionCount }: Props) {
  if (!questions || questions.length === 0) {
    console.log(questions);
    return <p>問題を読み込んでいます...</p>;
  }
  return (
    <p>問題：{questions[questionCount - 1]?.question_text}</p>
  );
}