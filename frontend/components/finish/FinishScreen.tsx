'use client';

import { useRouter } from 'next/navigation';

export default function FinishScreen() {
  const router = useRouter();

  const handleHomeBtn = () => {
    router.push('/');
  };

  // 「出題した問題を表示」ボタンを押したときの処理
  const handleShowQuestions = () => {
    // ※ここに問題一覧を表示する処理を書く予定（現在はログのみ）
    console.log("出題した問題を表示");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      {/* メインカード */}
      <div className="w-full max-w-md md:max-w-4xl bg-white min-h-[500px] md:min-h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* --- [PC用] 左サイドパネル --- */}
        <div className="hidden md:flex md:w-5/12 bg-[#333333] text-white p-10 flex-col items-center justify-center relative overflow-hidden">
          <div className="relative z-10 text-center">
             <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-yellow-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.625 2.625 0 11-5.25 0v2.875M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v1.5c0 1.398.728 2.64 1.815 3.375a2.624 2.624 0 011.06 2.125V18.75m10.5-11.25h1.875c.621 0 1.125.504 1.125 1.125v1.5c0 1.398-.728 2.64-1.815 3.375a2.624 2.624 0 01-1.06 2.125V18.75m-7.5-1.5h.008v.008h-.008v-.008z" />
                </svg>
             </div>
             <h2 className="text-3xl font-bold tracking-widest mb-2">FINISH</h2>
             <p className="text-gray-400 text-sm">Thank you for playing!</p>
          </div>
          
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* --- [共通] 右サイドパネル --- */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
          
          <div className="mb-10">
            <div className="md:hidden w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-800">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              クイズ終了！
            </h1>
            <p className="text-gray-500 leading-relaxed">
              お疲れさまでした。<br />
              また別のカテゴリにも挑戦してみてください。
            </p>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <button
              onClick={handleHomeBtn}
              className="w-full bg-[#333333] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              ホームへ戻る
            </button>
            
            {/* 変更箇所: シェアボタン -> 出題した問題を表示ボタン */}
            <button 
              onClick={handleShowQuestions}
              className="w-full bg-white border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              出題した問題を表示
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}