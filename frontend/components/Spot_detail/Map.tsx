'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Propsの型定義（Detail.tsxから渡されるもの）
type Props = {
  lat: number;
  lon: number;
  zoom: number;
  spot_name: string;
}

export default function Map({ lat, lon, zoom, spot_name }: Props) {

  // ▼ Leafletのデフォルトアイコンが表示されないバグへの対策 ▼
  useEffect(() => {
    // 既存のアイコン設定を一度削除
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    // 正しいアイコン画像のパスを再設定
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    // MapContainerに key={lat + lon} を付けることで、座標が変わった時に
    // 強制的に地図を作り直させ、「再利用エラー」を防ぎます。
    <MapContainer 
      key={`${lat}-${lon}`} 
      center={[lat, lon]} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>
          {spot_name}
        </Popup>
      </Marker>
    </MapContainer>
  );
}