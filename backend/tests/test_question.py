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


# テストケース：問題取得で存在しないタイプを指定したら422が返るか----------------------------------
@pytest.mark.parametrize("test_limit", [5, 10, 15])
def test_get_questions_unknown_type(test_limit):
    response = client.get("/question", params={"spot_type": "unknown", "limit": test_limit})
    
    # ステータスコードの確認
    assert response.status_code == 422


# テストケース：問題取得でlimitを[5, 10, 15]以外でリクエスト送信したら422が返るか--------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize('test_422_limit', [-1, 0, 1, 4, 6, 9, 11, 14, 16, 999])
def test_get_question_limit_422(test_spot_type, test_422_limit):
    response = client.get('/question', params = {'spot_type': test_spot_type, 'limit': test_422_limit})
    
    # ステータスコードの確認
    assert response.status_code == 422


# テストケース：正常に選択肢を取得できるか-----------------------------------------------
@pytest.mark.parametrize("test_spot_type, test_spot_id", [
    ("tourist", 1), ("tourist", 100),
    ("gourmet", 1), ("gourmet", 99),
])
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


# テストケース：存在しないタイプを指定したら422が返るか-----------------------------------------
def test_get_options_unknown_type():
    # リクエストを送る
    response = client.get("/option", params={"spot_type": "unknown", "spot_id": 1})
    
    # ステータスコードの確認
    assert response.status_code == 422 


# テストケース：存在しないIDを指定したら空リストが返るか-------------------------------------------
@pytest.mark.parametrize("test_spot_type, test_spot_id", [
    ("tourist", 101), 
    ("gourmet", 100), 
    ("tourist", 9999),
])
def test_get_options_unknown_id(test_spot_type, test_spot_id):
    # リクエストを送る
    response = client.get("/option", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # responseのステータスコードの確認
    assert response.status_code == 404 
    
    # responseのレスポンスの中身の確認
    data = response.json()
    assert data["detail"] == "データが見つかりませんでした"
    

# テストケース：選択肢取得で許容されてない数値をIDに指定したら422が返るか----------------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize("test_spot_id", [-999, -1, 0])
def test_get_options_id_422(test_spot_type, test_spot_id):
    # リクエストを送る
    response = client.get("/option", params={"spot_type": test_spot_type, "spot_id": test_spot_id})
    
    # responseのステータスコードの確認
    assert response.status_code == 422


# テストケース：回答結果保存で正常系のテスト
@pytest.mark.parametrize("spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize("score, total", [
    (0, 5),
    (5, 5),
    (3, 10),
    (15, 15)
])
def test_save_question_success(spot_type, score, total):
    # 送信するデータ
    payload = {
        "user_id": 1,
        "spot_type": spot_type,
        "score": score,
        "total_questions": total
    }
    
    response = client.post("/save_questions", json=payload)
    
    # ステータスコードの確認
    assert response.status_code == 201
    
    # レスポンスの中身の確認
    data = response.json()
    assert "id" in data
    assert data["user_id"] == 1
    assert data["score"] == score
    assert data["total_questions"] == total


# テストケース：回答結果保存でscoreがtotal_questionsより大きい値の場合に400が返るか
@pytest.mark.parametrize("score, total", [
    (6, 5),
    (11, 10),
    (100, 15)
])
def test_save_question_logic_error(score, total):
    payload = {
        "user_id": 1,
        "spot_type": "tourist",
        "score": score,
        "total_questions": total
    }
    
    response = client.post("/save_questions", json=payload)
    
    # ステータスコードの確認
    assert response.status_code == 400
    
    # レスポンスの中身の確認
    assert response.json()["detail"] == "スコアが問題数より大きい数値ではいけません"


# テストケース：回答結果保存でschemasの制限に引っかかる値を送信して422が返ってくるか
def test_save_question_validation_error():
    # 存在しないspot_type
    res1 = client.post("/save_questions", json={"user_id": 1, "spot_type": "unknown", "score": 3, "total_questions": 5})
    
    # ステータスコードの確認
    assert res1.status_code == 422

    # マイナスのスコア
    res2 = client.post("/save_questions", json={"user_id": 1, "spot_type": "tourist", "score": -1, "total_questions": 5})
    
    # ステータスコードの確認
    assert res2.status_code == 422

    # 許可されていない問題数
    res3 = client.post("/save_questions", json={"user_id": 1, "spot_type": "tourist", "score": 3, "total_questions": 7})
    
    # ステータスコードの確認
    assert res3.status_code == 422


# テストケース：存在しない user_id を指定した場合に404が返るか
def test_save_question_unknown_user():
    payload = {
        "user_id": 9999,
        "spot_type": "tourist",
        "score": 3,
        "total_questions": 5
    }
    
    # リクエスト送信
    response = client.post("/save_questions", json=payload)
    
    # ステータスコードの確認
    assert response.status_code == 404
    
    # レスポンスの中身の確認
    assert response.json()['detail'] == '指定されたユーザーは存在しません'