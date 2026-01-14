'use client'

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  children?: ReactNode;
  isLoggedIn: boolean;
}

// SSRを無効化してMapコンポーネントをインポート
const Map = dynamic(() => import('@/components/Spot_detail/Map'), { 
  ssr: false,
  loading: () => <p className="p-4 text-gray-500 text-sm">地図を読み込み中...</p> 
});

export default function Detail({ proSpotDetail, interests, spotType, spotId, children, isLoggedIn }: Props) {
  const router = useRouter();

  // 「ここに行く」ボタン用のURL (Googleマップ)
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${proSpotDetail.lat},${proSpotDetail.lon}`;

  // 営業時間をいい感じに表示する関数
  // touristは available_time、gourmetは start_time/finish_time を持っている場合があるため両対応
  const displayBusinessHours = () => {
    if (proSpotDetail.start_time == '-' || proSpotDetail.finish_time == '-') return '営業時間情報なし';
    const formatTime = (time: string) => {
      const parts = time.split(':');
      return `${parts[0]}:${parts[1]}`;
    };
    return `${formatTime(proSpotDetail.start_time)} ～ ${formatTime(proSpotDetail.finish_time)}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-4 md:py-8 px-2 md:px-4 font-sans flex justify-center items-center">
      
      {/* メインカード */}
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 lg:h-[90vh] lg:flex lg:flex-col">
        
        <div className="lg:flex-1 lg:grid lg:grid-cols-2 lg:overflow-hidden">
          
          {/* --- 【左側】情報エリア (スクロール可能) --- */}
          <div className="p-6 lg:p-8 space-y-8 lg:overflow-y-auto custom-scrollbar bg-white">
            
            {/* 1. ヘッダー（戻るボタン ＆ タイトル） */}
            <div className="flex items-start gap-4">
              <button 
                onClick={() => router.back()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-500 p-2 rounded-full transition shrink-0 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-800 leading-tight mb-2">
                  {proSpotDetail.name}
                </h1>
                {/* グルメのカテゴリがあればバッジ表示 */}
                {proSpotDetail.category && (
                  <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md">
                    {proSpotDetail.category}
                  </span>
                )}
              </div>
            </div>

            {/* 2. メインの概要 */}
            <section>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span> 概要
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                {proSpotDetail.detail || "詳細情報はありません。"}
              </p>
            </section>

            {/* 3. 詳細データグリッド（2列で表示） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 住所 */}
              <InfoCard title="Address" icon={<MapPinIcon />}>
                {proSpotDetail.address || "住所情報なし"}
              </InfoCard>

              {/* 営業時間 */}
              <InfoCard title="Open" icon={<ClockIcon />}>
                {displayBusinessHours()}
              </InfoCard>

              {/* 電話番号（もしカラムにあれば表示、なければ情報なし） */}
              <InfoCard title="Tel" icon={<PhoneIcon />}>
                {proSpotDetail.tel || "電話番号情報なし"}
              </InfoCard>

              {/* 特産品（グルメ用） - データがある時だけ表示 */}
              {proSpotDetail.tokusanhin && (
                <InfoCard title="Specialty" icon={<TagIcon />}>
                  {proSpotDetail.tokusanhin}
                </InfoCard>
              )}
            </div>

            {/* 4. 備考 (notes) */}
            <section className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <InfoIcon /> 備考・その他
              </h3>
              <p className="text-gray-800 font-medium text-sm whitespace-pre-wrap">
                {proSpotDetail.notes || "特記事項はありません"}
              </p>
            </section>

            {/* 5. 公式ホームページ */}
            <section className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <GlobeIcon /> Official Website
              </h3>
              {proSpotDetail.hp_url ? (
                <a
                  href={proSpotDetail.hp_url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold text-sm lg:text-base hover:underline flex items-center gap-2 break-all group"
                >
                  {proSpotDetail.hp_url}
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
              ) : (
                <p className="text-gray-400 text-sm">公式ホームページ情報なし</p>
              )}
            </section>

            {/* 6. お気に入りボタン */}
            <div className="pt-2">
              {isLoggedIn && <InterestBtn interests={interests} spotId={spotId} spotType={spotType}/>}
            </div>

            {/* 7. 周辺スポット（子要素） */}
            {children && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                 {children}
              </div>
            )}
            
            {/* スマホ用余白 */}
            <div className="h-8 lg:hidden"></div>
          </div>

          {/* --- 【右側】地図＆アクション (固定表示) --- */}
          <div className="bg-gray-50 lg:border-l border-gray-100 flex flex-col h-[400px] lg:h-full">
            <div className="flex-1 w-full bg-gray-200 relative">
                <Map lat={proSpotDetail.lat} lon={proSpotDetail.lon} zoom={16} spot_name={proSpotDetail.name}/>
            </div>
            
            {/* Googleマップボタン */}
            <div className="p-4 lg:p-6 bg-white border-t border-gray-100 z-10 shrink-0">
              <a
                href={googleMapsLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  Googleマップで経路を見る
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- 以下、小さなコンポーネント定義 ---

// 情報カード用コンポーネント
const InfoCard = ({ title, children, icon }: { title: string, children: ReactNode, icon: ReactNode }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
      {icon} {title}
    </h3>
    <p className="text-gray-800 font-medium text-sm break-words">
      {children}
    </p>
  </div>
);

// アイコン類 (Heroicons v2 style)
// 地図のピンアイコン
const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

// 時計のアイコン
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// 電話のアイコン
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

// 地球儀のアイコン
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

// タグのアイコン
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

// インフォメーションアイコン
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

// 外部リンクアイコン
const ArrowTopRightOnSquareIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);