'use server'

import { cookies } from 'next/headers';

// APIのエンドポイント
const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';


// 興味があるボタンの切り替え関数
export async function toggleInterest(spotType: string, spotId: number, isRegisting: boolean) {
  // クッキーからアクセストークンを取得
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // トークンが無かったらfalseを返す
  if (!token) return { success: false };

  if (isRegisting) {
    // 興味がある保存関数を呼び出す
    return await addInterest(token, spotType, spotId);
  } else {
    return await removeInterest(token, spotType, spotId);
  }
  
}


// 興味があるを保存する関数
async function addInterest(token: string, spotType: string, spotId: number) {
  // 興味がある保存
  try {
    const res = await fetch(`${apiUrl}/interests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({'spot_type': spotType, 'spot_id': spotId})
    });

    // レスポンスの確認（エラーならfalseを返す）
    if (!res.ok) return { success: false };

    return { success: true };

  } catch (e) {
    console.error(e);
    return { success: false }; // エラーならfalseを返す
  }
}


// 興味があるを削除する関数
async function removeInterest(token: string, spotType: string, spotId: number) {
  // 興味がある削除
  try {
    const res = await fetch(`${apiUrl}/interests?spot_type=${spotType}&spot_id=${spotId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store', // キャッシュ無効化
    });

    // レスポンスの確認（エラーならfalseを返す）
    if (!res.ok) return { success: false };

    return { success: true };

  } catch (e) {
    console.error(e);
    return { success: false }; // エラーならfalseを返す
  }
}