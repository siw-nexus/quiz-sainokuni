from pydantic import BaseModel, ConfigDict, Field
from typing import List, Literal
from datetime import datetime

# 選択肢のレスポンスの型の定義
class OptionResponse(BaseModel):
    id: int
    option_text: str
    is_correct: bool
    
# 問題文のレスポンスの型の定義（選択肢も入ってる）
class QestionResponse(BaseModel):
    id: int
    spot_type: str
    spot_id: int
    question_text: str
    options: List[OptionResponse]

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
    quiz_result_id: int = Field(ge = 1)
    question_num: int = Field(ge = 1)
    question_id: int = Field(ge = 1)
    choice_id: int = Field(ge = 1)
    is_correct: bool

# 回答履歴の型の定義
class QuizHistory(BaseModel):
    id: int
    question_num: int
    question_id: int
    question_text: str
    correct_answer_text: str
    choice_id: int
    user_answer_text: str
    is_correct: bool

class GetHistoryListResponse(BaseModel):
    id: int
    spot_type: str
    score: int
    total_questions: int
    play_at: datetime
    question_text: str
    answers: List[QuizHistory]

    model_config = ConfigDict(from_attributes=True)
