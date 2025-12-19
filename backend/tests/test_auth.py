import pytest


# テストケース：正常にログインできてアクセストークンを取得できるか
def test_login(client, test_user):
    # リクエスト送信
    response = client.post(
        '/token',
        data = {
            'username': test_user.email,
            'password': 'testpassword123'
        }
    )
    
    # ステータスコードの確認
    assert response.status_code == 200
    
    # レスポンスの中身を確認
    data = response.json()
    assert 'access_token' in data
    assert data['token_type'] == 'bearer'


# テストケース：メールアドレスとパスワードを間違えたときに401が返ってくるか
@pytest.mark.parametrize("email_input, password_input", [
    ("auth_test@example.com", "wrong_password"), # パスワード違い
    ("wrong@example.com", "testpassword123"),    # メアドが存在しない
])
def test_login_failure(client, test_user, email_input, password_input):
    response = client.post(
        "/token",
        data={
            "username": email_input,
            "password": password_input
        }
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "メールアドレスまたはパスワードが正しくありません"