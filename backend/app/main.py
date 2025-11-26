from typing import List
from fastapi import FastAPI, HTTPException, Query

# データベースを操作する関数をインポート
from app.crud.question import get_question_text

# レスポンスモデルをインポート
from app.schemas.question import QestionResponse


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