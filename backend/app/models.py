from sqlalchemy import Column, Integer, String, Text, DATETIME, func, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship


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
    
    quiz_answer = relationship('QuizAnswers', back_populates = 'question')


# ユーザーテーブルのモデル
class Users(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(100), nullable = False, comment = 'ユーザー名')
    email = Column(String(255), nullable = False, comment = 'メールアドレス')
    password = Column(String(255), nullable = False, comment = 'パスワード')
    create_at = Column(DATETIME, server_default=func.now())
    update_at = Column(DATETIME, server_default=func.now(), onupdate=func.now())
    
    quiz_results = relationship('QuizResults', back_populates = 'user')


# クイズ結果テーブルのモデル
class QuizResults(Base):
    __tablename__ = 'quiz_results'
    
    id = Column(Integer, primary_key = True)
    user_id = Column(Integer, ForeignKey('users.id', onupdate = 'CASCADE', ondelete = 'CASCADE'), nullable = False, comment = 'ユーザーIDの外部キー')
    spot_type = Column(String(100), nullable = False, comment = 'tourist or gourmet')
    score = Column(Integer, nullable = False, comment = '正解した問題数')
    total_questions = Column(Integer, nullable = False, comment = '出題数')
    play_at = Column(DATETIME, server_default=func.now(), comment = 'プレイした日時')
    
    user = relationship('Users', back_populates = 'quiz_results')


# クイズ詳細テーブルのモデル
class QuizAnswers(Base):
    __tablename__ = 'quiz-answers'
    
    id = Column(Integer, primary_key = True)
    quiz_result_id = Column(Integer, ForeignKey('quiz_results.id', ondelete = 'CASCADE'), nullable = False, comment = 'クイズ結果IDの外部キー')
    question_num = Column(Integer, nullable = False, comment = '何問目か')
    question_id = Column(Integer, nullable = False, comment = '問題ID')
    choice_id = Column(Integer, nullable = False, comment = '選んだ選択肢のID')
    is_correct = Column(Boolean, nullable = False, comment = '正解したか')
    create_at = Column(DATETIME, server_default=func.now())
    
    question = relationship('Questions', back_populates = 'quiz_answer')