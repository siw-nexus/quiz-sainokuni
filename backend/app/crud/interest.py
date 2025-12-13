from fastapi import HTTPException
from sqlalchemy import select, join, delete

# モデルをインポート
from app.models import Interests, Tourist_spots, Gourmet_spots


# 興味がある一覧取得する関数
def get_interests(db, user_id: int):
    # 観光地の場合
    stmt_tourist = (
        select(
            Interests.id,
            Interests.spot_type,
            Interests.spot_id,
            Tourist_spots.name,
            Tourist_spots.detail,
            Tourist_spots.address,
            Tourist_spots.lat,
            Tourist_spots.lon,
            Tourist_spots.available_time,
            Tourist_spots.closure_info,
            Tourist_spots.start_time,
            Tourist_spots.finish_time,
            Tourist_spots.notes,
            Tourist_spots.tel,
            Tourist_spots.hp_url,
            Tourist_spots.img
        )
        .join(Tourist_spots, Interests.spot_id == Tourist_spots.id)
        .where(Interests.user_id == user_id, Interests.spot_type == 'tourist')
    )
    
    # グルメの場合
    stmt_gourmet = (
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
        .where(Interests.user_id == user_id, Interests.spot_type == 'gourmet')
    )
    
    tourist_result = db.execute(stmt_tourist).mappings().all()
    gourmet_result = db.execute(stmt_gourmet).mappings().all()
    
    # 観光地とグルメのリストを結合して返す
    return list(tourist_result) + list(gourmet_result)

# 興味がある一覧取得する関数


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


# 興味がある削除関数
def delete_interest(db, user_id: int, spot_type: str, spot_id: int):
    stmt = delete(Interests).where(Interests.user_id == user_id, Interests.spot_type == spot_type, Interests.spot_id == spot_id)
    result = db.execute(stmt)
    db.commit()

    # 削除された行数が 0 なら、データが存在しなかったということ
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="データが存在しません")
    return {"message": "削除完了"}