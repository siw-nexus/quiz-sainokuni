'use client'

// リンクを使用するためにインポート
import Link from 'next/link';
// 型定義をインポート
import { AnswerHistory } from "@/types/question";

// Propsの定義
type Props = {
  histories: AnswerHistory[];
}

export default function HistoryList({ histories }: Props) {
  console.log('届いているデータ:', histories);
  // 履歴が0件の場合の表示
  if (histories.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-400 text-sm">回答履歴がありません</p>
      </div>
    );
  }

  // 履歴がある場合の表示
  return (
    <div className="space-y-4">
      {/* 履歴データをマップして表示 */}
      {histories.map((item, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          
          {/* ヘッダー: 正解/不正解ラベルとスポットの種類 */}
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold px-2 py-1 rounded text-white ${
              item.is_correct ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              {item.is_correct ? '正解' : '不正解'}
            </span>
            <span className="text-xs text-gray-400">
              {item.spot_type === 'tourist' ? '観光地' : 'グルメ'}
            </span>
          </div>

          {/* 問題文 */}
          <p className="font-bold text-gray-800 mb-2 text-sm">
            Q. {item.question_text}
          </p>

          {/* 回答内容 */}
          <div className="text-sm bg-gray-50 p-3 rounded-lg mb-2">
            <p className="text-gray-600">
              あなたの回答: <span className="font-bold">{item.user_answer}</span>
            </p>
            {/* 不正解の時だけ正解を表示 */}
            {!item.is_correct && (
              <p className="text-red-600 text-xs mt-1">
                正解: {item.correct_answer}
              </p>
            )}
          </div>

       {/* spot_id がデータとして存在する場合だけ、リンクボタンを表示します */}
          {item.spot_id ? (
            <Link
              href={`/spot_detail?spot_type=${item.spot_type}&spot_id=${item.spot_id}`}
              className="block text-right text-xs text-blue-600 hover:underline"
            >
              スポット詳細へ &rarr;
            </Link>
          ) : (
            // spot_id がない場合は、ボタンの代わりにテキストを表示（クリックできないようにする）
            <p className="text-right text-xs text-gray-300 pointer-events-none">
              スポット詳細情報なし
            </p>
          )}
        </div>
      ))}
    </div>
  );
}