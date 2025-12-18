from passlib.context import CryptContext


# ハッシュ化の設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# パスワードを検証する関数
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)