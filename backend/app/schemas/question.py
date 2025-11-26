from pydantic import BaseModel


# 問題文のレスポンスの型の定義
class QestionResponse(BaseModel):
    id: int
    spot_type: str
    spot_id: int
    question_text: str

    class Config:
        from_attributes = True


# 選択肢のレスポンスの型の定義
class OptionResponse(BaseModel):
    id: int
    option_text: str
    is_correct: int

    class Config:
        from_attributes = True