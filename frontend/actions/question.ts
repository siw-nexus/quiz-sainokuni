'use server'

// 型の定義をインポート
import { HistoryItem } from "@/types/history";

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

export async function saveQuestionResult(token: string, spotType: 'tourist' | 'gourmet', correctCount: number, limit: number) {
  // 回答結果を保存
  try {
    const res = await fetch(`${apiUrl}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({'spot_type': spotType, 'score': Number(correctCount), 'total_questions': Number(limit)})
    });
    
    // レスポンスの確認
    if (!res.ok) throw new Error("回答結果の保存に失敗しました");

    // 結果を返す
    return res.json();

  } catch (e) {
    console.error(e);
    return []; // エラーなら空配列を返す
  }
}

export async function saveQuizHistory(token: string, resultId: number, histories: HistoryItem[]) {
  // 回答履歴を保存
  try {
    const res = await fetch(`${apiUrl}/histories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(
        histories.map((h, index) => ({
          quiz_result_id: Number(resultId),
          question_num: Number(index + 1),
          question_id: Number(h.spot_id),
          choice_id: Number(h.userAnswerId),
          is_correct: Boolean(h.isCorrect)
        }))
      )
    });
    
    // レスポンスの確認
    if (!res.ok) throw new Error("回答履歴の保存に失敗しました");

    // 結果を返す
    return res.json();

  } catch (e) {
    console.error(e);
  }
}