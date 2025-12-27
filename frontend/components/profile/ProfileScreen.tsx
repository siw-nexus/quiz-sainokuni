'use client'

import { useState } from 'react';
// リンク作成用のコンポーネントをインポート
import Link from 'next/link';

// コンポーネントをインポート
import ProfileHeader from "./ProfileHeader"
import InterestList from './InterestList';
// ▼▼▼ 追加: 回答履歴用コンポーネントをインポート ▼▼▼
import HistoryList from './HistoryList';

// 型の定義をインポート
import { User } from "@/types/user";
import { interest } from '@/types/interest';
import { AnswerHistory } from "@/types/question"; // ▼ 追加

// Propsの定義
type Props = {
  user: User;
  interests: interest[];
  histories: AnswerHistory[]; // ▼ 追加: 履歴データを受け取る
}

// タブの種類を定義（'history'を追加）
type TabType = 'profile' | 'interest' | 'history';

export default function ProfileScreen({ user, interests, histories }: Props) {
  // 状態管理: 現在のタブモード
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  console.log("【デバッグ】APIから届いた生の履歴データ:", histories);

  // ▼▼▼ 追加: 回答が空のデータを除外するフィルタリング処理 ▼▼▼
  const filteredHistories = histories.filter(history => {
    // ※注意: 'userAnswer' は実際の回答データが入っているプロパティ名に合わせてください
    // 回答が存在し、かつ空文字でない場合のみ表示リストに残します
    return history.user_answer && history.user_answer !== '';
  });

  return (
    // 全体の背景色と余白を設定
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      
      {/* ホームへ戻るボタンエリア */}
      <div className="max-w-3xl mx-auto mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          ホームへ戻る
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        
        {/* タブ切り替えボタンのエリア */}
        <div className="flex border-b border-gray-100">
          {/* プロフィールタブ */}
          <button 
            className={`flex-1 py-4 text-xs md:text-sm font-bold transition-colors duration-200 ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            プロフィール
          </button>
          
          {/* 興味一覧タブ */}
          <button 
            className={`flex-1 py-4 text-xs md:text-sm font-bold transition-colors duration-200 ${
              activeTab === 'interest' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('interest')}
          >
            興味一覧
          </button>

          {/* ▼▼▼ 追加: 回答履歴タブ ▼▼▼ */}
          <button 
            className={`flex-1 py-4 text-xs md:text-sm font-bold transition-colors duration-200 ${
              activeTab === 'history' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('history')}
          >
            回答履歴
          </button>
        </div>

        {/* コンテンツ表示エリア */}
        <div className="p-6 md:p-8">
          {/* プロフィール表示 */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <ProfileHeader user={user} />
            </div>
          )}

          {/* 興味一覧表示 */}
          {activeTab === 'interest' && (
            <div className="animate-in fade-in duration-300">
              <InterestList interests={interests}/>
            </div>
          )}

          {/* ▼▼▼ 追加: 回答履歴表示 ▼▼▼ */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-300">
              {/* ▼ 高さを制限してスクロールさせるためのdivで囲む ▼ */}
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                {/* ▼ フィルタリング済みのデータを渡すように変更 ▼ */}
                <HistoryList histories={filteredHistories}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}