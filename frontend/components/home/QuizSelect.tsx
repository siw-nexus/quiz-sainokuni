'use client';

import { useState } from 'react';
import Link from 'next/link';

const DESCRIPTION_CONTENT = (
  <div className="text-sm leading-relaxed text-gray-200 space-y-2">
    <p>埼玉県の魅力を再発見するクイズアプリへようこそ。</p>
    <ul className="list-disc list-inside pl-2 space-y-1">
      <li>お好きなジャンルを選択してください</li>
      <li>問題数は5問から選べます</li>
    </ul>
    <p className="text-xs text-gray-400 mt-2">※全問正解を目指して頑張ってください！</p>
  </div>
);


// 問題数の選択肢
const QUESTION_COUNTS = [5, 10, 15];

// 問題の種類
const QUESTION_TYPES = [
  { key: 'gourmet', label: 'グルメ' },
  { key: 'tourist', label: '観光地' },
];

export default function QuizSelect() {
  const [showDescription, setShowDescription] = useState(false);
  const [count, setCount] = useState(5);


  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      
      {/* メインカードコンテナ 
        PC(md以上): max-w-5xl で幅広にし、flex-row で左右横並びにする
        スマホ: 縦並び (flex-col)
      */}
      <div className="bg-white w-full max-w-md md:max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* --- 左側：ブランディングエリア (PCのみ表示される装飾エリア、スマホではヘッダー風になる) --- */}
        <div className="bg-[#333333] text-white p-8 md:w-1/2 flex flex-col justify-between relative">
          {/* 説明ボタン */}
          <div className="relative z-10">
            {/* ボタン自体に onClick を追加し、アイコンなどを装飾 */}
            <button 
              onClick={() => setShowDescription(!showDescription)}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 px-5 rounded-lg backdrop-blur-sm transition flex items-center gap-2"
            >
              {/* アイコン（装飾用） */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              {/* stateに合わせて文字を変える */}
              {showDescription ? '閉じる' : '説明'}
            </button>

            {/* showDescription が true の時だけ表示されるエリア */}
            {showDescription && (
              <div className="mt-4 p-4 bg-white/10 border border-white/10 rounded-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
                {DESCRIPTION_CONTENT}
              </div>
            )}
          </div>

          <div className="mt-8 md:mt-0">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              クイズ彩の国
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              あなたの知識を試してみよう。<br className="hidden md:block"/>
              カテゴリを選んでクイズをスタート。
            </p>
          </div>
          
          {/* 装飾用サークル (背景デザイン) */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* --- 右側：操作エリア --- */}
        <div className="flex-1 bg-white p-8 md:p-12 flex flex-col relative">
          
          {/* ユーザーアイコンエリア */}
          <div className="flex justify-end mb-8 md:mb-12">
             <div className="relative group">
              {/* アイコン本体（ここはただの画像として表示） */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-purple-200 text-purple-600 bg-purple-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>

              {/* ▼▼▼ 吹き出し部分を Link に変更 ▼▼▼ */}
              {/* pointer-events-none を削除し、カーソルが指になるよう hover 効果を追加 */}
              <Link 
                href="/login"
                className="absolute top-14 right-0 bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-bounce whitespace-nowrap hover:bg-purple-200 transition cursor-pointer z-10"
              >
                login
              </Link>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            
            {/* 問題数選択 */}
            <div className="mb-10">
              <label className="block text-gray-500 text-sm font-bold mb-3 pl-1">
                問題数を選択
              </label>
              <div className="relative">
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-lg py-4 px-5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#333] focus:border-transparent cursor-pointer transition"
                >
                  {QUESTION_COUNTS.map((c) => (
                    <option key={c} value={c}>
                      {c}問
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* カテゴリボタン */}
            <div className="space-y-4">
              <p className="text-gray-500 text-sm font-bold pl-1 mb-2">ジャンルを選択</p>
              {QUESTION_TYPES.map((type) => (
                <Link
                  href={`/quiz?spot_type=${type.key}&limit=${count}`}
                  key={type.key}
                  className="w-full bg-[#333333] hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-between items-center group"
                >
                  <span>{type.label}</span>
                  {/* ホバー時に動く矢印 */}
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}