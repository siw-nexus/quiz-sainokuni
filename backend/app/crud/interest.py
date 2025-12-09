from sqlalchemy import select, join

# モデルをインポート
from app.models import Interests, Tourist_spots, Gourmet_spots


# 興味がある一覧取得する関数
def get_interests(db, user_id: int, spot_type: str):
    print(f'user_id: {user_id}, spot_type: {spot_type}')
    # 観光地の場合
    if spot_type == 'tourist':
        print('ifはいった')
        stmt = (
            select(
                Interests.id,
                Interests.spot_type,
                Interests.spot_id,
                Tourist_spots.name,
                Tourist_spots.detail,
                Tourist_spots.address,
                Tourist_spots.lat,
                Tourist_spots.lon,
                Tourist_spots.availavle_time,
                Tourist_spots.closure_info,
                Tourist_spots.start_time,
                Tourist_spots.finish_time,
                Tourist_spots.notes,
                Tourist_spots.tel,
                Tourist_spots.hp_url,
                Tourist_spots.img
            )
            .join(Tourist_spots, Interests.spot_id == Tourist_spots.id)
            .where(Interests.user_id == user_id, Interests.spot_type == spot_type)
        )
    
    # グルメの場合
    elif spot_type == 'gourmet':
        stmt = (
            select(
                Interests.id,
                Interests.spot_type,
                Interests.spot_id,
                Gourmet_spots.name,
                Gourmet_spots.detail, 
                Gourmet_spots.lat, 
                Gourmet_spots.lon, 
                Gourmet_spots.category, 
                Gourmet_spots.tokusanhin, 
                Gourmet_spots.start_time, 
                Gourmet_spots.finish_time, 
                Gourmet_spots.notes, 
                Gourmet_spots.hp_url, 
                Gourmet_spots.img
            )
            .join(Gourmet_spots, Interests.spot_id == Gourmet_spots.id)
            .where(Interests.user_id == user_id, Interests.spot_type == spot_type)
        )
    
    else:
        return []
    
    return db.execute(stmt).mappings().all()


# 興味あるを保存する関数
def add_interests(db, user_id: int, spot_type: str, spot_id: int):
    # データがすでにあるか確認
    stmt = select(Interests).where(Interests.user_id == user_id, Interests.spot_type == spot_type, Interests.spot_id == spot_id)
    
    # SQL実行
    check_result = db.scalars(stmt).first()
    
    if check_result:
        # すでにデータがあったらそれを返す
        return check_result
    
    # 興味があるを保存
    new_interests = Interests(
        user_id = user_id,
        spot_type = spot_type,
        spot_id = spot_id
    )
    
    # 保存SQL実行
    db.add(new_interests)
    
    # トランザクションを確定
    db.commit()
    
    db.refresh(new_interests)
    
    return new_interests