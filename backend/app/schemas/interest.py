from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal


# 興味があるの保存のbodyの型の定義
class InterestsCreate(BaseModel):
    user_id: int
    spot_type: Literal['tourist', 'gourmet']
    spot_id: int = Field(..., ge = 1)

# 興味があるを保存した結果のレスポンスの型の定義
class AddInterestResponse(BaseModel):
    id: int
    user_id: int
    spot_type: str
    spot_id: int
    create_at: datetime

    model_config = ConfigDict(from_attributes = True)

# 興味がある一覧取得のレスポンスの型の定義
class GetInterestResponse(BaseModel):
    id: int
    spot_type: str
    spot_id: int
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