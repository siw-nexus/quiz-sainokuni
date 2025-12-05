from typing import List, Literal
from fastapi import FastAPI, HTTPException, Query, status, Depends
from sqlalchemy.orm import Session

# データベース接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.question import get_question_text, get_options, save_question
from app.crud.interest import add_interests

# レスポンスモデルをインポート
from app.schemas.question import QestionResponse, OptionResponse, SendSaveQuestion, SendSaveQuestionResponse
from app.schemas.interest import AddInterestResponse, InterestsCreate


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


# 問題取得
@app.get("/question", response_model = List[QestionResponse])
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


# 選択肢取得
@app.get("/option", response_model = List[OptionResponse])
def get_option(
    spot_type: Literal['tourist', 'gourmet'] = Query(..., description = '観光地(tourist)かグルメ(gourmet)か'),
    spot_id: int = Query(..., ge = 1, description = '問題のID'),
    db: Session = Depends(db_connect)
):
    result = get_options(db, spot_type, spot_id)
    
    # データがからなら404エラーを返す
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result


# 興味がある保存
@app.post('/interests', response_model = AddInterestResponse, status_code=status.HTTP_201_CREATED)
def create_interests(
    interest_data: InterestsCreate,
    db: Session = Depends(db_connect)
):
    result = add_interests(db, interest_data.user_id, interest_data.spot_type, interest_data.spot_id)
    
    return result  # returnのタイミングでschemas>question.pyの型変換が実行される


# 問題を保存する
@app.post("/save_questions", response_model=SendSaveQuestionResponse, status_code=201)
def send_save_question(
    quiz_result_data: SendSaveQuestion,
    db: Session = Depends(db_connect)
):
    # スコアと問題数に不正な値が入っていた場合エラーを返す
    if quiz_result_data.total_questions - quiz_result_data.score < 0:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "スコアが問題数より大きい数値ではいけません")
    
    result = save_question(db, quiz_result_data.user_id, quiz_result_data.spot_type, quiz_result_data.score, quiz_result_data.total_questions)

    return result
