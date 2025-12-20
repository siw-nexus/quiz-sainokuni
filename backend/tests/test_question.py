import pytest
from app.dependencies import get_current_user
from app.main import app

# モデルをインポート
from app.models import Users


# テストケース：正常に問題と選択肢を取得できるか---------------------------------------------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize("test_limit", [5, 10, 15])
def test_get_questions(client, test_questions, test_spot_type, test_limit):
    # リクエストを送る 
    response = client.get("/question", params={"spot_type": test_spot_type, "limit": test_limit})

    # ステータスコードの確認
    assert response.status_code == 200

    # レスポンスの中身の確認
    data = response.json()
    assert isinstance(data, list)     # リストで返ってくるか
    assert len(data) == test_limit    # 問題数が取得した問題数と一致しているか
    
    if len(data) > 0:
        for question in data:
        # 必要なキーが含まれているかチェック
            assert "id" in question
            assert "spot_type" in question
            assert "spot_id" in question
            assert "question_text" in question
            assert "options" in question
        
            # リクエストしたspot_typeとレスポンスのspot_typeが一致しているか
            assert question['spot_type'] == test_spot_type
        
            # 選択肢が4つあるか確認
            assert len(question['options']) == 4
        
            # 選択肢に必要なキーが含まれているかチェック
            for option in question['options']:
                assert 'id' in option
                assert 'option_text' in option
                assert 'is_correct' in option
        
            # 正解と不正解をリストに分ける
            correct_option = [i for i in question['options'] if i['is_correct']]
            incorrect_option = [i for i in question['options'] if not i['is_correct']]
            
            # 正解が1つで不正解が3つか確認
            assert len(correct_option) == 1
            assert len(incorrect_option) == 3
            
            # 正解の選択肢が正しいか確認
            assert correct_option[0]['id'] == question['spot_id']
            
            # 選択肢に重複がないか確認
            all_id = [i['id'] for i in question['options']]
            assert len(set(all_id)) == 4


# テストケース：問題取得で存在しないタイプを指定したら422が返るか----------------------------------
@pytest.mark.parametrize("test_limit", [5, 10, 15])
def test_get_questions_unknown_type(client, test_limit):
    response = client.get("/question", params={"spot_type": "unknown", "limit": test_limit})
    
    # ステータスコードの確認
    assert response.status_code == 422


# テストケース：問題取得でlimitを[5, 10, 15]以外でリクエスト送信したら422が返るか--------------------
@pytest.mark.parametrize("test_spot_type", ["tourist", "gourmet"])
@pytest.mark.parametrize('test_422_limit', [-1, 0, 1, 4, 6, 9, 11, 14, 16, 999])
def test_get_question_limit_422(client, test_questions, test_spot_type, test_422_limit):
    response = client.get('/question', params = {'spot_type': test_spot_type, 'limit': test_422_limit})
    
    # ステータスコードの確認
    assert response.status_code == 422


# テストケース：回答結果保存で正常系のテスト
def test_save_question_success(client, test_user):
    # 送信するデータ
    payload = {
        "spot_type": 'tourist',
        "score": 5,
        "total_questions": 5
    }
    
    response = client.post("/questions", json=payload)
    
    # ステータスコードの確認
    assert response.status_code == 201
    
    # レスポンスの中身の確認
    data = response.json()
    assert "id" in data
    assert data["user_id"] == test_user.id
    assert data["score"] == 5
    assert data["total_questions"] == 5


# テストケース：回答結果保存でscoreがtotal_questionsより大きい値の場合に400が返るか
@pytest.mark.parametrize("score, total", [
    (6, 5),
    (11, 10),
    (100, 15)
])
def test_save_question_logic_error(client, score, total, test_user):
    payload = {
        "spot_type": "tourist",
        "score": score,
        "total_questions": total
    }
    
    response = client.post("/questions", json=payload)
    
    # ステータスコードの確認
    assert response.status_code == 400
    
    # レスポンスの中身の確認
    assert response.json()["detail"] == "スコアが問題数より大きい数値ではいけません"


# テストケース：回答結果保存でschemasの制限に引っかかる値を送信して422が返ってくるか
def test_save_question_validation_error(client, test_user):
    # 存在しないspot_type
    res1 = client.post("/questions", json={"spot_type": "unknown", "score": 3, "total_questions": 5})
    
    # ステータスコードの確認
    assert res1.status_code == 422

    # マイナスのスコア
    res2 = client.post("/questions", json={"spot_type": "tourist", "score": -1, "total_questions": 5})
    
    # ステータスコードの確認
    assert res2.status_code == 422

    # 許可されていない問題数
    res3 = client.post("/questions", json={"spot_type": "tourist", "score": 3, "total_questions": 7})
    
    # ステータスコードの確認
    assert res3.status_code == 422


