'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 作成したコンポーネントと型をインポート
import HistoryList, { Question } from '@/components/history/HistoryList';

export default function HistoryPage() {
  const [history, setHistory] = useState<Question[]>([]);
  const router = useRouter();

  // 画面が表示されたらローカルストレージからデータを取得
  useEffect(() => {
    const savedData = localStorage.getItem('quiz_history');
    if (savedData) {
      setHistory(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      {/* メインカード */}
      <div className="w-full max-w-md md:max-w-4xl bg-white h-[80vh] md:h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- [PC用] 左サイドパネル --- */}
        <div className="hidden md:flex md:w-1/3 bg-[#333333] text-white p-10 flex-col justify-between relative">
          <div>
             <h1 className="text-3xl font-bold tracking-widest mb-4">HISTORY</h1>
             <p className="text-gray-400 text-sm">
               全{history.length}問<br/>
               出題された問題の一覧です。<br/>
               復習に役立てましょう。
             </p>
          </div>
          
          <button 
            onClick={() => router.push('/')}
            className="mt-auto flex items-center gap-2 text-gray-300 hover:text-white transition group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            TOPへ戻る
          </button>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* --- [共通] 右サイドパネル (コンポーネント化) --- */}
        {/* 取得した履歴データ(history)を渡すだけでOK */}
        <HistoryList history={history} />

      </div>
    </div>
  );
}