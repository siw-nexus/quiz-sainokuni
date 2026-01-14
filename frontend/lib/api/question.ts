// 型定義をインポート（パスは実際の場所に合わせてください。例: @/types/question）
import { QuizHistory } from "@/types/history";

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://nginx/api';

// 回答履歴を取得する関数
export async function getHistory(token: string): Promise<QuizHistory[]> {
  try {
    // ▼ エンドポイントはバックエンドの仕様に合わせて変更してください (例: /histories)
    const res = await fetch(`${apiUrl}/histories`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store', // キャッシュ無効化
    });

    // レスポンスの確認
    if (!res.ok) {
      console.error('履歴データの取得に失敗しました');
      return []; // エラー時は空配列を返して、画面がクラッシュしないようにします
    }

    // レスポンスの中身を取得
    const data = await res.json();
    
    // 型アサーション（必要に応じて）
    return data as QuizHistory[];

  } catch (e) {
    console.error(e);
    return []; // エラーなら空配列を返す
  }
}