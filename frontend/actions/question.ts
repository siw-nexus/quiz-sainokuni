'use server'

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

export async function saveQuestionResult(token: string, spotType: 'tourist' | 'gourmet', correctCount: number, limit: number) {
  // 回答結果を保存
  console.log(`spot_type：${spotType}、score：${correctCount}、total_questions：${limit}`);
  try {
    const res = await fetch(`${apiUrl}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({'spot_type': spotType, 'score': Number(correctCount), 'total_questions': Number(limit)})
    });
    
    // レスポンスの確認（エラーならfalseを返す）
    if (!res.ok) throw new Error("回答結果の保存に失敗しました");

    // 結果を返す
    return res.json();

  } catch (e) {
    console.error(e);
    return { success: false }; // エラーならfalseを返す
  }
}