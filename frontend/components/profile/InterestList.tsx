'use client'

import { useState } from 'react';
import Link from 'next/link';

// 型の定義をインポート
import { interest } from "@/types/interest"

// Propsの定義
type Props = {
  interests: interest[];
}

// ▼ フィルターの種類を定義
type FilterType = 'tourist' | 'gourmet';

export default function InterestList({ interests }: Props) {
  // ▼ 状態管理を修正: 文字列で管理することで「両方false」や「両方true」を防ぎます
  const [filterType, setFilterType] = useState<FilterType>('tourist');
  
  // データをフィルタリング（表示判定用）
  // ▼ 選択されているフィルタータイプと一致するデータだけを抽出します
  const displayItems = interests.filter((s) => s.spot_type === filterType);

  // サブコンポーネントを作成
  // ▼ リストアイテム（カード）のデザインコンポーネント
  const SpotCard = ({ item }: { item: interest }) => (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          {/* ▼ カテゴリラベル（色分け） */}
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
      
      {/* ▼ 詳細ページへのリンクボタン */}
      <Link
        href={`/spot_detail?spot_type=${item.spot_type}&spot_id=${item.spot_id}`}
        className="mt-auto block text-center w-full py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors"
      >
        詳細を見る
      </Link>
    </div>
  );

  // 観光地ボタンを押したら実行する関数
  // ▼ フィルターを 'tourist' にセット
  const handleTourist = () => {
    setFilterType('tourist');
  }

  // グルメボタンを押したら実行する関数
  // ▼ フィルターを 'gourmet' にセット
  const handleGourmet = () => {
    setFilterType('gourmet');
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
          onClick={handleTourist}
        >
          観光地
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filterType === 'gourmet'
              ? 'bg-black text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={handleGourmet}
        >
          グルメ
        </button>
      </div>

      {/* ▼ リスト表示エリア */}
      {displayItems.length > 0 ? (
        // ▼ データがある場合はグリッド表示（map関数で繰り返し表示）
        <div className="grid gap-4 sm:grid-cols-2">
          {displayItems.map((spot) => <SpotCard key={spot.id} item={spot} />)}
        </div>
      ) : (
        // ▼ データがない場合のメッセージ表示
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-sm">
            {filterType === 'tourist' ? '観光地' : 'グルメ'}のお気に入りは登録されていません
          </p>
        </div>
      )}
    </div>
  );
}