'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Question = {
  id: number;
  question_text: string;
  questionText?: string;
  userAnswer?: string;
  isCorrect?: boolean;
  correctAnswer?: string;
};

export default function QuizHistory() {
  const [history, setHistory] = useState<Question[]>([]);

  useEffect(() => {
    // チームのコードに合わせて sessionStorage を使用
    const savedData = sessionStorage.getItem('quiz_history');
    if (savedData) {
      setHistory(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      {/* メインカード: 高さを固定(h-...)に変更しました */}
      <div className="w-full max-w-md md:max-w-4xl bg-white h-[80vh] md:h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* 左サイドパネル */}
        <div className="hidden md:flex md:w-1/3 bg-[#333333] text-white p-10 flex-col justify-between relative">
          <div>
            <h1 className="text-3xl font-bold tracking-widest mb-4">HISTORY</h1>
            <p className="text-gray-400 text-sm">
              出題された問題の一覧です。<br/>
              復習に役立てましょう。
            </p>
          </div>

          <Link 
            href={'/'}
            className="mt-auto flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            TOPへ戻る
          </Link>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* 右サイドパネル (リスト表示エリア) */}
        {/* 高さを親に合わせるため h-full に変更し、ボタン配置用に relative を追加 */}
        <div className="flex-1 flex flex-col h-full relative">
          
          {/* PC用閉じるボタン */}
          <Link
            href={'/finish'}
            className="hidden md:flex absolute top-6 right-8 text-gray-400 hover:text-gray-600 transition items-center gap-1 z-10"
          >
            <span className="text-sm font-bold">閉じる</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          {/* スマホ用ヘッダー */}
          <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
            <h1 className="font-bold text-gray-800">出題履歴</h1>
            <Link href={'/finish'} className="text-sm text-gray-500">
              閉じる
            </Link>
          </div>

          {/* リスト部分 (ここだけスクロール) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">履歴がありません</p>
            ) : (
              // 最後の要素が隠れないよう余白を追加
              <div className="space-y-4 pb-20 md:pb-0">
                {history.map((q, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition">
                    <div className="text-xs font-bold text-purple-600 mb-2">
                      Q.{index + 1}
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {q.questionText || q.question_text}
                    </p>
                    {(q.userAnswer !== undefined) && (
                        <div className="mt-2 text-sm">
                            <p className="text-gray-600">
                                {q.userAnswer}：{q.isCorrect ? '正解' : '不正解'}
                            </p>
                            {!q.isCorrect && (
                                <p className="text-gray-600">
                                    正解は...{q.correctAnswer}
                                </p>
                            )}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* スマホ用下部ボタンエリア */}
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