from sqlalchemy import Column, Integer, String, Text, DATETIME, func
from sqlalchemy.orm import declarative_base


# SQLAlchemyの基底クラスを作成
Base = declarative_base()


# tourist_spotsテーブルのモデル
class Tourist_spots(Base):
    __tablename__ = 'tourist_spots'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(100), nullable = False, comment = '観光地名')
    detail = Column(Text, nullable = False, comment = '概要')
    address = Column(String(255), nullable = False, comment = '住所')
    lat = Column(String(100), comment = '緯度')
    lon = Column(String(100), comment = '経度')
    availavle_time = Column(String(100), comment = '利用可能時間')
    closure_info = Column(Text, comment = '休業情報')
    start_time = Column(String(100), comment = '開始時間')
    finish_time = Column(String(100), comment = '終了時間')
    notes = Column(Text, comment = '備考')
    tel = Column(String(100), comment = '電話番号')
    hp_url = Column(Text, comment = 'ホームページURL')
    img = Column(Text, comment = '画像')
    create_at = Column(DATETIME, server_default=func.now())
    update_at = Column(DATETIME, server_default=func.now(), onupdate=func.now())


# gourmet_spotsテーブルのモデル
class Gourmet_spots(Base):
    __tablename__ = 'gourmet_spots'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(100), nullable = False, comment = '店舗名')
    detail = Column(Text, nullable = False, comment = '概要')
    address = Column(String(255), nullable = False, comment = '住所')
    lat = Column(String(100), comment = '緯度')
    lon = Column(String(100), comment = '経度')
    category = Column(String(100), comment = '区分')
    tokusanhin = Column(String(255), comment = '特産品')
    start_time = Column(String(100), comment = '開始時間')
    finish_time = Column(String(100), comment = '終了時間')
    notes = Column(Text, comment = '備考')
    hp_url = Column(Text, comment = 'ホームページURL')
    img = Column(Text, comment = '画像')
    create_at = Column(DATETIME, server_default=func.now())
    update_at = Column(DATETIME, server_default=func.now(), onupdate=func.now())


# questionsテーブルのモデル
class Questions(Base):
    __tablename__ = 'questions'
    
    id = Column(Integer, primary_key = True)
    spot_type = Column(String(100), nullable = False)
    spot_id = Column(Integer, nullable = False)
    question_text = Column(Text, nullable = False)
    create_at = Column(DATETIME, server_default=func.now())
    update_at = Column(DATETIME, server_default=func.now(), onupdate=func.now())


# ユーザーテーブルのモデル
class Users(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(100), nullable = False, comment = 'ユーザー名')
    email = Column(String(255), nullable = False, comment = 'メールアドレス')
    password = Column(String(255), nullable = False, comment = 'パスワード')
    create_at = Column(DATETIME, server_default=func.now())
    update_at = Column(DATETIME, server_default=func.now(), onupdate=func.now())