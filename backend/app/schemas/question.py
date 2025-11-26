from pydantic import BaseModel


# 問題文のレスポンスの型の定義
class QestionResponse(BaseModel):
    spot_type: str
    spot_id: int
    question_text: str

    class Config:
        from_attributes = True


# 選択肢のレスポンスの型の定義
class OptionResponse(BaseModel):
    option_text: str
    is_correct: int

    class Config:
        from_attributes = True