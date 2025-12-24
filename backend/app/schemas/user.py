from pydantic import BaseModel, ConfigDict

# ユーザー情報のレスポンスの型の定義
class UserResponse(BaseModel):
    name: str
    email: str
    
    model_config = ConfigDict(from_attributes = True)