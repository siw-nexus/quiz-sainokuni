"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

// 型の定義をインポート
import { interest } from "@/types/interest";

// Propsの定義
type Props = {
  interests: interest[]
  spotType: string
  spotId: number
}

export default function InterestButton({ interests, spotType, spotId }: Props) {
  // 興味がある一覧にスポットが含まれているかチェック
  const isAlreadyInterested = interests.some(
    (item) => item.spot_type === spotType && String(item.spot_id) === String(spotId)
  );

  const [isInterested, setIsInterested] = useState(isAlreadyInterested);
  const [isAnimating, setIsAnimating] = useState(false);

  // 再取得されたらボタンを同期
  useEffect(() => {
    setIsInterested(isAlreadyInterested);
  }, [isAlreadyInterested]);

  const toggleInterest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 次の状態（反転）
    const nextState = !isInterested;
    setIsInterested(nextState);

    // 興味ありになるときだけアニメーションさせる
    if (nextState) {
      // アニメーション用のフラグをONにして、少し経ったらOFFにする
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={toggleInterest}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300
        ${isInterested ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}
      `}
    >
      {/* アイコン部分
         scaleアニメーションで「ポンッ」と跳ねる動きを再現
      */}
      <div className={`${isAnimating ? "animate-bounce-short" : ""}`}>
        <Bookmark
          size={24}
          // 選択中は塗りつぶし(fill)、未選択は枠線のみ
          fill={isInterested ? "currentColor" : "none"}
          className={`transition-colors duration-300`}
        />
      </div>

      {/* テキスト（あってもなくてもOK） */}
      <span className="text-sm font-bold">
        {isInterested ? "興味あり" : "興味なし"}
      </span>
    </button>
  );
}