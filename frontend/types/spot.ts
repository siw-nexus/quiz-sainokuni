// スポット詳細の型の定義
export type Spot = {
  id: number
  name: string
  detail: string | null;
  address: string | null;
  lat: string | null;
  lon: string | null;
  availavle_time: string | null;
  closure_info: string | null;
  category: string | null;
  tokusanhin: string | null;
  start_time: string | null;
  finish_time: string | null;
  notes: string | null;
  tel: string | null;
  hp_url: string | null;
  img: string | null;
}