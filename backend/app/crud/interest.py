from sqlalchemy import select

# モデルをインポート
from app.models import Interests


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