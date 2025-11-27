from fastapi.testclient import TestClient
from app.main import app
import pytest


# テスト用のクライアントを作成
client = TestClient(app)


# テストケース：正常に問題を取得できるか---------------------------------------------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize("test_limit", [5, 10, 15])
def test_get_questions(test_spot_type, test_limit):
    # リクエストを送る 
    response = client.get("/question", params={"spot_type": test_spot_type, "limit": test_limit})

    # ステータスコードの確認
    assert response.status_code == 200

    # レスポンスの中身の確認
    data = response.json()
    assert isinstance(data, list)     # リストで返ってくるか
    assert len(data) == test_limit    # 問題数が取得した問題数と一致しているか
    
    if len(data) > 0:
        # 必要なキーが含まれているかチェック
        assert "id" in data[0]
        assert "spot_type" in data[0]
        assert "spot_id" in data[0]
        assert "question_text" in data[0]


# テストケース：存在しないタイプを指定したら空リストが返るか----------------------------------
def test_get_questions_unknown_type():
    response = client.get("/question", params={"spot_type": "unknown", "limit": 5})
    
    # ステータスコードの確認
    assert response.status_code == 404 
    
    # レスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"


# テストケース：正常に選択肢を取得できるか-----------------------------------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize("test_spot_id", [1, 50, 100])
def test_get_options(test_spot_type, test_spot_id):
    # リクエストを送る
    response = client.get("/option", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # ステータスコードの確認
    assert response.status_code == 200

    # レスポンスの中身の確認
    data = response.json()
    assert isinstance(data, list) # リストで返ってくるか
    assert len(data) == 4         # 選択肢が4件か
    
    if len(data) > 0:
        # 必要なキーが含まれているかチェック
        assert "id" in data[0]
        assert "option_text" in data[0]
        assert "is_correct" in data[0]
    
    
    # 正解と不正解をリストに分ける
    correct_options = [x for x in data if x["is_correct"] == 1]
    incorrect_options = [x for x in data if x["is_correct"] == 0]

    # 数を確認
    assert len(correct_options) == 1
    assert len(incorrect_options) == 3

    # 「正解」の中身が正しいかチェック
    assert correct_options[0]["id"] == test_spot_id

    # 選択肢に重複がないかチェック
    all_ids = [x["id"] for x in data]
    assert len(set(all_ids)) == 4


# テストケース：存在しないタイプを指定したら空リストが返るか-----------------------------------------
def test_get_options_unknown_type():
    # リクエストを送る
    response = client.get("/option", params={"spot_type": "unknown", "spot_id": 1})
    
    # ステータスコードの確認
    assert response.status_code == 404 
    
    # レスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"


# テストケース：存在しないIDを指定したら空リストが返るか-------------------------------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize("test_spot_id", [0, 101, -1, 9999])
def test_get_options_unknown_id(test_spot_type, test_spot_id):
    # リクエストを送る
    response = client.get("/option", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # responseのステータスコードの確認
    assert response.status_code == 404 
    
    # responseのレスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"