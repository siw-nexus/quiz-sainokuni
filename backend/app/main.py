from typing import List
from fastapi import FastAPI, HTTPException, Query

# データベースを操作する関数をインポート
from app.crud.question import get_question_text, get_options , save_question

# レスポンスモデルをインポート
from app.schemas.question import QestionResponse, OptionResponse, SendSaveQuestion


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
    
    return result  # returnのタイミングでschemas>question.pyの型変換が実行される


# 問題を保存する
@app.post("/save_questions", response_model=SendSaveQuestion, status_code=201)
def send_save_question(
    user_id: int = Query(..., description= "UserのID"),
    spot_type: str = Query(..., description= "観光地(tourist)かグルメ(gourmet)か"),
    score: int = Query(..., description="クイズのスコアの整数が入る"),
    total_questions: int = Query(..., description="解いた問題数が入る")
):
    result = save_question(user_id, spot_type, score, total_questions)

    return result
