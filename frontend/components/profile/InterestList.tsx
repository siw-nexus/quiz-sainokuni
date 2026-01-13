'use client'

// ▼▼▼ 変更: useStateの代わりにURL操作用のフックをインポート ▼▼▼
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

// 型の定義をインポート
import { interest } from "@/types/interest"

// コンポーネントをインポート
import InterestButton from '../ui/InterestBtn';

// Propsの定義
type Props = {
  interests: interest[];
}

// ▼ フィルターの種類を定義
type FilterType = 'tourist' | 'gourmet';

export default function InterestList({ interests }: Props) {
  // ▼▼▼ 変更: URLから状態を管理するためのフック ▼▼▼
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ▼▼▼ 変更: URLの 'type' パラメータを取得して現在のフィルターを決定 ▼▼▼
  // URLに 'type=gourmet' があれば 'gourmet'、それ以外（または指定なし）は 'tourist'
  const typeParam = searchParams.get('type');
  const filterType: FilterType = (typeParam === 'gourmet') ? 'gourmet' : 'tourist';
  
  // データをフィルタリング（表示判定用）
  const displayItems = interests.filter((s) => s.spot_type === filterType);

  // サブコンポーネント（変更なし）
  const SpotCard = ({ item }: { item: interest }) => (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
            item.spot_type === 'tourist' ? 'bg-blue-400' : 'bg-orange-400'
          }`}>
            {item.spot_type === 'tourist' ? '観光' : 'グルメ'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {item.detail}
        </p>
      </div>
      
      <Link
        href={`/spot_detail?spot_type=${item.spot_type}&spot_id=${item.spot_id}`}
        className="mt-auto block text-center w-full py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors"
      >
        詳細を見る
      </Link>
      
      <div className='mt-4'>
        <InterestButton interests={interests} spotType={item.spot_type} spotId={item.spot_id}/>
      </div>
    </div>
  );

  // ▼▼▼ 変更: ボタンを押した時にURLを書き換える関数 ▼▼▼
  const handleFilterChange = (type: FilterType) => {
    // 現在のURLパラメータをコピー
    const params = new URLSearchParams(searchParams.toString());
    // typeパラメータを更新 (例: &type=gourmet)
    params.set('type', type);
    
    // URLを更新 (ページトップへのスクロールを防ぐ)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      {/* ▼ フィルター切り替えボタン */}
      <div className="flex space-x-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filterType === 'tourist'
              ? 'bg-black text-white shadow-md' // 選択中
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' // 未選択
          }`}
          // ▼▼▼ 変更: 新しい関数を使用 ▼▼▼
          onClick={() => handleFilterChange('tourist')}
        >
          観光地
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filterType === 'gourmet'
              ? 'bg-black text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
          // ▼▼▼ 変更: 新しい関数を使用 ▼▼▼
          onClick={() => handleFilterChange('gourmet')}
        >
          グルメ
        </button>
      </div>

      {/* ▼ リスト表示エリア (変更なし) */}
      {displayItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {displayItems.map((spot) => <SpotCard key={spot.id} item={spot} />)}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-sm">
            {filterType === 'tourist' ? '観光地' : 'グルメ'}のお気に入りは登録されていません
          </p>
        </div>
      )}
    </div>
  );
}