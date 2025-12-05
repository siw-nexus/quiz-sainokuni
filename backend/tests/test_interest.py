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