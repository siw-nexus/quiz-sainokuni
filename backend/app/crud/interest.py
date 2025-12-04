from sqlalchemy.exc import IntegrityError

# モデルをインポート
from app.models import Interests

# データベース接続設定をインポート
from app.database import db_connect


# セッションの作成
SessionLocal = db_connect()


# 興味あるを保存する関数
def add_interests(user_id: int, spot_type: str, spot_id: int):
    with SessionLocal() as db:
            # 興味があるを保存
            add_interests = Interests(
                user_id = user_id,
                spot_type = spot_type,
                spot_id = spot_id
            )
            
            # # valuesを辞書型で定義
            db.add(add_interests)
            
            # トランザクションを確定
            db.commit()