import pytest


# テストケース：興味がある保存の正常系のテスト。201が返るか
def test_create_interest_success(client, test_user):
    '''
    正しいデータで興味があるを登録できること。
    IDが発行され、ステータスコード201が変えることを確認。
    '''
    payload = {
        'user_id': test_user.id,
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
def test_create_interest_duplicate(client, test_user):
    '''同じデータを2回送ってもエラーにならず、既存のデータが返るか'''
    payload = {
        'user_id': test_user.id,
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
def test_create_interest_validation_error(client, invalid_payload):
    '''Pydanticのバリデーションで弾かれるか (422)'''
    response = client.post('/interests', json=invalid_payload)
    
    # ステータスコードの確認
    assert response.status_code == 422


# テストケース：興味がある保存の存在しないユーザーIDを指定したときに404が返ってくるか
def test_create_interest_unknown_user(client):
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
def test_get_interest(client, test_user, test_interests):
    response = client.get('/interests', params={"user_id": test_user.id})
    
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
        assert 'available_time' in i
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
            
            assert i['available_time'] is None
            assert i['closure_info'] is None
            
    # 観光地とグルメのデータを正しく受け取れているか確認
    assert has_tourist, '観光地データが含まれていません'
    assert has_gourmet, 'グルメデータが含まれていません'


# テストケース：興味がある一覧取得で興味があるを保存してないユーザーIDを指定したときに404が返るか
def test_get_interest_404(client):
    response = client.get('/interests', params={"user_id": 100000000000})
    
    # ステータスコードの確認
    assert response.status_code == 404
    
    # レスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"


# テストケース：興味がある一覧取得でuser_idの指定を許容されていない値にしたときに422が返ってくるか
@pytest.mark.parametrize('user_id', [-9999, -1, 0])
def test_get_interest_422(client, user_id):
    response = client.get('/interests', params={"user_id": user_id})
    
    # ステータスコードの確認
    assert response.status_code == 422


# 興味がある削除テストコード
def test_delete_interest_success(client, test_interests):
    response = client.delete(
        "/interests", 
        params={"user_id": test_interests[0].user_id, "spot_type": test_interests[0].spot_type, "spot_id": test_interests[0].spot_id}
    )

    # 検証
    assert response.status_code == 200
    assert response.json() == {"message": "削除が完了しました"}


# 異常系 (404): 存在しないuser_id, spot_id等を指定した場合
def test_delete_interest_not_found(client):
    # 実行: 存在しないID (例: 9999) を送信
    response = client.delete(
        "/interests", 
        params={"user_id": 9999, "spot_type": "tourist", "spot_id": 9999}
    )

    # 検証: 404エラーが返ること
    assert response.status_code == 404
    assert response.json()["detail"] == "データが見つかりませんでした"


# バリデーション (境界値エラー): spot_id = 0 (1未満) -> 422
def test_validation_boundary_min_invalid(client):
    # モック不要（FastAPIが先にエラーを返すため）
    response = client.delete(
        "/interests", 
        params={"user_id": 1, "spot_type": "tourist", "spot_id": 0}
    )
    assert response.status_code == 422
    # エラー詳細に 'greater than or equal to 1' が含まれるか確認
    assert "Input should be greater than or equal to 1" in str(response.json())


# バリデーション (型エラー): spot_type が不正な文字列 -> 422
def test_validation_invalid_literal(client):
    response = client.delete(
        "/interests", 
        params={"user_id": 1, "spot_type": "hotel", "spot_id": 10} # hotelは許可されていない
    )
    assert response.status_code == 422
    assert "Input should be 'tourist' or 'gourmet'" in str(response.json())

# 7. バリデーション (型エラー): user_id に文字列を入力 -> 422
def test_validation_type_error(client):
    response = client.delete(
        "/interests", 
        params={"user_id": "abc", "spot_type": "tourist", "spot_id": 10}
    )
    assert response.status_code == 422

# 極端な値: 非常に大きな数値 (Python/FastAPIは処理できるがDB結果次第)
def test_extreme_values(client):
    huge_id = 999999999999999
    response = client.delete(
        "/interests", 
        params={"user_id": huge_id, "spot_type": "tourist", "spot_id": huge_id}
    )
    
    # FastAPIとしてはバリデーション通過するが、DBにはないので404
    assert response.status_code == 404