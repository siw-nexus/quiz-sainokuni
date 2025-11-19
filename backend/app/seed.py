import requests
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# .envからDATABASE_URLを読み込む
DATABASE_URL = os.environ['DATABASE_URL']


engine = create_engine(
    DATABASE_URL,
    connect_args={"charset": "utf8mb4"}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# tourist_spotsモデル、gourmet_spotsモデル、questionsモデルをインポート
try:
    from models import Tourist_spots, Gourmet_spots, Questions
except ImportError:
    print('モデルのインポートに失敗しました')
    exit(1)