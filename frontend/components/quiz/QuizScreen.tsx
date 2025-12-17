'use client';

import { useState } from 'react';
import Link from 'next/link';

import QuestionText from "./QuestionText";
import OptionBtn from "./OptionBtn";

import { Question } from "@/types/question";
// QuizHistoryの型定義を変更する必要があるため、ここで拡張しておきます
import { QuizHistory } from '@/types/history';

// 履歴データの型を拡張（spot_idなどを追加）
type ExtendedQuizHistory = QuizHistory & {
  spot_id: number;
  spot_type: string;
};

type Props = {
  spot_type: 'tourist' | 'gourmet';
  limit: number;
  questions: Question[];
}

export default function QuizScreen({ spot_type, limit, questions }: Props) {
  const [questionCount, setQuestionCount] = useState(1);
  const [isResponding, setIsResponding] = useState(true);
  const [isCorrectText, setIsCorrectText] = useState('');
  const [answer, isAnswer] = useState('');
  // 型を拡張したものに変更
  const [history, setHistory] = useState<ExtendedQuizHistory[]>([]);

  const currentQuestion = questions[questionCount - 1];

  const handleAnswerResult = (result: boolean, selectedText: string) => {
    setIsResponding(false);
    if (result) {
      setIsCorrectText("正解！");
    } else {
      setIsCorrectText("不正解...");
    }

    const correctOption = currentQuestion.options.find(opt => opt.is_correct === true);
    const correctText = correctOption?.option_text;

    isAnswer(correctText || '');

    // ▼▼▼ 修正: ここで spot_id と spot_type も保存する ▼▼▼
    const newHistoryItem: ExtendedQuizHistory = {
      questionText: currentQuestion.question_text,
      userAnswer: selectedText,
      correctAnswer: correctText,
      isCorrect: result,
      spot_id: currentQuestion.spot_id, // 追加
      spot_type: spot_type              // 追加
    };

    setHistory((prev) => [...prev, newHistoryItem]);
  };

  const handleNextQuiz = () => {
    setQuestionCount((prev) => prev + 1);
    setIsResponding(true);
  };

  const isLastQuestion = questionCount === questions.length;

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-md md:max-w-6xl bg-white min-h-[600px] md:min-h-[700px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* 左サイドパネル */}
        <div className="hidden md:flex md:w-1/3 bg-[#333333] text-white p-10 flex-col justify-between relative">
          <div>
            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">CATEGORY</p>
            <h1 className="text-3xl font-bold mb-8 capitalize">
              {spot_type === 'tourist' ? '観光地' : 'グルメ'}
            </h1>
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

        {/* 右サイドパネル */}
        <div className="w-full md:w-2/3 flex flex-col relative">
          
          <div className="md:hidden h-14 flex items-center justify-center font-bold text-gray-400 text-sm border-b border-gray-100">
            Q. {questionCount} / {limit}
          </div>

          <div className="flex-1 flex flex-col px-6 py-8 md:px-12 md:py-12 justify-center">
            
            {isResponding ? (
              <>
                <div className="flex-1 flex items-center justify-center mb-10">
                  <div className="text-xl md:text-2xl font-bold text-center leading-relaxed text-gray-800">
                    <QuestionText questions={questions} questionCount={questionCount}/>
                  </div>
                </div>
                <div className="w-full max-w-2xl mx-auto">
                  <OptionBtn options={currentQuestion.options} onResult={handleAnswerResult}/>
                </div>
              </>
            ) : (
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
                  <Link 
                    href={`/spot_detail?spot_type=${spot_type}&spot_id=${currentQuestion.spot_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-white border-2 border-[#333333] text-[#333333] font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                  >
                    興味がある
                  </Link>
                  
                  {isLastQuestion ? (
                    <Link 
                      href="/finish"
                      onClick={() => {
                         sessionStorage.setItem('quiz_history', JSON.stringify(history));
                      }}
                      className="w-full block text-center bg-[#333333] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition"
                    >
                      結果を見る
                    </Link>
                  ) : (
                    <button 
                      onClick={handleNextQuiz}
                      className="w-full bg-[#333333] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition"
                    >
                      次の問題へ
                    </button>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}