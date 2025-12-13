'use client';

// 選択肢の型を定義
import { OptionOnly } from '@types/question'

type Props = {
  options: OptionOnly[];
  onResult: (isCorrect: boolean) => void;
}

export default function OptionBtn({ options, onResult }: Props) {
  return (
    // 2列のグリッドレイアウト (grid-cols-2) でボタンを配置
    <div className="grid grid-cols-2 gap-4 w-full">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onResult(option.is_correct === 1)} // 正誤判定をする関数を呼び出し
          className="
            bg-[#333333] 
            hover:bg-black 
            text-white 
            font-bold 
            text-lg
            rounded-2xl 
            shadow-lg 
            p-4
            min-h-[120px] 
            flex items-center justify-center 
            transition-all duration-200 
            active:scale-95
          "
        >
          {option.option_text}
        </button>
      ))}
    </div>
  );
}