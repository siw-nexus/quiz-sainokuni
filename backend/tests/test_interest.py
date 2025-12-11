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
    
    # 観光地とグルメの両方を取得出来てることを確認するフラグ
    has_tourist = False
    has_gourmet = False
    
    # データが返ってきているか確認
    assert len(data) > 0
        
    # 必要なキーが含まれているかチェック
    for i in data:
        # 共通項目
        assert 'id' in i
        assert 'spot_type' in i
        assert 'spot_id' in i
        assert 'name' in i
        assert 'detail' in i
        assert 'address' in i
        assert 'lat' in i
        assert 'lon' in i
        assert 'availavle_time' in i
        assert 'closure_info' in i
        assert 'category' in i
        assert 'tokusanhin' in i
        assert 'start_time' in i
        assert 'finish_time' in i
        assert 'notes' in i
        assert 'tel' in i
        assert 'hp_url' in i
        assert 'img' in i
        
        # 観光地のレスポンスにグルメのデータが混ざっていないか確認
        if i['spot_type'] == 'tourist':
            has_tourist = True
            
            assert i['category'] is None
            assert i['tokusanhin'] is None
            
        # グルメのレスポンスに観光地のデータが混ざっていないか確認
        if i['spot_type'] == 'gourmet':
            has_gourmet = True
            
            assert i['availavle_time'] is None
            assert i['closure_info'] is None
            
    # 観光地とグルメのデータを正しく受け取れているか確認
    assert has_tourist, '観光地データが含まれていません'
    assert has_gourmet, 'グルメデータが含まれていません'


# テストケース：興味がある一覧取得で興味があるを保存してないユーザーIDを指定したときに404が返るか
def test_get_interest_404():
    response = client.get('/interests', params={"user_id": 100000000000})
    
    # ステータスコードの確認
    assert response.status_code == 404
    
    # レスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"


# テストケース：興味がある一覧取得でuser_idの指定を許容されていない値にしたときに422が返ってくるか
@pytest.mark.parametrize('user_id', [-9999, -1, 0])
def test_get_interest_422(user_id):
    response = client.get('/interests', params={"user_id": user_id})
    
    # ステータスコードの確認
    assert response.status_code == 422