# テストケース：存在しない user_id を指定した場合に404が返るか
def test_save_question_unknown_user(client):
    # DBに存在しないユーザーオブジェクトを作成
    fake_user = Users(id = 9999, email = 'ghost@example.com')
    
    # DBに存在しないユーザーのダミーの認証を設定
    app.dependency_overrides[get_current_user] = lambda: fake_user
    
    payload = {
        "spot_type": "tourist",
        "score": 3,
        "total_questions": 5
    }
    
    try:
        # リクエスト送信
        response = client.post("/questions", json=payload)
        
        # ステータスコードの確認
        assert response.status_code == 404
        
        # レスポンスの中身の確認
        assert response.json()['detail'] == '指定されたユーザーは存在しません'
        
    finally:
        app.dependency_overrides = {}


# テストケース：クイズの回答履歴を正常に保存できるか
def test_save_history_success(client, test_quiz_history, test_questions, test_spots):
    """正常に保存できるかテスト"""
    # 問題のIDを取得
    target_question = test_questions[0]
    
    # 選択肢のIDを取得
    target_choice_id = test_spots["tourist"][0].id
    
    payload = {
        "quiz_result_id": test_quiz_history.id,
        "question_num": 1,
        "question_id": target_question.id,
        "choice_id": target_choice_id,
        "is_correct": True
    }
    
    response = client.post("/histories", json=payload)
    
    # ステータスコードが 201 (Created) であること
    assert response.status_code == 201
    
    # レスポンスの中身が送信したものと一致するか
    data = response.json()
    assert data["quiz_result_id"] == test_quiz_history.id
    assert data["question_id"] == target_question.id


# テストケース：bodyに入れる値が不正な値の場合に422が返るか
@pytest.mark.parametrize("field, invalid_value", [
    ("quiz_result_id", 0),
    ("question_num", 0),
    ("question_id", 0),
    ("choice_id", 0),
])
def test_save_history_validation_error(client, field, invalid_value):
    """不正なデータ（1未満の数値など）を送った時にエラーになるかテスト"""
    payload = {
        "quiz_result_id": 0,
        "question_num": 1,
        "question_id": 1,
        "choice_id": 1,
        "is_correct": True
    }
    
    # 不正な値に書き換える
    payload[field] = invalid_value
    
    response = client.post("/histories", json=payload)
    
    # バリデーションエラーなので 422 が返るはず
    assert response.status_code == 422


# テストケース：必須項目が足りない時に422が返るか
@pytest.mark.parametrize("missing_field", [
    "quiz_result_id",
    "question_num", 
    "question_id",
    "choice_id",
    "is_correct",
])
def test_save_history_missing_field(client, missing_field):
    """必須項目（is_correct）が欠けている場合のテスト"""
    payload = {
        "quiz_result_id": 1,
        "question_num": 1,
        "question_id": 1,
        "choice_id": 1,
        "is_correct": True
    }
    
    # フィールドを削除する
    del payload[missing_field]
    
    response = client.post("/histories", json=payload)
    
    assert response.status_code == 422



# --- 回答履歴をgetするapiのテストケース ---
def test_get_histories_success(client, test_quiz_history, test_user):
    """
    【正常系】存在する user_id を指定してデータが取得できるか
    (既存のDBデータを使用)
    """
    response = client.get(f"/histories")
    
    # ステータスコードの確認
    assert response.status_code == 200, f"Error details: {response.text}"
    
    data = response.json()
    
    # 【変更点】データが「1件以上」あればOKとする
    assert len(data) >= 1, "データが1件も取得できませんでした"
    
    # 最初のデータの構造チェック（値の完全一致ではなく、キーの存在や型をチェック推奨）
    item = data[0]
    assert "id" in item
    assert "quiz_result_id" in item
    assert "question_num" in item
    assert "question_id" in item
    assert "choice_id" in item
    assert "is_correct" in item
    assert "spot_type" in item
    assert "score" in item
    assert "total_questions" in item
    assert "play_at" in item
    assert "question_text" in item


def test_get_histories_not_found(client):
    """
    【準正常系】存在しない user_id の場合 404 が返るか
    """
    # DBに存在しないユーザーオブジェクトを作成
    fake_user = Users(id = 9999, email = 'ghost@example.com')
    
    # DBに存在しないユーザーのダミーの認証を設定
    app.dependency_overrides[get_current_user] = lambda: fake_user
    
    try:
        response = client.get(f"/histories")
        
        assert response.status_code == 404
        assert response.json()["detail"] == "データが見つかりませんでした"
        
    finally:
        app.dependency_overrides = {}