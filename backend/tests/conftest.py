import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
import os
from dotenv import load_dotenv

# インスタンスをインポート
from app.main import app

# データベースの接続設定をインポート
from app.database import db_connect

# データベースのモデルをインポート
from app.models import Base, Users, Tourist_spots, Gourmet_spots, Questions, QuizResults, QuizAnswers, Interests

# パスワードをハッシュ化する関数をインポート
from app.core.security import password_hash

# JWT認証する関数をインポート
from app.dependencies import get_current_user

load_dotenv()

# テスト用DB設定
user = os.getenv("MYSQL_USER", "user")
password = os.getenv("MYSQL_PASSWORD", "password")
db_name = "test_db"

TEST_DATABASE_URL = f"mysql+pymysql://{user}:{password}@db:3306/{db_name}"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)


# テーブル作成のフィクスチャ
@pytest.fixture(scope="function")
def db():
    # テーブル作成
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    
    yield session
    
    session.close()
    
    # テーブル削除
    Base.metadata.drop_all(bind=engine)

# clientの設定フィクスチャ
@pytest.fixture(scope="function")
def client(db):
    def override_db_connect():
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[db_connect] = override_db_connect
    yield TestClient(app)
    app.dependency_overrides.clear()

# ダミーユーザーを追加するフィクスチャ
@pytest.fixture(scope="function")
def test_user(db):
    """テスト用ユーザーを作成して返す"""
    # テスト用ダミーユーザーを定義
    user = Users(
        email="auth_test@example.com",
        password=password_hash("testpassword123"),
        name="Auth Test User"
    )
    
    db.add(user)     # ダミーユーザーを追加
    db.commit()      # トランザクションを確定
    db.refresh(user) # ダミーユーザーの情報を取得
    
    # ダミーの認証
    app.dependency_overrides[get_current_user] = lambda: user
    
    # ユーザー情報を返す
    yield user
    
    # ダミー認証をクリア
    app.dependency_overrides = {}

# ダミーの観光地とグルメを追加するフィクスチャ
@pytest.fixture(scope="function")
def test_spots(db):
    """
    観光地とグルメを5件ずつ作成する
    """
    tourists = []
    gourmets = []
    
    # 観光地 5件
    for i in range(1, 16):
        t = Tourist_spots(
            name=f"Tourist Spot {i}",
            detail="Detail",
            address="Address",
            lat=35.0 + i*0.01,
            lon=139.0 + i*0.01,
            available_time="9:00-17:00",
            closure_info="None"
        )
        
        # ダミー観光地を追加
        db.add(t)
        tourists.append(t)
    
    # グルメ15件
    for i in range(1, 16):
        g = Gourmet_spots(
            name=f"Gourmet Spot {i}",
            detail="Detail",
            address="Address",
            lat=36.0 + i*0.01,
            lon=140.0 + i*0.01,
            category="Category",
            tokusanhin="Tokusanhin"
        )
        
        # ダミーグルメを追加
        db.add(g)
        gourmets.append(g)
    
    # トランザクションを確定
    db.commit()
    
    # 作成したデータをリストで返す
    return {"tourist": tourists, "gourmet": gourmets}

# ダミーの問題を追加するフィクスチャ
@pytest.fixture(scope="function")
def test_questions(db, test_spots):
    """スポットに対応する問題文を作成する"""
    questions = []
    
    # 観光地の問題
    for spot in test_spots["tourist"]:
        q = Questions(spot_type="tourist", spot_id=spot.id, question_text=f"Q for {spot.name}")
        
        # 観光地のダミー問題追加
        db.add(q)
        questions.append(q)
        
    # グルメの問題
    for spot in test_spots["gourmet"]:
        q = Questions(spot_type="gourmet", spot_id=spot.id, question_text=f"Q for {spot.name}")
        
        # グルメのダミー問題追加
        db.add(q)
        questions.append(q)
    
    # トランザクションを確定
    db.commit()
    return questions

# ダミーの回答履歴を追加するフィクスチャ
@pytest.fixture(scope="function")
def test_quiz_history(db, test_user, test_spots, test_questions):
    """履歴取得テスト用のデータを事前に作っておく"""
    # ダミーのクイズ結果
    result = QuizResults(
        user_id=test_user.id,
        spot_type="tourist",
        score=5,
        total_questions=5
    )
    
    # ダミーのクイズ結果を追加
    db.add(result)
    
    # トランザクションを確定
    db.commit()
    db.refresh(result)
    
    # ダミーの回答履歴
    q = test_questions[0]
    answer = QuizAnswers(
        quiz_result_id=result.id,
        question_num=1,
        question_id=q.id,
        choice_id=test_spots["tourist"][0].id,
        is_correct=True
    )
    
    # ダミーの回答履歴を追加
    db.add(answer)
    
    # トランザクションを確定
    db.commit()
    
    return result


@pytest.fixture(scope="function")
def test_interests(db, test_user, test_spots):
    """
    テスト用に「興味（いいね）」のデータを事前に作っておくフィクスチャ
    - 観光地の1つ目
    - グルメの1つ目
    の2つを登録状態にします。
    """
    interests = []
    
    # 観光地の興味あるのダミーデータ
    i1 = Interests(
        user_id=test_user.id,
        spot_type="tourist",
        spot_id=test_spots["tourist"][0].id
    )
    
    # 観光地の興味あるのダミーデータを追加
    db.add(i1)
    interests.append(i1)
    
    # グルメの興味あるのダミーデータ
    i2 = Interests(
        user_id=test_user.id,
        spot_type="gourmet",
        spot_id=test_spots["gourmet"][0].id
    )
    
    # グルメの興味あるのダミーデータを追加
    db.add(i2)
    interests.append(i2)
    
    # トランザクションを確定
    db.commit()
    return interests