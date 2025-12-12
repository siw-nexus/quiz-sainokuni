// コンポーネントをインポート
import Detail from "@/components/Spot_detail/Detail";

// Propsを定義
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpotDetail({ searchParams }: Props) {
  // URLのパラメーターを取得
  const params = await searchParams;
  const spot_type = params.spot_type; // spot_typeの値を取得
  const spot_id = params.spot_id;     // spot_idの値を取得

  return (
    <Detail />
  );
}