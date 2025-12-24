import pytest
from app.dependencies import get_current_user
from app.main import app

# モデルをインポート
from app.models import Users

# テストケース：ユーザー情報を正常に取得できるか
def test_get_me_success(client, test_user):
    response = client.get('/me')
    
    # ステータスコードの確認
    assert response.status_code == 200
    
    # レスポンスの確認
    data = response.json()
    print(f'ユーザー情報：{data}')
    
    # 必要な項目数返ってきているか確認
    assert len(data) == 2
    
    # 必要なデータが含まれているかチェック
    assert 'name' in data
    assert 'email' in data


# テストケース：ログインしないででユーザー情報を取得しようとしたらエラーが返ってくるか
def test_get_me_unknown_user(client):
    response = client.get('/me')
    
    # ステータスコードの確認
    assert response.status_code == 401