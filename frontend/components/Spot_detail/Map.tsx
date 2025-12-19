'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';


// Propsの型定義
type MapProps = {
  lat: number;
  lon: number;
  zoom?: number;
	spot_name: string;
};

// 緯度経度が変わったときに地図の中心を移動
const MapUpdater = ({ lat, lon, zoom }: MapProps) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], zoom);
  }, [lat, lon, zoom, map]);
  return null;
};

const Map = ({ lat, lon, zoom = 20, spot_name }: MapProps) => {
	// アイコン設定
	const customIcon = L.icon({
		iconUrl: '/marker-icon.png',
		iconRetinaUrl: '/marker-icon-2x.png',
		shadowUrl: '/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      {/* 地理院地図（標準地図）のタイルレイヤー */}
      <TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
				url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
			/>
      
      {/* 中心地にマーカーを表示 */}
      <Marker position={[lat, lon]}  icon={customIcon}>
        <Popup>
					{spot_name}
        </Popup>
      </Marker>

      {/* 動的に視点を移動させるためのコンポーネント */}
      <MapUpdater lat={lat} lon={lon} zoom={zoom} />
    </MapContainer>
  );
};

export default Map;