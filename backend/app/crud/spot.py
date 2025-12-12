from sqlalchemy import select

# モデルをインポート
from app.models import Tourist_spots, Gourmet_spots


# スポットの詳細を一件取得する関数
def get_spot(db, spot_type: str, id: int):
    # 引数のspot_typeがtouristだったら
    if spot_type == 'tourist':
        # 観光地の詳細を取得
        get_tourist = (
            select(Tourist_spots)
            .filter(Tourist_spots.id == id)
        )
        
        # 結果を返す
        return db.execute(get_tourist)