'use client';

import { useRouter } from 'next/navigation';

// 型定義もここでして、外部から使えるようにexportしておきます
export type Question = {
  id: number;
  question_text: string;
};

type Props = {
  history: Question[]; // 親から履歴データを受け取る
};

export default function HistoryList({ history }: Props) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col h-full relative">
      
      {/* PC用閉じるボタン */}
      <button 
        onClick={() => router.push('/finish')}
        className="hidden md:flex absolute top-6 right-8 text-gray-400 hover:text-gray-600 transition items-center gap-1 z-10"
      >
        <span className="text-sm font-bold">閉じる</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* スマホ用ヘッダー */}
      <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
        <h1 className="font-bold text-gray-800">出題履歴 ({history.length}問)</h1>
        <button onClick={() => router.push('/finish')} className="text-sm text-gray-500">
          閉じる
        </button>
      </div>

      {/* リスト部分 (スクロールエリア) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">履歴がありません</p>
        ) : (
          <div className="space-y-4 pb-20 md:pb-0">
            {history.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition">
                <div className="text-xs font-bold text-purple-600 mb-2">
                  Q.{index + 1}
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {q.question_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* スマホ用下部ボタン */}
      <div className="md:hidden p-4 border-t border-gray-100 bg-white shrink-0">
        <button 
          onClick={() => router.push('/')}
          className="w-full bg-[#333333] text-white font-bold py-3 rounded-xl shadow-lg"
        >
          TOPへ戻る
        </button>
      </div>

    </div>
  );
}