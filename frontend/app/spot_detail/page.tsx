import Detail from "@/components/Spot_detail/Detail";
import NearbySpotsList from "@/components/Spot_detail/NearbySpotsList";
import { Spot, NearbySpot } from "@/types/spot";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

const getSpot = async (spotType: string, spotId: number): Promise<Spot | null> => {
  try {
    const res = await fetch(`${apiUrl}/spot/detail?spot_type=${spotType}&spot_id=${spotId}`,
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

const getNearbySpot = async (lat: number, lon: number): Promise<NearbySpot[]> => {
  try {
    const res = await fetch(`${apiUrl}/spot/nearby?lat=${lat}&lon=${lon}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("スポットの取得に失敗しました");
    const data: NearbySpot[] = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return []; // エラー時は空配列を返すなど安全策
  }
};

export default async function SpotDetail({ searchParams }: Props) {
  const params = await searchParams;
  const spotType = params.spot_type as string; 
  const spotId = Number(params.spot_id);

  const spotDetail = await getSpot(spotType, spotId);

  if (!spotDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>データの取得に失敗しました。</p>
      </div>
    );
  }
  
  // 周辺スポット取得（getSpotの後でないと緯度経度がわからないため）
  const nearbySpots = await getNearbySpot(spotDetail.lat, spotDetail.lon);

  return (
    <main>
      {/* ▼▼▼ 変更点: Detailの中にNearbySpotsListを入れることで、Detail内の左パネルに表示されます ▼▼▼ */}
      <Detail proSpotDetail={spotDetail}>
        <NearbySpotsList nearbySpots={nearbySpots || []}/>
      </Detail>
      {/* ▲▲▲ 変更点終了 ▲▲▲ */}
    </main>
  );
}