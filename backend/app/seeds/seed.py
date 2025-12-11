import requests
from passlib.context import CryptContext
import json

# データベース接続設定をインポート
from app.database import SessionLocal


# ハッシュ化の設定
pwd_context = CryptContext(schemes = ['bcrypt'], deprecated = 'auto')


# モデルをインポート
try:
    from app.models import Tourist_spots, Gourmet_spots, Questions, Users, Interests
except ImportError:
    print('モデルのインポートに失敗しました')
    exit(1)


# 観光地のデータをINSERTする関数
def tourist_data_insert(endpoint, db):
    # 観光地情報のSPARQLクエリ
    sparql_tourist = """
        PREFIX ic: <https://imi.go.jp/ns/core/rdf#>
        PREFIX pd3110: <https://imi.go.jp/pd/pd3110/>
        PREFIX pd3113: <https://imi.go.jp/pd/pd3113/>
        PREFIX xsd: <https://www.w3.org/2001/XMLSchema#>
        PREFIX schema: <https://schema.org/>

        select distinct ?dantai_code ?dantaimei ?shikibetsujoho
        ?kankochi_meisho ?kankochi_shokaibun ?kankochi_jusho
        ?kankochi_ido ?kankochi_keido ?kankochi_shubetsu
        ?kankochi_shuyoninzu ?kankochi_riyokanojikanjoho
        ?kankochi_kyugyojoho ?kaishijikan ?shuryojikan ?nichijibiko
        ?kankochi_jiyukijutsuran
        ?kankochi_renrakusaki ?kankochi_denwabango ?kankochi_email ?kankochi_url
        ?kankochi_gazo ?kankochi_gazo_license ?kankochi_gazo_text
        where {
        graph<https://opendata.pref.saitama.lg.jp/graph/04_kankouti>
        { ?KEY pd3110:団体コード ?dantai_code;
        pd3110:団体名 ?dantaimei;
        pd3110:識別情報 ?shikibetsujoho;
        ic:名称/ic:表記 ?kankochi_meisho;
        ic:要約 ?kankochi_shokaibun;
        ic:住所/ic:表記 ?kankochi_jusho;
        ic:地理座標/ic:緯度 ?kankochi_ido;
        ic:地理座標/ic:経度 ?kankochi_keido;
        ic:種別 ?kankochi_shubetsu;
        ic:収容人数/ic:数値 ?kankochi_shuyoninzu;
        ic:利用可能時間/pd3113:利用可能時間情報 ?kankochi_riyokanojikanjoho;
        ic:利用可能時間/pd3113:休業情報 ?kankochi_kyugyojoho;
        ic:利用可能時間/ic:開始時間 ?kaishijikan;
        ic:利用可能時間/ic:終了時間 ?shuryojikan;
        ic:利用可能時間/ic:説明 ?nichijibiko;
        ic:備考 ?kankochi_jiyukijutsuran;
        ic:連絡先/ic:名称/ic:表記 ?kankochi_renrakusaki;
        ic:連絡先/ic:電話番号 ?kankochi_denwabango;
        ic:連絡先/ic:Eメールアドレス ?kankochi_email;
        ic:参照/ic:参照先 ?kankochi_url;
        schema:image/schema:contentUrl ?kankochi_gazo;
        schema:image/schema:license ?kankochi_gazo_license;
        schema:image/schema:text ?kankochi_gazo_text
        .}} order by ?dantai_code xsd:int(?shikibetsujoho) LIMIT 100
        """
    
    params = {
        "query": sparql_tourist,
        "format": "json"
    }
    
    try:
        # 観光地データの取得
        print('観光地のオープンデータ取得中...')
        tourist_res = requests.get(endpoint, params = params)
        tourist_res.encoding = 'utf-8'
        tourist_data = tourist_res.json()["results"]["bindings"]
        print(f'観光地のオープンデータ取得成功 ({len(tourist_data)} 件)')
        
        # 観光地データのINSERT
        for item in tourist_data:
            new_spot = Tourist_spots(
                name = item["kankochi_meisho"]["value"],
                detail = item["kankochi_shokaibun"]["value"],
                address = item["kankochi_jusho"]["value"],
                lat = item["kankochi_ido"]["value"],
                lon = item["kankochi_keido"]["value"],
                available_time = item["kankochi_riyokanojikanjoho"]["value"],
                closure_info = item["kankochi_kyugyojoho"]["value"],
                start_time = item["kaishijikan"]["value"],
                finish_time = item["shuryojikan"]["value"],
                notes = item["nichijibiko"]["value"],
                tel = item["kankochi_denwabango"]["value"],
                hp_url = item["kankochi_url"]["value"],
                img = item["kankochi_gazo"]["value"]
            )
            db.add(new_spot)
            
        # トランザクションを確定
        db.commit()
        
        print('観光地のinsert/check完了')
    except Exception as e:
        print(f"観光地のデータをINSERT中にエラーが発生しました: {e}")
        db.rollback() # エラー時はロールバック


