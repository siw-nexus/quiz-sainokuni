'use client';


// 選択肢の型を定義
type Option = {
  id: number;
  option_text: string;
  is_correct: number;
  detail: string | null;
  address: string | null;
  lat: string | null;
  lon: string | null;
  availavle_time: string | null;
  closure_info: string | null;
  category: string | null;
  tokusanhin: string | null;
  start_time: string | null;
  finish_time: string | null;
  notes: string | null;
  tel: string | null;
  hp_url: string | null;
  img: string | null;
}

type Props = {
  options: Option[];
  onResult: (isCorrect: boolean) => void;
}


export default function OptionBtn({ options, onResult }: Props) {
  return (
    <div>
      {options.map((option) => (
        <button
          key={option.id}
          className='border'
          onClick={() => onResult(option.is_correct === 1)} // 正誤判定をする関数を呼び出し
        >
          {option.option_text}
        </button>
      ))}
    </div>
  );
}