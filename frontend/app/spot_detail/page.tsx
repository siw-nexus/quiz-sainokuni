import Detail from "@/components/Spot_detail/Detail";
// ▼ DetailFooterBtn は不要になったので削除
// import DetailFooterBtn from "@/components/Spot_detail/DetailFooterBtn";

import { Spot } from "@/types/spot";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

// 戻り値を Spot | null に変更して安全性を向上
const getSpot = async (spotType: string, spotId: number): Promise<Spot | null> => {
  try {
    if (!spotId) return null;

    const res = await fetch(`${apiUrl}/spot?spot_type=${spotType}&spot_id=${spotId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error(`API Error: ${res.status}`);
      return null;
    }

    const data: Spot = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default async function SpotDetail({ searchParams }: Props) {
  const params = await searchParams;
  const spotType = params.spot_type as string; 
  const spotId = Number(params.spot_id);

  const spotDetail = await getSpot(spotType, spotId);

  // データが取れなかった場合の表示（クラッシュ防止）
  if (!spotDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>データの取得に失敗しました。</p>
      </div>
    );
  }

  return (
    <main>
      <Detail proSpotDetail={spotDetail}/>
      {/* ▼ DetailFooterBtn は削除 */}
    </main>
  );
}