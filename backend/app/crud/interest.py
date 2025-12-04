from sqlalchemy import select

# モデルをインポート
from app.models import Interests

# データベース接続設定をインポート
from app.database import db_connect


# セッションの作成
SessionLocal = db_connect()


# 興味あるを保存する関数
def add_interests(user_id: int, spot_type: str, spot_id: int):
    with SessionLocal() as db:
        # データがすでにあるか確認
        check_interests = select(Interests).where(Interests.user_id == user_id, Interests.spot_type == spot_type, Interests.spot_id == spot_id)
        
        # SQL実行
        check_result = db.execute(check_interests)
        
        if check_result.first():
            # すでにデータがあったら処理終了
            return
         
        # 興味があるを保存
        add_interests = Interests(
            user_id = user_id,
            spot_type = spot_type,
            spot_id = spot_id
        )
        
        # 保存SQL実行
        db.add(add_interests)
        
        # トランザクションを確定
        db.commit()
        
        return