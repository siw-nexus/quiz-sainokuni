# モデルをインポート
from app.models import Interests

# データベース接続設定をインポート
from app.database import db_connect


# セッションの作成
SessionLocal = db_connect()