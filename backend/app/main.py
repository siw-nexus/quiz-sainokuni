from typing import List
from fastapi import FastAPI, HTTPException, Query, status, Depends
from sqlalchemy.orm import Session

# データベース接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.question import get_question_text, get_options
from app.crud.interest import add_interests

# レスポンスモデルをインポート
from app.schemas.question import QestionResponse, OptionResponse
from app.schemas.interest import AddInterestResponse, InterestsCreate


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


# 問題取得
@app.get("/question", response_model = List[QestionResponse])
def get_questions(
    spot_type: str = Query(..., description = "観光地(tourist)かグルメ(gourmet)か"),
    limit: int = Query(description = "取得する問題数")
):
    result = get_question_text(spot_type, limit)
    
    # データがからなら404エラーを返す
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result


# 選択肢取得
@app.get("/option", response_model = List[OptionResponse])
def get_option(
    spot_type: str = Query(..., description = '観光地(tourist)かグルメ(gourmet)か'),
    spot_id: int = Query(description = '問題のID')
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
    
    return result