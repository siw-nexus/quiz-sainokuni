from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

# データベース接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.user import get_user_email

# パスワード検証、トークン発行などの関数をインポート
from app.core.security import verify_password, create_access_token

router = APIRouter()

# ログイン
@router.post('/token')
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(db_connect)):
    # メールアドレスでユーザーを探す
    user = get_user_email(db, email = form_data.username)
    
    # ユーザーが見つからなかった場合か、パスワードが一致しない場合は401エラー
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code = 401,
            detail = 'メールアドレスまたはパスワードが正しくありません',
            headers = {"WWW-Authenticate": "Bearer"}
        )
    
    # トークンを作成して返す
    access_token = create_access_token(data = {'sub': user.email})
    
    return {'access_token': access_token, 'token_type': 'bearer'}