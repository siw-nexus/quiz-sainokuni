// ユーザーが答えた結果を保存する型を定義
export type HistoryItem = {
  questionText: string;
  userAnswerId?: number;
  userAnswer?: string;
  isCorrect?: boolean;
  correctAnswer?: string;
  spot_id?: number;
  spot_type?: string;
};

// 1問ごとの回答履歴の型の定義
export type Answers = {
  id: number;
  question_num: number;
  question_id: number;
  question_text: string;
  correct_answer_text: string;
  choice_id: number
  user_answer_text: string;
  is_correct: boolean
}


// 回答履歴の型の定義
export type QuizHistory = {
  id: number;
  spot_type: 'tourist' | 'gourmet'; 
  score: number;
  total_questions: number;
  play_at: string;
  answers: Answers[];
}