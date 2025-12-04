from pydantic import BaseModel, ConfigDict
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
    spot_type: str
    score: Literal[5, 10, 15] = 5
    total_questions: int

    model_config = ConfigDict(from_attributes=True) # 自動で上記で設定した通り型変換をしてくれる