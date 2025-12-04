from sqlalchemy import func, literal, union_all, select, insert

# モデルをインポート
from app.models import Questions, Tourist_spots, Gourmet_spots, QuizResults

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
    # spot_idが0以下101以上だった場合はからリストを返す
    if spot_id <= 0 or spot_id >= 101:
        return []
    
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
            option_union = union_all(option_correct, option_incorrect) # .union_all２つのSQLを１つで繋げる
            
            # 結果を返す
            return db.execute(option_union).all()


# 問題をデータベースに保存する関数
def create_question(user_id: int, spot_type: str, score: int, total_questions: int):
    with SessionLocal() as db:
        # 1. モデルのインスタンス（実体）を作る
        new_result = QuizResults(
            user_id=user_id,
            spot_type=spot_type,
            score=score,
            total_questions=total_questions
        )

        # 2. セッションに追加して保存
        db.add(new_result)
        db.commit()

        # 3. ここが重要！データベースから最新情報を再読み込みする
        # これをすることで、空だった new_result.id に数値が入ります
        db.refresh(new_result)

        # 4. IDを返す
        return new_result.id
    
print(create_question(1,"tourist",5,10))
    