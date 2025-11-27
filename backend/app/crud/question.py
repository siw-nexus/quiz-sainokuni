from sqlalchemy import func, literal, union_all, select

# モデルをインポート
from app.models import Questions, Tourist_spots, Gourmet_spots

# データベース接続設定をインポート
from app.database import db_connect


# セッションの作成
SessionLocal = db_connect()


# 問題文を取得する関数
def get_question_text(spot_type: str, limit: int):
    # データベース接続開始
    with SessionLocal() as db:
    # 問題を取得
        question_texts = (
            select(Questions.id, Questions.spot_type, Questions.spot_id, Questions.question_text)
            .filter(Questions.spot_type == spot_type)
            .order_by(func.random())
            .limit(limit)
        )

        # 結果を返す
        return db.execute(question_texts).all()


# 選択肢を取得する関数
def get_options(spot_type: str, spot_id: int):
    # データベース接続開始
    with SessionLocal() as db:   
        if spot_type == 'tourist':
            # 観光地の選択肢を取得
            # 正解を取得
            option_correct = (
                select(Tourist_spots.id, Tourist_spots.name.label('option_text'), literal(1).label('is_correct'))
                .where(spot_id == Tourist_spots.id)
            )
            
            # 不正解の選択肢を3件取得
            option_incorrect = (
                select(Tourist_spots.id, Tourist_spots.name.label('option_text'), literal(0).label('is_correct'))
                .where(spot_id != Tourist_spots.id)
                .order_by(func.random())
                .limit(3)
            )
            
            # 正解と不正解のsqlをunion_allで繋げる
            option_union = union_all(option_correct, option_incorrect)
            
            # 結果を返す
            return db.execute(option_union).all()
        
        elif spot_type == 'gourmet':
            # グルメの選択肢を取得
            # 正解を取得
            option_correct = (
                select(Gourmet_spots.id, Gourmet_spots.name.label('option_text'), literal(1).label('is_correct'))
                .where(spot_id == Gourmet_spots.id)
            )
            
            # 不正解の選択肢を3件取得
            option_incorrect = (
                select(Gourmet_spots.id, Gourmet_spots.name.label('option_text'), literal(0).label('is_correct'))
                .where(spot_id != Gourmet_spots.id)
                .order_by(func.random())
                .limit(3)
            )
            
            # 正解と不正解のsqlをunion_allで繋げる
            option_union = union_all(option_correct, option_incorrect)
            
            # 結果を返す
            return db.execute(option_union).all()