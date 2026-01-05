from fastapi import APIRouter, Depends

# レスポンスモデルをインポート
from app.schemas.user import UserResponse

# JWT認証をインポート
from app.dependencies import get_current_user

router = APIRouter()


# ユーザー情報取得
@router.get('/me', response_model = UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user