'use client'

import { useState } from 'react';
// ▼▼▼ 追加: リンク作成用のコンポーネントをインポート ▼▼▼
import Link from 'next/link';

// コンポーネントをインポート
import ProfileHeader from "./ProfileHeader"
import InterestList from './InterestList';

// 型の定義をインポート
import { User } from "@/types/user";
import { interest } from '@/types/interest';

// Propsの定義
// ▼ 修正: interests は配列データなので interest[] に修正しました
type Props = {
  user: User;
  interests: interest[];
}

// ▼ タブの種類を定義（誤字を防ぐため）
type TabType = 'profile' | 'interest';

export default function ProfileScreen({ user, interests }: Props) {
  // ▼ 状態管理を改善: true/falseの2つではなく、現在のモードを1つの文字列で管理します
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // プロフィールボタンを押したら実行する関数
  // ▼ ボタンクリックでモードを 'profile' に切り替えます
  const handleProfile = () => {
    if (activeTab === 'profile') return;
    setActiveTab('profile');
  }

  // 興味がある一覧ボタンを押したら実行する関数
  // ▼ ボタンクリックでモードを 'interest' に切り替えます
  const handleInterest = () => {
    if (activeTab === 'interest') return;
    setActiveTab('interest');
  }

  return (
    // ▼ 全体の背景色と余白を設定
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      
      {/* ▼▼▼ 追加: ホームへ戻るボタンのエリア ▼▼▼ */}
      <div className="max-w-3xl mx-auto mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-500 hover:text-black transition-colors font-medium text-sm"
        >
          {/* 戻るアイコン */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          ホームへ戻る
        </Link>
      </div>
      {/* ▲▲▲ 追加終了 ▲▲▲ */}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        
        {/* ▼ タブ切り替えボタンのエリア */}
        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 py-4 text-sm font-bold transition-colors duration-200 ${
              activeTab === 'profile' 
                ? 'text-black border-b-2 border-black bg-blue-50/30' // 選択中のスタイル
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'    // 未選択のスタイル
            }`}
            onClick={handleProfile}
          >
            プロフィール
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-bold transition-colors duration-200 ${
              activeTab === 'interest' 
                ? 'text-black border-b-2 border-black bg-blue-50/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={handleInterest}
          >
            興味がある一覧
          </button>
        </div>

        {/* ▼ コンテンツ表示エリア */}
        <div className="p-6 md:p-8">
          {/* ▼ activeTab が 'profile' の時だけ表示 */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <ProfileHeader user={user} />
            </div>
          )}

          {/* ▼ activeTab が 'interest' の時だけ表示 */}
          {activeTab === 'interest' && (
            <div className="animate-in fade-in duration-300">
              <InterestList interests={interests}/>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}