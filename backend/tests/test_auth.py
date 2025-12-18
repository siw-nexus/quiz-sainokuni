from fastapi.testclient import TestClient
from app.main import app
import pytest

# パスワードをハッシュ化する関数をインポート
from app.core.security import password_hash

# モデルをインポート
from app.models import Users

# データベースの接続設定をインポート
from app.database import SessionLocal


# テスト用のクライアントを作成
client = TestClient(app)

# テスト用のダミーユーザーを作る
@pytest.fixture
def test_dummy_user(db = SessionLocal()):
    # テスト用ダミーユーザーのメールアドレスとパスワードを定義
    email = 'auth_test@example.com'
    raw_password = 'testpassword123'
    
    # パスワードをハッシュ化して保存
    user = Users(
        email = email,
        password = password_hash(raw_password),
        name = 'Auth Test User'
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # テスト用に生のメールアドレスとパスワードを返す
    return {'email': email, 'password': raw_password}


# テストケース：正常にログインできてアクセストークンを取得できるか
def test_login(test_dummy_user):
    # リクエスト送信
    response = client.post(
        '/token',
        data = {
            'username': test_dummy_user['email'],
            'password': test_dummy_user['password']
        }
    )
    
    # ステータスコードの確認
    assert response.status_code == 200
    
    # レスポンスの中身を確認
    data = response.json()
    assert 'access_token' in data
    assert data['token_type'] == 'bearer'