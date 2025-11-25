from pydantic import BaseModel


# 問題文のレスポンスの型の定義
class QestionResponse(BaseModel):
    spot_type: str
    spot_id: int
    question_text: str

    class Config:
        from_attributes = True