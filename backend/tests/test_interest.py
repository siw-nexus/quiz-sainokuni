from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)


# テストケース：興味がある保存の正常系のテスト。201が返るか
def test_create_interest_success():
    '''
    正しいデータで興味があるを登録できること。
    IDが発行され、ステータスコード201が変えることを確認。
    '''
    payload = {
        'user_id': 1,
        'spot_type': 'tourist',
        'spot_id': 1
    }
    
    response = client.post('/interests', json = payload)
    
    # 201 Created が返ること
    assert response.status_code == 201
    
    # レスポンスの中身確認
    data = response.json()
    assert data['user_id'] == payload['user_id']
    assert data['spot_type'] == payload['spot_type']
    assert data['spot_id'] == payload['spot_id']
    assert 'id' in data
    assert 'create_at' in data


# テストケース：興味がある保存ですでに存在するデータを送っても既存のデータが返ってきて201か返るか（冪等チェック）
def test_create_interest_duplicate():
    '''同じデータを2回送ってもエラーにならず、既存のデータが返るか'''
    payload = {
        'user_id': 1,
        'spot_type': 'gourmet',
        'spot_id': 1
    }
    
    # 1回目
    response1 = client.post('/interests', json=payload)
    
    # ステータスコードの確認
    assert response1.status_code == 201
    
    id1 = response1.json()['id']
    
    # 2回目
    response2 = client.post('/interests', json=payload)
    
    # ステータスコードの確認
    assert response2.status_code == 201
    id2 = response2.json()['id']
    
    #同じIDが返ってきているか確認
    assert id1 == id2


# テストケース：興味がある保存のschemasの制限に引っかかる値を送信して422が返ってくるか
@pytest.mark.parametrize('invalid_payload', [
    # spot_typeがtouristとgourmet以外
    {'user_id': 1, 'spot_type': 'unknown', 'spot_id': 1},
    
    # spot_idが1未満の値
    {'user_id': 1, 'spot_type': 'tourist', 'spot_id': 0},
    
    # 値が足りない（user_id）
    {'spot_type': 'tourist', 'spot_id': 1},
])
def test_create_interest_validation_error(invalid_payload):
    '''Pydanticのバリデーションで弾かれるか (422)'''
    response = client.post('/interests', json=invalid_payload)
    
    # ステータスコードの確認
    assert response.status_code == 422


# テストケース：興味がある保存の存在しないユーザーIDを指定したときに404が返ってくるか
def test_create_interest_unknown_user():
    '''存在しないユーザーIDを指定した場合'''
    payload = {
        'user_id': 9999,
        'spot_type': 'tourist',
        'spot_id': 1
    }
    
    response = client.post('/interests', json=payload)
    
    # ステータスコードの確認
    assert response.status_code == 404


# テストケース：興味がある一覧を正常に取得できるか
def test_get_interest():
    response = client.get('/interests', params={"user_id": 1})
    
    # ステータスコードの確認
    assert response.status_code == 200
    
    # レスポンスの確認
    data = response.json()
    
    if len(data) > 0:
        # 必要なキーが含まれているかチェック
        assert 'id' in data[0]
        assert 'spot_type' in data[0]
        assert 'spot_id' in data[0]
        assert 'name' in data[0]
        assert 'detail' in data[0]
        assert 'address' in data[0]
        assert 'lat' in data[0]
        assert 'lon' in data[0]
        assert 'availavle_time' in data[0]
        assert 'closure_info' in data[0]
        assert 'category' in data[0]
        assert 'tokusanhin' in data[0]
        assert 'start_time' in data[0]
        assert 'finish_time' in data[0]
        assert 'notes' in data[0]
        assert 'tel' in data[0]
        assert 'hp_url' in data[0]
        assert 'img' in data[0]