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
    spot_type: Literal['tourist', 'gourmet'] = Query(description = "観光地(tourist)かグルメ(gourmet)か"),
    limit: Literal[5, 10, 15] = Query(description = "取得する問題数")
):
    result = get_question_text(spot_type, limit)
    
    # データがからなら404エラーを返す
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result


# 選択肢取得
@app.get("/option", response_model = List[OptionResponse])
def get_option(
    spot_type: Literal['tourist', 'gourmet'] = Query(description = '観光地(tourist)かグルメ(gourmet)か'),
    spot_id: int = Query(ge = 1, description = '問題のID')
):
    result = get_options(spot_type, spot_id)
    
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
    quiz_result_data: SendSaveQuestion
):
    q = quiz_result_data

    # スコアと問題数に不正な値が入っていた場合エラーを返す
    if (q.score != 5 or q.score != 10 or q.score != 15) and q.total_questions-q.score < 0:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "スコアまたは問題数の値が不正です")
    # spot_typeの値が指定意外だった場合
    elif q.spot_type != "tourist" or q.spot_type != "gourmet":
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "スポットタイプの値が不正です")
    else:
        result = save_question(q.user_id, q.spot_type, q.score, q.total_questions)

    return result
