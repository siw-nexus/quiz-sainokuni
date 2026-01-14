'use client'

// ▼▼▼ 変更: useStateではなくURL管理用のフックをインポートします ▼▼▼
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
import { QuizHistory } from '@/types/history';

// Propsの定義
type Props = {
  user: User;
  interests: interest[];
  histories: QuizHistory[]; // ▼ 追加: 履歴データを受け取る
}

// タブの種類を定義（'history'を追加）
type TabType = 'profile' | 'interest' | 'history';

export default function ProfileScreen({ user, interests, histories }: Props) {
  // ▼▼▼ 変更: 状態管理をuseStateからURLクエリパラメータに変更 ▼▼▼
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URLから現在のタブを取得 (パラメータがない、または不正なら 'profile' をデフォルトにする)
  const tabParam = searchParams.get('tab');
  const activeTab: TabType = (tabParam === 'interest' || tabParam === 'history') ? tabParam : 'profile';

  // タブ切り替え時にURLを書き換える関数
  const handleTabChange = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    // ページトップへのスクロールを防ぎつつURLを更新
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
            // ▼▼▼ 変更: クリック時の処理をhandleTabChangeに変更 ▼▼▼
            onClick={() => handleTabChange('profile')}
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
            // ▼▼▼ 変更: クリック時の処理をhandleTabChangeに変更 ▼▼▼
            onClick={() => handleTabChange('interest')}
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
            // ▼▼▼ 変更: クリック時の処理をhandleTabChangeに変更 ▼▼▼
            onClick={() => handleTabChange('history')}
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
                <HistoryList histories={histories} interests={interests}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}