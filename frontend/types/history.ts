// ユーザーが答えた結果を保存する型を定義
export type QuizHistory = {
  spot_type: string;
  spot_id: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};