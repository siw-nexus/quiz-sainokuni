// 選択肢の型を定義
type Option = {
  id: number;
  option_text: string;
  is_correct: boolean;
}

// 問題の型を定義
type Question = {
  id: number;
  spot_type: 'tourist' | 'gourmet';
  spot_id: number;
  question_text: string;
  options: Option[];
}

// 選択肢だけを受け取る型の定義
type OptionOnly = {
  id: number;
  option_text: string;
  is_correct: boolean;
}
