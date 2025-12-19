from fastapi import APIRouter, Query, Depends, HTTPException, status
from typing import List, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# データベースの接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.question import get_question_text, save_question, save_quiz_histories, get_question_histories

# レスポンスモデルとBodyの定義をインポート
from app.schemas.question import QestionResponse, SendSaveQuestionResponse, SendSaveQuestion, SendSaveHistoryResponse, SendSaveHistory, GetHistoryListResponse


router = APIRouter()


# 問題と選択肢を取得
@router.get("/question", response_model = List[QestionResponse])
def get_questions(
    spot_type: Literal['tourist', 'gourmet'] = Query(..., description = "観光地(tourist)かグルメ(gourmet)か"),
    limit: int = Query(..., description = "取得する問題数（5 or 10 ro 15）"),
    db: Session = Depends(db_connect)
):
    if limit not in [5, 10, 15]:
        raise HTTPException(status_code = 422, detail = 'limitは5か10か15のどれか')
    result = get_question_text(db, spot_type, limit)
    
    # データがからなら404エラーを返す
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result


# 回答結果保存
@router.post("/questions", response_model=SendSaveQuestionResponse, status_code=201)
def send_save_question(
    quiz_result_data: SendSaveQuestion,
    db: Session = Depends(db_connect)
):
    # スコアと問題数に不正な値が入っていた場合エラーを返す
    if quiz_result_data.total_questions - quiz_result_data.score < 0:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "スコアが問題数より大きい数値ではいけません")
    
    try:
        result = save_question(db, quiz_result_data.user_id, quiz_result_data.spot_type, quiz_result_data.score, quiz_result_data.total_questions)
        
        return result
    
    except IntegrityError:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = '指定されたユーザーは存在しません')


# 回答履歴保存
@router.post("/histories", response_model=SendSaveHistoryResponse, status_code=201)
def send_save_history(
    history_data: SendSaveHistory,
    db: Session = Depends(db_connect)
):

    try:
        result = save_quiz_histories(db, history_data.quiz_result_id, history_data.question_num, history_data.question_id, history_data.choice_id, history_data.is_correct)
        return result
    
    except IntegrityError:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = '指定された回答結果は存在しません')


# 回答履歴一覧取得
@router.get("/histories", response_model=List[GetHistoryListResponse])
def get_histories(
    user_id: int = Query(..., ge = 1, description = 'ユーザーID'),
    db: Session = Depends(db_connect)
):
    result = get_question_histories(db, user_id)
    
    # データがからなら404エラーを返す
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result