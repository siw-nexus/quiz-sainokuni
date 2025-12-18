from sqlalchemy import select
from sqlalchemy.orm import Session

# モデルをインポート
from app.models import Users

# メールアドレスからユーザーを取得
def get_user_email(db: Session, email: str):
    return db.execute(select(Users).where(Users.email == email)).scalars().first()