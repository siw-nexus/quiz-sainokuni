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
    response = client.get("/spot/detail", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
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
    response = client.get("/spot/detail", params={"spot_type": "unknown", "spot_id": 1})
    
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
    response = client.get("/spot/detail", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
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
    response = client.get("/spot/detail", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # responseのステータスコードの確認
    assert response.status_code == 422


# テストケース：周辺のスポット詳細を正常に取得できるか
def test_get_nearby_spots():
    # リクエストを送る
    response = client.get('/spot/nearby', params = {'lat': 35.78462512, 'lon': 139.5506787})
    
    # ステータスコードの確認
    assert response.status_code == 200
    
    # レスポンスの中身の確認
    data = response.json()
    
    # 1項目以上で返ってくるか
    assert len(data) >= 1
    
    # 必要なキーが含まれているかチェック
    for item in data:
        assert 'id' in item
        assert 'spot_type' in item
        assert 'name' in item
        assert 'distance' in item

# テストケース：周辺のスポットを取得できなかった時に404が返ってくるか
@pytest.mark.parametrize('test_spot_type, test_spot_lat, test_spot_lon', [
    ('tourist', 40.000000, 180.000000),
    ('gourmet', 40.000000, 180.000000),
])
def test_get_nearby_spots_404(test_spot_type, test_spot_lat, test_spot_lon):
    # リクエストを送信
    response = client.get('/spot/nearby', params = {'spot_type': test_spot_type, 'lat': test_spot_lat, 'lon': test_spot_lon})
    
    # ステータスコードの確認
    assert response.status_code == 404
    
    # responseのレスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"


# テストケース：周辺のスポットを取得で許容されてないspot_typeを指定したときに422が返ってくるか
def test_get_nearby_spots_type_422():
    # リクエストを送信
    response = client.get('/spot/nearby', params = {'spot_type': 'unknown', 'lat': 35.924287, 'lon': 139.488561})
    
    # ステータスコードの確認
    assert response.status_code == 422


# テストケース：周辺のスポットを取得で許容されていない緯度経度を指定したときに422が返ってくるか
@pytest.mark.parametrize('test_spot_type, test_spot_lat, test_spot_lon', [
    # 緯度のバリデーションチェック
    ('tourist', -90.000001, 139.000000),  # 緯度が下限より低い境界値
    ('tourist', 90.000001, 139.000000),   # 緯度が上限より高い境界値
    # 経度のバリデーションチェック
    ('tourist', 35.000000, -180.000001),  # 経度が下限より低い境界値
    ('tourist', 35.000000, 180.000001),   # 経度が上限より高い境界値
])
def test_get_nearby_spots_lat_lon_422(test_spot_type, test_spot_lat, test_spot_lon):
    # リクエストを送信
    response = client.get('/spot/nearby', params = {'spot_type': test_spot_type, 'lat': test_spot_lat, 'lon': test_spot_lon})
    
    # ステータスコードの確認
    assert response.status_code == 422