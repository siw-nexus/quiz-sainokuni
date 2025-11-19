import requests
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# .envからDATABASE_URLを読み込む
DATABASE_URL = os.environ['DATABASE_URL']


engine = create_engine(
    DATABASE_URL,
    connect_args={"charset": "utf8mb4"}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# tourist_spotsモデル、gourmet_spotsモデル、questionsモデルをインポート
try:
    from models import Tourist_spots, Gourmet_spots, Questions
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
                availavle_time = item["kankochi_riyokanojikanjoho"]["value"],
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


    db.close()
    print('データベース接続終了')


if __name__ == "__main__":
    seed_data()