# グルメのデータをINSERTする関数
def gourmet_data_insert(endpoint, db):
    # グルメのSPARQLクエリ
    sparql_gourmet = """
        PREFIX ic: <https://imi.go.jp/ns/core/rdf#>
        PREFIX pd3110: <https://imi.go.jp/pd/pd3110/>
        PREFIX pd3114: <https://imi.go.jp/pd/pd3114/>
        PREFIX xsd: <https://www.w3.org/2001/XMLSchema#>
        PREFIX schema: <https://schema.org/>

        select distinct ?dantai_code ?dantaimei ?shikibetsujoho
        ?tempo_meisho ?gaiyo
        ?tempo_jusho ?tempo_ido ?tempo_keido
        ?kubun ?tokusanhin ?category
        ?kaishijikan ?shuryojikan ?nichijibiko
        ?hp ?tempo_jiyukijutsuran
        ?tempo_gazo ?tempo_gazo_license ?tempo_gazo_text
        where {
        graph<https://opendata.pref.saitama.lg.jp/graph/05_gurume>
        { ?KEY pd3110:団体コード ?dantai_code;
        pd3110:団体名 ?dantaimei;
        pd3110:識別情報 ?shikibetsujoho;
        ic:名称/ic:表記 ?tempo_meisho;
        ic:概要 ?gaiyo;
        ic:住所/ic:表記 ?tempo_jusho;
        ic:地理座標/ic:緯度 ?tempo_ido;
        ic:地理座標/ic:経度 ?tempo_keido;
        pd3114:グルメ情報区分 ?kubun;
        pd3114:特産品 ?tokusanhin;
        ic:種別 ?category;
        ic:利用可能時間/ic:開始時間 ?kaishijikan;
        ic:利用可能時間/ic:終了時間 ?shuryojikan;
        ic:利用可能時間/ic:説明 ?nichijibiko;
        ic:参照/ic:参照先 ?hp;
        ic:備考 ?tempo_jiyukijutsuran;
        schema:image/schema:contentUrl ?tempo_gazo;
        schema:image/schema:license ?tempo_gazo_license;
        schema:image/schema:text ?tempo_gazo_text
        .}} order by ?dantai_code xsd:int(?shikibetsujoho) LIMIT 100
        """

    params = {
            "query": sparql_gourmet,
            "format": "json"
        }
    
    try:
        # グルメデータの取得
        print('グルメのオープンデータ取得中...')
        gourmet_res = requests.get(endpoint, params = params)
        gourmet_res.encoding = 'utf-8'
        gourmet_data = gourmet_res.json()["results"]["bindings"]
        print(f'グルメのオープンデータ取得成功 ({len(gourmet_data)} 件)')
        
        for item in gourmet_data:
            if item['tempo_meisho']['value']:
                new_gourmet = Gourmet_spots(
                    name = item["tempo_meisho"]["value"],
                    detail = item["gaiyo"]["value"],
                    address = item["tempo_jusho"]["value"],
                    lat = item["tempo_ido"]["value"],
                    lon = item["tempo_keido"]["value"],
                    category = item["kubun"]["value"],
                    tokusanhin = item["tokusanhin"]["value"],
                    start_time = item["kaishijikan"]["value"],
                    finish_time = item["shuryojikan"]["value"],
                    notes = item["nichijibiko"]["value"],
                    hp_url = item["hp"]["value"],
                    img = item["tempo_gazo"]["value"]
                )
                db.add(new_gourmet)
            
        # トランザクションを確定
        db.commit()
        
        print('グルメのinsert/check完了')
    except Exception as e:
        print(f"グルメのデータをINSERT中にエラーが発生しました: {e}")
        db.rollback() # エラー時はロールバック


# 緯度経度のデータを入れる関数
def coordinates_data_insert(db):
    # coordinates.jsonを読み込む
    with open('app/seeds/coordinates.json', 'r') as f:
        coordinates_data = json.load(f)
        
        # 観光地の緯度経度を入れる
        for item in coordinates_data['tourist']:
            spot = db.query(Tourist_spots).filter(Tourist_spots.id == item['id']).first()
            if not spot.lat or not spot.lon:
                spot.lat = item['lat']
                spot.lon = item['lon']
                db.commit()
        print(f'観光地の緯度経度のデータのinsert/check完了')
        
        # グルメの緯度経度を入れる
        for item in coordinates_data['gourmet']:
            spot = db.query(Gourmet_spots).filter(Gourmet_spots.id == item['id']).first()
            if not spot.lat or not spot.lon:
                spot.lat = item['lat']
                spot.lon = item['lon']
                db.commit()
        print(f'グルメの緯度経度のデータのinsert/check完了')


