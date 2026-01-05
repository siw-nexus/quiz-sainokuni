'use client'

import Link from 'next/link';

// 型の定義をインポート
import { NearbySpot } from "@/types/spot";

// Propsを定義
type Props = {
  nearbySpots: NearbySpot[]
}

const roundWithScale = (value: number, scale: number) => {
  return Math.round(value * 10 ** scale) / 10 ** scale;
};

export default function NearbySpotsList({ nearbySpots }: Props) {
  // データをフィルタリング（表示判定用）
  const touristSpots = nearbySpots.filter((s) => s.spot_type === 'tourist');
  const gourmetSpots = nearbySpots.filter((s) => s.spot_type === 'gourmet');

  return (
    <div className="space-y-6 mt-6 border-t border-gray-100 pt-6">
      
      {/* 観光地エリア */}
      {touristSpots.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            周辺の観光地
          </h3>
          <div className="grid gap-3">
            {touristSpots.map((nearbySpot) => (
                <div key={nearbySpot.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-blue-50/50 transition duration-200">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="font-bold text-gray-800 text-sm leading-tight">{nearbySpot.name}</p>
                    <span className="text-[10px] font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shrink-0">
                      約{nearbySpot.distance >= 1 ? `${roundWithScale(nearbySpot.distance, 1)}km` : `${Math.round(nearbySpot.distance * 1000)}m`}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href={`/spot_detail?spot_type=${nearbySpot.spot_type}&spot_id=${nearbySpot.id}`}
                      className="text-xs font-bold text-blue-600 bg-white border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition duration-200"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* グルメエリア */}
      {gourmetSpots.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
            周辺のグルメ
          </h3>
          <div className="grid gap-3">
            {gourmetSpots.map((nearbySpot) => (
                <div key={nearbySpot.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-orange-50/50 transition duration-200">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="font-bold text-gray-800 text-sm leading-tight">{nearbySpot.name}</p>
                    <span className="text-[10px] font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shrink-0">
                      約{nearbySpot.distance >= 1 ? `${roundWithScale(nearbySpot.distance, 1)}km` : `${Math.round(nearbySpot.distance * 1000)}m`}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href={`/spot_detail?spot_type=${nearbySpot.spot_type}&spot_id=${nearbySpot.id}`}
                      className="text-xs font-bold text-orange-600 bg-white border border-orange-100 px-3 py-1.5 rounded-full hover:bg-orange-600 hover:text-white hover:border-orange-600 transition duration-200"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* どちらもない場合 */}
      {touristSpots.length === 0 && gourmetSpots.length === 0 && (
         <p className="text-xs text-gray-400 text-center py-4">周辺のスポット情報はありません。</p>
      )}

    </div>
  );
}