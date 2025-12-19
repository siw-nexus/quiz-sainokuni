from fastapi import APIRouter, Query, Depends, HTTPException
from typing import List, Literal
from sqlalchemy.orm import Session

# データベースの接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.question import get_question_text

# レスポンスモデルをインポート
from app.schemas.question import QestionResponse


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