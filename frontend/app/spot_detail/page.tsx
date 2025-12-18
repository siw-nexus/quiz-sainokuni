// コンポーネントをインポート
import Detail from "@/components/Spot_detail/Detail";
import NearbySpotsList from "@/components/Spot_detail/NearbySpotsList";
import DetailFooterBtn from "@/components/Spot_detail/DetailFooterBtn";

// 型の定義をインポート
import { Spot } from "@/types/spot";

// Propsを定義
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

// スポットの詳細を取得する関数
const getSpot = async (spotType: string, spotId: number): Promise<Spot> => {
  try {
    const res = await fetch(`${apiUrl}/spot?spot_type=${spotType}&spot_id=${spotId}`,
      { cache: "no-store" } // キャッシュの無効化
    );

    // レスポンスの確認
    if (!res.ok) throw new Error("スポットの取得に失敗しました");

    // レスポンスの中身を取得
    const data: Spot = await res.json();

    return data;
  } catch (e) {
    console.error(e);
  }
};

export default async function SpotDetail({ searchParams }: Props) {
  // URLのパラメーターを取得
  const params = await searchParams;
  const spotType = params.spot_type; // spot_typeの値を取得
  const spotId = params.spot_id;     // spot_idの値を取得

  // スポットの詳細を取得する関数を呼び出す
  const spotDetail = await getSpot(spotType, spotId);

  return (
    <main>
      <Detail proSpotDetail={spotDetail}/>
      <NearbySpotsList />
      {/* <DetailFooterBtn lat={spotDetail.lat} lon={spotDetail.lon} address={spotDetail.address}/> */}
    </main>
  );
}