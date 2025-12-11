from sqlalchemy import func, literal, union_all, select

# モデルをインポート
from app.models import Questions, Tourist_spots, Gourmet_spots, QuizResults, QuizAnswers 


# 問題文を取得する関数
def get_question_text(db, spot_type: str, limit: int):
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
def get_options(db, spot_type: str, spot_id: int):
    if spot_type == 'tourist':
        # 観光地の選択肢を取得
        # 正解を取得
        option_correct = (
            select(Tourist_spots.id, Tourist_spots.name.label('option_text'), literal(1).label('is_correct'), Tourist_spots.detail, Tourist_spots.lat, Tourist_spots.lon, Tourist_spots.available_time, Tourist_spots.start_time, Tourist_spots.finish_time, Tourist_spots.notes, Tourist_spots.tel, Tourist_spots.hp_url, Tourist_spots.img)
            .where(spot_id == Tourist_spots.id)
        )
        
        # 不正解の選択肢を3件取得
        option_incorrect = (
            select(Tourist_spots.id, Tourist_spots.name.label('option_text'), literal(0).label('is_correct'), Tourist_spots.detail, Tourist_spots.lat, Tourist_spots.lon, Tourist_spots.available_time, Tourist_spots.start_time, Tourist_spots.finish_time, Tourist_spots.notes, Tourist_spots.tel, Tourist_spots.hp_url, Tourist_spots.img)
            .where(spot_id != Tourist_spots.id)
            .order_by(func.random())
            .limit(3)
        )
        
        # 正解と不正解のsqlをunion_allで繋げる
        option_union = union_all(option_correct, option_incorrect)
        
        # 結果を取得
        result = db.execute(option_union).all()
        
        # 正解データがあるかチェック
        has_correct = any(row.is_correct == 1 for row in result)
        
        if not has_correct:
            # 正解データが無かったら空を返す
            return []
        
        # 正解データがあったら結果を返す
        return result
    
    elif spot_type == 'gourmet':
        # グルメの選択肢を取得
        # 正解を取得
        option_correct = (
            select(Gourmet_spots.id, Gourmet_spots.name.label('option_text'), literal(1).label('is_correct'), Gourmet_spots.detail, Gourmet_spots.lat, Gourmet_spots.lon, Gourmet_spots.category, Gourmet_spots.tokusanhin, Gourmet_spots.start_time, Gourmet_spots.finish_time, Gourmet_spots.notes, Gourmet_spots.hp_url, Gourmet_spots.img)
            .where(spot_id == Gourmet_spots.id)
        )
        
        # 不正解の選択肢を3件取得
        option_incorrect = (
            select(Gourmet_spots.id, Gourmet_spots.name.label('option_text'), literal(0).label('is_correct'), Gourmet_spots.detail, Gourmet_spots.lat, Gourmet_spots.lon, Gourmet_spots.category, Gourmet_spots.tokusanhin, Gourmet_spots.start_time, Gourmet_spots.finish_time, Gourmet_spots.notes, Gourmet_spots.hp_url, Gourmet_spots.img)
            .where(spot_id != Gourmet_spots.id)
            .order_by(func.random())
            .limit(3)
        )
        
        # 正解と不正解のsqlをunion_allで繋げる
        option_union = union_all(option_correct, option_incorrect) # .union_all２つのSQLを１つで繋げる
        
        # 結果を取得
        result = db.execute(option_union).all()
        
        # 正解データがあるかチェック
        has_correct = any(row.is_correct == 1 for row in result)
        
        if not has_correct:
            # 正解データが無かったら空を返す
            return []
        
        # 正解データがあったら結果を返す
        return result


# 問題をデータベースに保存する関数
def save_question(db, user_id: int, spot_type: str, score: int, total_questions: int):
    # 1. モデルのインスタンス（実体）を作る
    quiz_result = QuizResults(
        user_id=user_id,
        spot_type=spot_type,
        score=score,
        total_questions=total_questions
    )

    # 2. セッションに追加して保存
    db.add(quiz_result)
    db.commit()

    # 3. ここが重要！データベースから最新情報を再読み込みする
    # これをすることで、空だった quiz_result.id に数値が入ります
    db.refresh(quiz_result)

    # 4. IDを返す
    return quiz_result


# 回答履歴をデータベースに保存する関数
def save_quiz_histories(db, quiz_result_id: int, quiz_num: int, quiz_id: int, choice_id: int, is_correct: bool):
    quiz_history = QuizAnswers(
        quiz_result_id = quiz_result_id,
        question_num = quiz_num,
        question_id = quiz_id,
        choice_id = choice_id,
        is_correct = is_correct
    )

    db.add(quiz_history)
    db.commit()

    db.refresh(quiz_history)

    return quiz_history


# 回答履歴一覧を取得する関数
def get_question_histories(db, user_id: int):
    quiz_histories_data = (
        select(
            QuizAnswers.id,
            QuizAnswers.quiz_result_id,
            QuizAnswers.question_num,
            QuizAnswers.question_id,
            QuizAnswers.choice_id,
            QuizAnswers.is_correct,
            QuizResults.spot_type,
            QuizResults.score,
            QuizResults.total_questions,
            QuizResults.play_at,
            Questions.question_text
        )
        .join(QuizResults, QuizResults.id == QuizAnswers.quiz_result_id)
        .join(Questions, Questions.id == QuizAnswers.question_id)
        .where(QuizResults.user_id == user_id)
    )
    quiz_histories_result = db.execute(quiz_histories_data).mappings().all() #mappings()は結果を辞書（キーと値のペア）のように扱える形式に変換する。.all()は全件取得をし辞書方を中に含んだリスト型で返してくれる。

    return quiz_histories_result