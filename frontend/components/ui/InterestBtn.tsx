"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react"; // アイコンをインポート

export default function InterestButton() {
  const [isInterested, setIsInterested] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleInterest = () => {
    setIsInterested(!isInterested);
    
    // アニメーション用のフラグをONにして、少し経ったらOFFにする
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
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