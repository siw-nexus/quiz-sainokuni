from pydantic import BaseModel, ConfigDict, Field
from typing import Literal


# 問題文のレスポンスの型の定義
class QestionResponse(BaseModel):
    id: int
    spot_type: str
    spot_id: int
    question_text: str

    model_config = ConfigDict(from_attributes = True)


# 選択肢のレスポンスの型の定義
class OptionResponse(BaseModel):
    id: int
    option_text: str
    is_correct: int
    detail: str | None = None
    address: str | None = None
    lat: str | None = None
    lon: str | None = None
    availavle_time: str | None = None
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

# 保存したデータのレスポンスの型を定義
class SendSaveQuestionResponse(BaseModel):
    id: int
    user_id: int
    spot_type: str
    score: int
    total_questions: int

    model_config = ConfigDict(from_attributes=True) # 自動で上記で設定した通り型変換をしてくれる

# リザルトを保存するときのbodyの型の定義(簡単に言うとmain.pyのseve_qustionの型の設定をここでしている)
class SendSaveQuestion(BaseModel):
    user_id: int
    spot_type: Literal['tourist', 'gourmet']
    score: int = Field(ge = 0)
    total_questions: Literal[5, 10, 15]

class SendSaveHistoryResponse(BaseModel):
    quiz_result_id: int
    question_num: int
    question_id: int
    choice_id: int
    is_correct: bool

    model_config = ConfigDict(from_attributes=True) # 自動で上記で設定した通り型変換をしてくれる

class SendSaveHistory(BaseModel):
    quiz_result_id: int
    quiz_num: int
    quiz_id: int
    choice_id: int
    is_correct: bool
