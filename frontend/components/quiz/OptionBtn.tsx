'use client';

// 型を定義をインポート
import { Option } from '@/types/question';

type Props = {
  options: Option[];
  onResult: (isCorrect: boolean, selectedText: string) => void;
}

export default function OptionBtn({ options, onResult }: Props) {
  return (
    // 2列のグリッドレイアウト (grid-cols-2) でボタンを配置
    <div className="grid grid-cols-2 gap-4 w-full">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onResult(option.is_correct, option.option_text, option.id)} // 正誤判定をする関数を呼び出し
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