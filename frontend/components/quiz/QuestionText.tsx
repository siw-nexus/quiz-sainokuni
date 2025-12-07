'use client'

// questionsの型を定義
type Question = {
  id: number;
  spot_type: 'tourist' | 'gourmet';
  spot_id: number;
  question_text: string;
}

type Props = {
  questions: Question[];
}


export default function QuestionText({ questions }: Props) {
  if (!questions || questions.length === 0) {
    console.log(questions);
    return <p>問題を読み込んでいます...</p>;
  }
  return (
    <p>問題：{questions[0]?.question_text}</p>
  );
}