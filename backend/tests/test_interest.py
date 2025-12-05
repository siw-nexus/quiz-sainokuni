from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# 興味がある保存の正常系のテスト。201が返るか
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


# 興味がある保存ですでに存在するデータを送っても既存のデータが返ってきて201か返るか（冪等チェック）
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