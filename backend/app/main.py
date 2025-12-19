from typing import List, Literal
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# データベース接続設定をインポート
from app.database import db_connect

# データベースを操作する関数をインポート
from app.crud.spot import get_spot, get_nearby_spots

# レスポンスモデルをインポート
from app.schemas.spot import GetSpotResponce, GetNearbySpotsResponse

# ルーターをインポート
from app.routers import auth, question, interest


app = FastAPI()

# CORSの設定
origins = [
    "http://localhost:3000", # Next.jsのURL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],   # 全てのメソッド(GET, POST...)を許可
    allow_headers=["*"],   # 全てのヘッダーを許可
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# 問題関係のルーターを登録
app.include_router(question.router)

# 興味関係のルーターを登録
app.include_router(interest.router)


# 観光地・グルメを一件取得
@app.get('/spot/detail', response_model = GetSpotResponce)
def g_spot(
    spot_type: Literal['tourist', 'gourmet'] = Query(..., description = '観光地(tourist)かグルメ(gourmet)か'),
    spot_id: int = Query(..., ge = 1, description = 'スポットのID（1以上の数値）'),
    db: Session = Depends(db_connect)
):
    result = get_spot(db, spot_type, spot_id)
    
    # データがからなら404エラーを返す
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result


# 周辺のスポット取得API
@app.get('/spot/nearby', response_model = List[GetNearbySpotsResponse])
def get_nearby_spot(
    lat: float = Query(..., ge = -90, le = 90, description = '緯度（-90～90）'),
    lon: float = Query(..., ge = -180, le = 180, description = '経度（-180～180）'),
    db: Session = Depends(db_connect)
):
    result = get_nearby_spots(db, lat, lon)
    
    if not result:
        raise HTTPException(status_code = 404, detail = "データが見つかりませんでした")
    
    return result


# ログインAPI
app.include_router(auth.router)