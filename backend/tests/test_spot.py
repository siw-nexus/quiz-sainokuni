from fastapi.testclient import TestClient
from app.main import app
import pytest

# テスト用のクライアントを作成
client = TestClient(app)


# テストケース：正常にスポットを取得できるか-----------------------------------------------
@pytest.mark.parametrize("test_spot_type, test_spot_id", [
    ("tourist", 1), ("tourist", 100),
    ("gourmet", 1), ("gourmet", 99),
])
def test_get_spot(test_spot_type, test_spot_id):
    # リクエストを送る
    response = client.get("/spot", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # ステータスコードの確認
    assert response.status_code == 200

    # レスポンスの中身の確認
    data = response.json()
    assert len(data) == 16 # 16項目で返ってくるか
    
    if len(data) > 0:
        # 必要なキーが含まれているかチェック
        # 必須項目
        assert "id" in data
        assert "name" in data
        
        # null許容項目（nullでもキー自体はある）
        expected_fields = [
            "detail", "address", "lat", "lon", "img", "hp_url",
            "start_time", "finish_time", "notes", "tel",
            # 観光地・グルメ固有のものも含めてチェック
            "available_time", "closure_info", "category", "tokusanhin"
        ]
        
        for field in expected_fields:
            assert field in data


# テストケース：スポット取得で存在しないタイプを指定したら422が返るか-----------------------------------------
def test_get_spot_unknown_type():
    # リクエストを送る
    response = client.get("/spot", params={"spot_type": "unknown", "spot_id": 1})
    
    # ステータスコードの確認
    assert response.status_code == 422 


# テストケース：存在しないIDを指定したら空リストが返るか-------------------------------------------
@pytest.mark.parametrize("test_spot_type, test_spot_id", [
    ("tourist", 101), 
    ("gourmet", 100), 
    ("tourist", 9999),
    ("gourmet", 9999), 
])
def test_get_spot_unknown_id(test_spot_type, test_spot_id):
    # リクエストを送る
    response = client.get("/spot", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # responseのステータスコードの確認
    assert response.status_code == 404 
    
    # responseのレスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"
    

# テストケース：スポット取得で許容されてない数値をIDに指定したら422が返るか----------------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize("test_spot_id", [-999, -1, 0])
def test_get_spot_id_422(test_spot_type, test_spot_id):
    # リクエストを送る
    response = client.get("/spot", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # responseのステータスコードの確認
    assert response.status_code == 422
