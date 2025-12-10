'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Question = {
  id: number;
  question_text: string;
  // 他に必要なプロパティがあればここに追加
};

export default function HistoryPage() {
  const [history, setHistory] = useState<Question[]>([]);
  const router = useRouter();

  // 画面が表示されたらセッションストレージから回答履歴を取得
  useEffect(() => {
    const savedData = sessionStorage.getItem('quiz_history');
    if (savedData) {
      setHistory(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      {/* メインカード */}
      <div className="w-full max-w-md md:max-w-4xl bg-white min-h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- [PC用] 左サイドパネル --- */}
        <div className="hidden md:flex md:w-1/3 bg-[#333333] text-white p-10 flex-col justify-between relative">
          <div>
            <h1 className="text-3xl font-bold tracking-widest mb-4">HISTORY</h1>
            <p className="text-gray-400 text-sm">
              出題された問題の一覧です。<br/>
              復習に役立てましょう。
            </p>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="mt-auto flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            TOPへ戻る
          </button>

          {/* 背景装飾 */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* --- [共通] 右サイドパネル (リスト表示エリア) --- */}
        <div className="flex-1 flex flex-col h-[600px] md:h-auto">
          
          {/* スマホ用ヘッダー */}
          <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-10">
            <h1 className="font-bold text-gray-800">出題履歴</h1>
            <button onClick={() => router.push('/finish')} className="text-sm text-gray-500">
              閉じる
            </button>
          </div>

          {/* リスト部分 (スクロール可能に) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">履歴がありません</p>
            ) : (
              <div className="space-y-4">
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

          {/* スマホ用下部ボタンエリア */}
          <div className="md:hidden p-4 border-t border-gray-100 bg-white">
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-[#333333] text-white font-bold py-3 rounded-xl shadow-lg"
            >
              TOPへ戻る
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}