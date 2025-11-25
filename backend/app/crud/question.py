import os
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker

# モデルをインポート
from app.models import Questions


# .envからDATABASE_URLを取得
DATABASE_URL = os.environ['DATABASE_URL']

# データベース接続設定
engine = create_engine(
    DATABASE_URL,
    connect_args={"charset": "utf8mb4"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


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