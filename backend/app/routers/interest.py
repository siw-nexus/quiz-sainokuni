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


# 興味がある保存
@router.post('/interests', response_model = AddInterestResponse, status_code=status.HTTP_201_CREATED)
def create_interests(
    interest_data: InterestsCreate,
    db: Session = Depends(db_connect)
):
    try:
        result = add_interests(db, interest_data.user_id, interest_data.spot_type, interest_data.spot_id)
        
        return result
        
    except IntegrityError:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = '指定されたユーザーは存在しません')


# 興味がある削除
@router.delete("/interests")
def del_interest(
    user_id: int,
    spot_type: Literal['tourist', 'gourmet'] = Query(..., description = '観光地(tourist)かグルメ(gourmet)か'),
    spot_id: int = Query(..., ge = 1, description = 'スポットのID（1以上の数値）'),
    db: Session = Depends(db_connect)
):
    
    result = delete_interest(db, user_id, spot_type, spot_id)

    # データがからなら404エラーを返す
    if result.rowcount == 0:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return {"message": "削除が完了しました"}
