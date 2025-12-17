from pydantic import BaseModel, ConfigDict


# 観光地・グルメの詳細取得のレスポンスの型の定義
class GetSpotResponce(BaseModel):
    id: int
    name: str
    detail: str | None = None
    address: str | None = None
    lat: float | None = None
    lon: float | None = None
    available_time: str | None = None
    closure_info: str | None = None
    category: str  | None = None
    tokusanhin: str | None = None
    start_time: str | None = None
    finish_time: str | None = None
    notes: str | None = None
    tel: str | None = None
    hp_url: str | None = None
    img: str | None = None

    model_config = ConfigDict(from_attributes = True)


# 周辺のスポット取得のレスポンスの型の定義
class GetNearbySpotsResponse(BaseModel):
    id: int
    spot_type: str
    name: str
    distance: float