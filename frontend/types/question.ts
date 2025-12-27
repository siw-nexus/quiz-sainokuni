// 選択肢の型を定義
export type Option = {
  id: number;
  option_text: string;
  is_correct: boolean;
}

// 問題の型を定義
export type Question = {
  id: number;
  spot_type: 'tourist' | 'gourmet';
  spot_id: number;
  question_text: string;
  options: Option[];
}

// 回答履歴の型を定義 
export type AnswerHistory = {
  question_text: string;       
  user_answer: string;         
  correct_answer: string;      
  is_correct: boolean;         
  spot_id: number;            
  spot_type: 'tourist' | 'gourmet'; 
}