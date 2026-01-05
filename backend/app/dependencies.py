from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

# データベースの接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.user import get_user_email


# .envファイルを読み込む
load_dotenv()

# .envからSECRET_KEY、ALGORITHM、ACCESS_TOKEN_EXPIRE_MINUTESを読み込む
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback_secret_key_change_me')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')


# トークンを受け取るためのスキーム定義
oauth2_schema = OAuth2PasswordBearer(tokenUrl = 'token')

# JWT認証をする関数
async def get_current_user(
    token: str = Depends(oauth2_schema),
    db: Session = Depends(db_connect)
):
    # 認証失敗したときのレスポンスを定義
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 認証
    try:
        # JWTトークンをデコード
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        
        # トークンからメールアドレスを取得
        email: str = payload.get('sub')
        
        # トークンからメールアドレスを取得できなかったらエラーを返す
        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception
    
    # DBからユーザー情報を取得
    user = get_user_email(db, email = email)
    
    # ユーザーが見つからなかったらエラーを返す
    if user is None:
        raise credentials_exception
    
    # ユーザー情報を返す
    return user