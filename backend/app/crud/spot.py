from sqlalchemy import select, func, literal

# モデルをインポート
from app.models import Tourist_spots, Gourmet_spots


# スポットの詳細を一件取得する関数
def get_spot(db, spot_type: str, id: int):
    # 引数のspot_typeがtouristだったら
    if spot_type == 'tourist':
        # 観光地の詳細を取得
        get_tourist = (
            select(Tourist_spots)
            .where(Tourist_spots.id == id)
        )
        
        # 結果を返す
        return db.execute(get_tourist).scalars().first()
    
    else:
        # 観光地の詳細を取得
        get_gourmet = (
            select(Gourmet_spots)
            .where(Gourmet_spots.id == id)
        )
        
        # 結果を返す
        return db.execute(get_gourmet).scalars().first()


# 周辺のスポットを取得（2km）
def get_nearby_spots(db, spot_type: str, current_lat: float, current_lon: float):
    # 地球の半径（km）
    EARTH_RADIUS = 6371
    
    # 取得する範囲（3km）
    limit_km = 3.0
    
    # 観光地の周辺のスポットを取得
    if spot_type == 'tourist':
        # 距離計算のSQL式（ラジアンに変換して計算。球面三角法（余弦定理）っていう計算らしい）
        # (6371 * acos(cos(lat1) * cos(lat2) * cos(lon2 - lon1) + sin(lat1) * sin(lat2)))
        distance_expr = (
            EARTH_RADIUS * func.acos(
                func.cos(func.radians(current_lat)) *
                func.cos(func.radians(Tourist_spots.lat)) *
                func.cos(func.radians(Tourist_spots.lon) - func.radians(current_lon)) +
                func.sin(func.radians(current_lat)) *
                func.sin(func.radians(Tourist_spots.lat))
            )
        )
        
        # クエリ定義
        tourist_near_spots = (
            select(
                Tourist_spots.id, 
                literal(spot_type).label('spot_type'),
                Tourist_spots.name, 
                distance_expr.label('distance')
            ).where(
                distance_expr <= limit_km,  # 3km以内
                distance_expr > 0
            ).order_by(
                distance_expr.asc() # 近い順
            ).limit(3)
        )
        
        # 観光地の周辺のスポットを取得して返す
        return db.execute(tourist_near_spots).all()