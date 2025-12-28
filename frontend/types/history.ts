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