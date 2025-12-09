'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

// コンポーネントのインポート
import QuestionText from "./QuestionText";
import OptionBtn from "./OptionBtn";

// questionsの型を定義
type Question = {
  id: number;
  spot_type: 'tourist' | 'gourmet';
  spot_id: number;
  question_text: string;
}

// optionsの型を定義
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

// Propsの定義
type Props = {
  spot_type: 'tourist' | 'gourmet' | undefined;
  limit: number | undefined;
}

export default function QuizScreen({ spot_type, limit }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [questionCount, setQuestionCount] = useState(1);
  const [isResponding, setIsResponding] = useState(true);
  const [isCorrectText, setIsCorrectText] = useState('');
  const [answer, isAnswer] = useState('');
  const router = useRouter();

  // APIのエンドポイント
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // 問題文を取得
  useEffect(() => {
    if (!spot_type || !limit) return;
    const fetchQuestions = async (apiUrl: string, spot_type: string, limit: number) => {
      try {
        const res = await fetch(
          `${apiUrl}/question?spot_type=${spot_type}&limit=${limit}`,
          { cache: "no-cache"} 
        );
        if (!res.ok) throw new Error("問題の取得に失敗しました");
        const data = await res.json();
        setQuestions(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchQuestions(apiUrl, spot_type, limit);
  }, [apiUrl, spot_type, limit]);


  // 選択肢を取得
  useEffect(() => {
    const fetchOptions = async () => {
      if (!questions[questionCount - 1]) return;
      try {
        const res = await fetch(
          `${apiUrl}/option?spot_type=${spot_type}&spot_id=${questions[questionCount - 1].spot_id}`,
          { cache: "no-cache"}
        );
        if (!res.ok) throw new Error("選択肢の取得に失敗しました");
        const data = await res.json();
        setOptions(data);
      } catch (e) {
        console.error(e);
      }
    };
    
    if (questions.length > 0 && questions.length >= questionCount){
      fetchOptions();
    }
  }, [questions, questionCount, apiUrl, spot_type]);


  // 正誤判定
  const handleAnswerResult = (result: boolean) => {
    setIsResponding(false);
    if (result) {
      setIsCorrectText("正解！");
    } else {
      setIsCorrectText("不正解...");
    }
    const correctOption = options.find(item => item.is_correct === 1);
    isAnswer(correctOption?.option_text || '');
  };

  // 次の問題へ
  const handleNextQuiz = () => {
    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);
    
    if (questions.length < nextCount) {
      // ▼▼▼ ここに追加しました (手順1) ▼▼▼
      // クイズ終了時に、今回の問題データをブラウザに保存する
      localStorage.setItem('quiz_history', JSON.stringify(questions));
      // ▲▲▲ 追加終わり ▲▲▲

      router.push('/finish');
    } else {
      setIsResponding(true);
    }
  };

  // --- レンダリング ---
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      {/* メインコンテナ */}
      <div className="w-full max-w-md md:max-w-6xl bg-white min-h-[600px] md:min-h-[700px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- [PC用] 左サイドパネル --- */}
        <div className="hidden md:flex md:w-1/3 bg-[#333333] text-white p-10 flex-col justify-between relative">
          <div>
            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">CATEGORY</p>
            <h1 className="text-3xl font-bold mb-8 capitalize">{spot_type === 'tourist' ? '観光地' : spot_type === 'gourmet' ? 'グルメ' : 'イベント'}</h1>
          </div>
          
          <div className="relative z-10">
            <div className="text-6xl font-black mb-2 opacity-20 absolute -top-10 -left-4">Q.{questionCount}</div>
            <p className="text-lg font-medium text-gray-300">
              全{limit}問中、<br />
              <span className="text-4xl text-white font-bold">{questionCount}</span> 問目に挑戦中
            </p>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        </div>

        {/* --- [共通] 右サイドパネル --- */}
        <div className="w-full md:w-2/3 flex flex-col relative">
          
          {/* スマホ用ヘッダー */}
          <div className="md:hidden h-14 flex items-center justify-center font-bold text-gray-400 text-sm border-b border-gray-100">
            Q. {questionCount} / {limit}
          </div>

          {/* コンテンツエリア */}
          <div className="flex-1 flex flex-col px-6 py-8 md:px-12 md:py-12 justify-center">
            
            {isResponding ? (
              /* --- 出題中 --- */
              <>
                <div className="flex-1 flex items-center justify-center mb-10">
                  <div className="text-xl md:text-2xl font-bold text-center leading-relaxed text-gray-800">
                    <QuestionText questions={questions} questionCount={questionCount}/>
                  </div>
                </div>
                <div className="w-full max-w-2xl mx-auto">
                   <OptionBtn options={options} onResult={handleAnswerResult}/>
                </div>
              </>
            ) : (
              /* --- 結果表示 --- */
              <div className="flex-1 flex flex-col items-center justify-center animate-pulse-once max-w-lg mx-auto w-full">
                <div className="text-center mb-12">
                  <h2 className={`text-5xl md:text-6xl font-black mb-6 ${isCorrectText.includes("正解") ? "text-red-500" : "text-blue-600"}`}>
                    {isCorrectText}
                  </h2>
                  <div className="text-gray-500 font-bold mb-2">正解は...</div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 border-b-4 border-gray-200 pb-2 inline-block">
                    {answer}
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <button className="w-full bg-white border-2 border-[#333333] text-[#333333] font-bold py-4 rounded-xl hover:bg-gray-50 transition">
                    興味がある
                  </button>
                  <button 
                    onClick={() => handleNextQuiz()}
                    className="w-full bg-[#333333] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition"
                  >
                    次の問題へ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}