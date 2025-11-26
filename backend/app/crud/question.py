from sqlalchemy import func

# モデルをインポート
from app.models import Questions

# データベース接続設定をインポート
from app.database import db_connect


# セッションの作成
SessionLocal = db_connect()


# 問題文を取得する関数
def get_question_text(spot_type: str, limit: int):
    # データベース接続開始
    db = SessionLocal()

    # 問題を取得
    try:
        question_texts = (
            db.query(Questions.spot_type, Questions.spot_id, Questions.question_text)
            .filter(Questions.spot_type == spot_type)
            .order_by(func.random())
            .limit(limit)
            .all()
        )

        # 結果を返す
        return question_texts
    finally:
        # データベース接続終了
        db.close()