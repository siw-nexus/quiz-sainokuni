from fastapi.testclient import TestClient
from app.main import app


# テスト用のクライアントを作成
client = TestClient(app)


# テストケース：正常に問題を取得できるか
def test_get_questionss():
    # 取得する問題数
    limit = 5
    
    # リクエストを送る 
    response = client.get("/question", params={"spot_type": "tourist", "limit": limit})

    # ステータスコードの確認
    assert response.status_code == 200

    # レスポンスの中身の確認
    data = response.json()
    assert isinstance(data, list) # リストで返ってくるか
    assert len(data) == limit     # 問題数が取得した問題数と一致しているか
    
    if len(data) > 0:
        # 必要なキーが含まれているかチェック
        assert "id" in data[0]
        assert "spot_type" in data[0]
        assert "spot_id" in data[0]
        assert "question_text" in data[0]