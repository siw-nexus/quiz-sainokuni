from fastapi import APIRouter, Query, Depends, HTTPException, status
from typing import List, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# データベースの接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.interest import get_interests, add_interests, delete_interest

# レスポンスモデルをインポート
from app.schemas.interest import AddInterestResponse, InterestsCreate, GetInterestResponse


router = APIRouter()


# 興味がある一覧取得
@router.get('/interests', response_model = List[GetInterestResponse])
def get_interest(
    user_id: int = Query(..., ge = 1, description = 'ユーザーID'),
    db: Session = Depends(db_connect)
):
    result = get_interests(db, user_id)
    
    # データがからなら404エラーを返す
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result