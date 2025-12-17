'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 型定義（保存データに合わせて拡張）
type HistoryItem = {
  questionText: string;
  userAnswer?: string;
  isCorrect?: boolean;
  correctAnswer?: string;
  // 追加したID情報
  spot_id?: number;
  spot_type?: string;
};

export default function QuizHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedData = sessionStorage.getItem('quiz_history');
    if (savedData) {
      setHistory(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-md md:max-w-4xl bg-white h-[80vh] md:h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* 左サイドパネル */}
        <div className="hidden md:flex md:w-1/3 bg-[#333333] text-white p-10 flex-col justify-between relative">
          <div>
            <h1 className="text-3xl font-bold tracking-widest mb-4">HISTORY</h1>
            <p className="text-gray-400 text-sm">
              出題された問題の一覧です。<br/>
              復習に役立てましょう。<br/>
              <span className="text-xs text-gray-500 mt-2 block">※クリックで詳細へ</span>
            </p>
          </div>

          <Link 
            href={'/'}
            className="mt-auto flex items-center gap-2 text-gray-300 hover:text-white transition group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            TOPへ戻る
          </Link>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* 右サイドパネル */}
        <div className="flex-1 flex flex-col h-full relative">
          
          <Link
            href={'/finish'}
            className="hidden md:flex absolute top-6 right-8 text-gray-400 hover:text-gray-600 transition items-center gap-1 z-10"
          >
            <span className="text-sm font-bold">閉じる</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
            <h1 className="font-bold text-gray-800">出題履歴</h1>
            <Link href={'/finish'} className="text-sm text-gray-500">
              閉じる
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">履歴がありません</p>
            ) : (
              <div className="space-y-4 pb-20 md:pb-0">
                {history.map((q, index) => {
                  // ▼▼▼ 修正: リンクを作成（IDがない場合はリンクなしのdivにする） ▼▼▼
                  const linkHref = q.spot_id && q.spot_type 
                    ? `/spot_detail?spot_type=${q.spot_type}&spot_id=${q.spot_id}` 
                    : null;
                  
                  const Content = (
                    <div className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition group cursor-pointer relative">
                       {/* リンクがある場合のみ右上に矢印を表示 */}
                       {linkHref && (
                         <div className="absolute top-5 right-5 text-gray-300 group-hover:text-purple-500 transition">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                           </svg>
                         </div>
                       )}

                      <div className="text-xs font-bold text-purple-600 mb-2">
                        Q.{index + 1}
                      </div>
                      <p className="text-gray-800 font-medium leading-relaxed pr-6">
                        {q.questionText}
                      </p>
                      
                      {(q.userAnswer !== undefined) && (
                          <div className="mt-2 text-sm">
                              <p className="text-gray-600">
                                  {q.userAnswer}：
                                  <span className={q.isCorrect ? "text-red-500 font-bold ml-1" : "text-blue-500 font-bold ml-1"}>
                                    {q.isCorrect ? '正解' : '不正解'}
                                  </span>
                              </p>
                              {!q.isCorrect && (
                                  <p className="text-gray-500 mt-1 text-xs">
                                      正解は...{q.correctAnswer}
                                  </p>
                              )}
                          </div>
                      )}
                    </div>
                  );

                  // リンクがあれば Link でラップ、なければそのまま表示
                  return linkHref ? (
                    <Link key={index} href={linkHref} target="_blank" rel="noopener noreferrer">
                      {Content}
                    </Link>
                  ) : (
                    <div key={index}>{Content}</div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="md:hidden p-4 border-t border-gray-100 bg-white shrink-0">
            <Link 
              href={'/'}
              className="w-full block text-center bg-[#333333] text-white font-bold py-3 rounded-xl shadow-lg"
            >
              TOPへ戻る
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}