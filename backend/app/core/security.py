from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
import os
from dotenv import load_dotenv

# .envファイルを読み込む
load_dotenv()

# .envからSECRET_KEY、ALGORITHM、ACCESS_TOKEN_EXPIRE_MINUTESを読み込む
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback_secret_key_change_me')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 30))


# ハッシュ化の設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# パスワードを検証する関数
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# トークンを作成する関数
def create_access_token(data: dict):
    # 渡されたデータをコピー（念のため）
    to_encode = data.copy()
    
    # 有効期限の設定（現在時刻 + ACCESS_TOKEN_EXPIRE_MINUTESの時間）
    expire = datetime.now(timezone.utc) + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # 有効期限をコピーしたデータに追加
    to_encode.update({'exp': expire})
    
    # 暗号化と署名
    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    
    # JWTを返す
    return encode_jwt