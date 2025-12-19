// コンポーネントをインポート
import Detail from "@/components/Spot_detail/Detail";

// 型の定義をインポート
import { Spot } from "@/types/spot";

// Propsを定義
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

// スポットの詳細を取得する関数
const getSpot = async (spotType: string, spotId: number): Promise<Spot | null> => {
  try {
    if (!spotId) return null;

    const res = await fetch(`${apiUrl}/spot?spot_type=${spotType}&spot_id=${spotId}`,
      { cache: "no-store" } // キャッシュの無効化
    );

    // レスポンスの確認
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
  // URLのパラメーターを取得
  const params = await searchParams;
  const spotType = params.spot_type as string; 
  const spotId = Number(params.spot_id);

  // スポットの詳細を取得する関数を呼び出す
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
    </main>
  );
}