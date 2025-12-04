from datetime import datetime
from pydantic import BaseModel, ConfigDict


# 興味があるの保存のbodyの型の定義
class InterestsCreate(BaseModel):
    user_id: int
    spot_type: str
    spot_id: int

# 興味があるを保存した結果のレスポンスの型の定義
class AddInterestResponse(BaseModel):
    id: int
    user_id: int
    spot_type: str
    spot_id: int
    create_at: datetime

    model_config = ConfigDict(from_attributes = True)