# 問題文のデータをINSERTする関数
def question_data_insert(db):
    # 観光地の問題文のINSERT
    try:
        new_questions = [
            Questions(
                spot_type = 'tourist',
                spot_id = i,
                question_text = 'この問題文はダミー。この問題文はダミー。この問題文はダミー。'
            )
            for i in range(1, 101)
        ]
        
        db.add_all(new_questions)
        
        # トランザクションを確定
        db.commit() 
        
        print('観光地の問題文のinsert/check完了')
    except Exception as e:
        print(f"観光地の問題文のデータをINSERT中にエラーが発生しました: {e}")
        db.rollback() # エラー時はロールバック
    
    # グルメの問題文のINSERT
    try:
        new_questions = [
            Questions(
                spot_type = 'gourmet',
                spot_id = i,
                question_text = 'この問題文はダミー。この問題文はダミー。この問題文はダミー。'
            )
            for i in range(1, 100)
        ]
        
        db.add_all(new_questions)
        
        # トランザクションを確定
        db.commit()
        
        print('グルメの問題文のinsert/check完了')
    except Exception as e:
        print(f"グルメの問題文のデータをINSERT中にエラーが発生しました: {e}")
        db.rollback() # エラー時はロールバック


# ダミーユーザーをINSERTする関数
def dummy_user_insert(db):
    print('ユーザーデータ確認中...')
    
    # ダミーユーザーの情報
    dummy_user = {'name': 'test', 'email': 'test@example.com', 'password': 'password'}
    
    # 同じメールアドレスのユーザーがいるか確認
    check_user = db.query(Users).filter(Users.email == dummy_user['email']).first()
    
    try:
        if not check_user:
            # パスワードをハッシュ化
            hashed_password = pwd_context.hash(dummy_user['password'])
            
            # 新しいダミーユーザーを定義
            new_user = Users(
                name = dummy_user['name'],
                email = dummy_user['email'],
                password = hashed_password
            )
            
            db.add(new_user)
        
            # トランザクションを確定
            db.commit()
            
            print('ユーザーデータのinsert/check完了')
        else:
            print('すでにダミーユーザーがいるのでスキップ')
    except Exception as e:
        print(f"ダミーユーザーのデータをINSERT中にエラーが発生しました: {e}")
        db.rollback() # エラー時はロールバック


# 興味があるのダミーデータをINSERTする関数
def dummy_interest_insert(db):
    # 観光地の興味があるのデータを取得
    tourist_interest = db.query(Interests).filter(
        Interests.user_id == 1,
        Interests.spot_type == 'tourist',
    ).first()
    
    # 観光地の興味があるのデータが無ければ追加
    if not tourist_interest:
        print('観光地の興味あるダミーデータINSERT')
        db.add(Interests(user_id = 1, spot_type = 'tourist', spot_id = 1))
        
    else:
        print('観光地の興味あるダメーデータはすでにあるのでスキップ')
    
    # グルメの興味があるのデータを取得
    gourmet_interest = db.query(Interests).filter(
        Interests.user_id == 1,
        Interests.spot_type == 'gourmet',
    ).first()
    
    # グルメの興味があるのデータが無ければ追加
    if not gourmet_interest:
        print('グルメの興味あるダミーデータINSERT')
        db.add(Interests(user_id = 1, spot_type = 'gourmet', spot_id = 1))
    
    else:
        print('グルメの興味あるダメーデータはすでにあるのでスキップ')
    
    # トランザクションを確定
    db.commit()


def seed_data():
    db = SessionLocal()
    print('データベース接続成功')
    
    # エンドポイントURL
    endpoint = "https://opendata.pref.saitama.lg.jp/sparql"
    
    # tourist_spotsテーブルにデータがあるかチェック
    if db.query(Tourist_spots).first():
        print('すでにデータがあるので初期データの投入をスキップ')
    else:
        tourist_data_insert(endpoint, db)
        
    # gourmet_spotsテーブルにデータがあるかチェック
    if db.query(Gourmet_spots).first():
        print('すでにデータがあるので初期データの投入をスキップ')
    else:
        gourmet_data_insert(endpoint, db)
    
    # 緯度経度のデータを入れる関数を呼び出す
    coordinates_data_insert(db)
    
    # questionsテーブルにデータがあるかチェック
    if db.query(Questions).first():
        print('すでにデータがあるので初期データの投入をスキップ')
    else:
        question_data_insert(db)
    
    # ダミーユーザーをINSERTする関数を呼び出す
    dummy_user_insert(db)
    
    # 興味があるのデータを入れる関数を呼び出す
    dummy_interest_insert(db)


    db.close()
    print('データベース接続終了')


if __name__ == "__main__":
    seed_data()