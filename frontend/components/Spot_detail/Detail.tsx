'use client'

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
// childrenの型定義のためにReactNodeをインポート
import { ReactNode } from 'react'; 


// 型の定義をインポート
import { Spot } from "@/types/spot";
import { interest } from "@/types/interest";

// コンポーネントをインポート
import InterestBtn from '@/components/ui/InterestBtn';

// Propsの定義
type Props = {
  proSpotDetail: Spot
  interests: interest[]
  spotType: string
  spotId: number
  // 周辺情報などの子要素を受け取れるようにする
  children?: ReactNode;
  isLoggedIn: boolean;
}

// SSRを無効化してMapコンポーネントをインポート
const Map = dynamic(() => import('@/components/Spot_detail/Map'), { 
  ssr: false,
  loading: () => <p>地図を読み込み中...</p> 
});

export default function Detail({ proSpotDetail, interests, spotType, spotId, children, isLoggedIn }: Props) {
  const router = useRouter();
  console.log(isLoggedIn)

  // 「ここに行く」ボタン用のURL (Googleマップのサイトへ遷移)
  const googleMapsLink = `https://www.google.com/maps?q=${proSpotDetail.lat},${proSpotDetail.lon}`;

  return (
    // 外枠：PCでは画面中央に配置し、高さを制限しない（中のカードで制限する）
    <div className="min-h-screen bg-[#F5F5F7] py-4 md:py-8 px-2 md:px-4 font-sans flex justify-center items-center">
      
      {/* メインカード */}
      {/* PC (lg): h-[85vh] で高さを画面の85%に固定し、flex-colで縦方向のレイアウト管理を行う 
         Mobile: h-auto で中身に合わせて自動的に縦に伸びる
      */}
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 lg:h-[85vh] lg:flex lg:flex-col">
        
        {/* 1. ヘッダー画像エリア (削除済み) */}

        {/* --- 2. コンテンツエリア (PC:残りの高さを埋める / Mobile:縦積み) --- */}
        {/* lg:flex-1 lg:overflow-hidden : PCでは残りのスペースを使い、はみ出しを隠す（内部スクロールさせるため） */}
        <div className="lg:flex-1 lg:grid lg:grid-cols-2 lg:overflow-hidden">
          
          {/* --- 【左側】お店の概要 (PC:スクロール可能エリア) --- */}
          {/* lg:overflow-y-auto : PCのみ、文字が溢れたらここだけスクロールさせる */}
          <div className="p-6 lg:p-8 space-y-6 lg:overflow-y-auto custom-scrollbar">
            
            {/* 削除したヘッダーから「戻るボタン」と「タイトル」をここに移動 */}
            <div className="flex items-start gap-4 mb-2">
              <button 
                onClick={() => router.back()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-500 p-2 rounded-full transition shrink-0 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-800 leading-tight">
                {proSpotDetail.name}
              </h1>
            </div>

            <section>
              {/* 境界線(border-b)を削除 */}
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-purple-600">●</span> スポット概要
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                {proSpotDetail.detail || proSpotDetail.description || "詳細情報はありません。"}
              </p>
            </section>

            <section className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address</h3>
              <p className="text-gray-800 font-medium text-sm lg:text-lg">
                {proSpotDetail.address || "住所情報なし"}
              </p>
            </section>

            <section>
              {isLoggedIn && <InterestBtn interests={interests} spotId={spotId} spotType={spotType}/>}
            </section>

            {/* 周辺情報の境界線(border-t)を削除し、余白を調整 */}
            {children && (
              <div className="mt-6">
                 {children}
              </div>
            )}

            {/* スマホの時はここに余白を入れる */}
            <div className="h-4 lg:hidden"></div>
          </div>

          {/* --- 【右側】地図＆ボタン (PC:高さ100%固定 / Mobile:縦積み) --- */}
          {/* lg:border-l : PCのみ左に境界線を入れる */}
          <div className="bg-gray-50 lg:bg-white lg:border-l border-gray-100 flex flex-col h-[400px] lg:h-full">
            
            {/* 地図 (残りのスペースを埋める) */}
            <div className="flex-1 w-full bg-gray-200 relative">
                <Map lat={proSpotDetail.lat} lon={proSpotDetail.lon} zoom={20} spot_name={proSpotDetail.name}/>
            </div>

            {/* ボタンエリア (PC:下部に固定される / Mobile:地図の下) */}
            <div className="p-4 lg:p-6 bg-white border-t border-gray-100 z-10 shrink-0">
              <a
                href={googleMapsLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-[#333] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 group text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  Googleマップで開く
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
