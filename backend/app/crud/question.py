from ssl import Options
from sqlalchemy import func, literal, union_all, select
import random

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
    
    # 問題を辞書型に変換する
    questions = [dict(row) for row in db.execute(question_texts).mappings().all()]
    
    final_results = [] # 結果を格納するリスト
    
    # 観光地の選択肢を取得
    if spot_type == 'tourist':
        for question in questions:
            # 正解の選択肢を1件取得する
            option_correct = (
                select(
                    Tourist_spots.id,
                    Tourist_spots.name.label('option_text'),
                    literal(True).label('is_correct')
                )
                .where(Tourist_spots.id == question['spot_id'])
            )
            
            # 不正解の選択肢を3件取得する
            option_incorrect = (
                select(
                    Tourist_spots.id,
                    Tourist_spots.name.label('option_text'),
                    literal(False).label('is_correct')
                )
                .where(Tourist_spots.id != question['spot_id'])
                .order_by(func.random())
                .limit(3)
            )
            
            # 正解と不正解のsqlをunion_allで繋げる
            option_union = union_all(option_correct, option_incorrect)
            
            # 結果を取得
            result = db.execute(option_union).mappings().all()
            
            # 結果を辞書型に変換する
            options_list = [dict(row) for row in result]
            
            # 選択肢をシャッフルする
            random.shuffle(options_list)
            
            # 質問辞書に選択肢リストを追加
            question['options'] = options_list
            
            # 結果リストに追加
            final_results.append(question)
    
    # グルメの選択肢を取得
    if spot_type == 'gourmet':
        for question in questions:
            # 正解の選択肢を1件取得する
            option_correct = (
                select(
                    Gourmet_spots.id,
                    Gourmet_spots.name.label('option_text'),
                    literal(True).label('is_correct')
                )
                .where(Gourmet_spots.id == question['spot_id'])
            )
            
            # 不正解の選択肢を3件取得する
            option_incorrect = (
                select(
                    Gourmet_spots.id,
                    Gourmet_spots.name.label('option_text'),
                    literal(False).label('is_correct')
                )
                .where(Gourmet_spots.id != question['spot_id'])
                .order_by(func.random())
                .limit(3)
            )
            
            # 正解と不正解のsqlをunion_allで繋げる
            option_union = union_all(option_correct, option_incorrect)
            
            # 結果を取得
            result = db.execute(option_union).mappings().all()
            
            # 結果を辞書型に変換する
            options_list = [dict(row) for row in result]
            
            # 選択肢をシャッフルする
            random.shuffle(options_list)
            
            # 質問辞書に選択肢リストを追加
            question['options'] = options_list
            
            # 結果リストに追加
            final_results.append(question)
    
    return final_results


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
            QuizAnswers.id.label("answer_id"),
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
        .order_by(QuizResults.play_at.desc(), QuizAnswers.question_num.asc()) # 日時順・設問順に並べる
    )
    
    rows = db.execute(quiz_histories_data).mappings().all()

    # データをグループ化する
    grouped = {}
    for row in rows:
        result_id = row["quiz_result_id"]
        
        if result_id not in grouped:
            grouped[result_id] = {
                "id": result_id, # GetHistoryListResponseのid
                "spot_type": row["spot_type"],
                "score": row["score"],
                "total_questions": row["total_questions"],
                "play_at": row["play_at"],
                # 親階層のquestion_textには、代表として最初の設問文を入れておきます
                "question_text": row["question_text"], 
                "answers": []
            }
        
        # 子要素 (QuizHistory) の追加
        grouped[result_id]["answers"].append({
            "id": row["answer_id"],
            "question_num": row["question_num"],
            "question_id": row["question_id"],
            "question_text": row["question_text"],
            "choice_id": row["choice_id"],
            "is_correct": row["is_correct"]
        })

    return list(grouped.values())