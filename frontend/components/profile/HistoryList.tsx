'use client'

// URL管理用のフックを追加
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// リンクを使用するためにインポート
import Link from 'next/link';

// 型定義をインポート
import { QuizHistory } from '@/types/history';
import { interest } from '@/types/interest';

// コンポーネントをインポート
import InterestButton from '../ui/InterestBtn';

// utilsの関数をインポート
import { formatToJpDate } from '@/utils/date';

// Propsの定義
type Props = {
  histories: QuizHistory[];
  interests: interest[];
}

export default function HistoryList({ histories, interests }: Props) {
  // ▼▼▼ 追加: URL操作用のフック ▼▼▼
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URLから「現在開いている履歴のID」を取得
  const expandedId = searchParams.get('expanded_id');

  // ▼▼▼ 追加: クリック時にURLを書き換える関数 ▼▼▼
  const handleToggle = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // すでに開いているものをクリックしたら閉じる（URLから削除）
    if (expandedId === String(id)) {
      params.delete('expanded_id');
    } else {
      // 閉じていれば開く（URLにセット）
      params.set('expanded_id', String(id));
    }
    
    // ページトップへのスクロールを防ぎつつURLを更新
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      {histories.map((history, index) => {
        // history.id が存在しない場合は index をフォールバックとして使用しますが、
        // 基本的にはデータベースのID (quiz_result_idなど) を使うのが理想です。
        const historyId = history.id || index; 
        
        return (
          <details 
            key={historyId} 
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
            // ▼▼▼ 変更: URLのIDと一致する場合のみ強制的に開く ▼▼▼
            open={expandedId === String(historyId)}
          >
            {/* ▼ クイズ実施回の概要 (親) */}
            <summary 
              className="cursor-pointer p-5 flex items-center list-none focus:outline-none"
              // ▼▼▼ 追加: クリックイベントを乗っ取り、URL更新処理に置き換える ▼▼▼
              onClick={(e) => {
                e.preventDefault(); // ブラウザ標準の開閉動作をキャンセル
                handleToggle(Number(historyId)); // URLを更新してReactに開閉させる
              }}
            >
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* カテゴリラベル */}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
                    history.spot_type === 'tourist' ? 'bg-blue-400' : 'bg-orange-400'
                  }`}>
                    {history.spot_type === 'tourist' ? '観光地' : 'グルメ'}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {formatToJpDate(history.play_at)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-800">
                    スコア: <span className="text-blue-600">{history.score}</span> / {history.total_questions}
                  </span>
                  {/* 矢印アイコン（開閉用） */}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </summary>

            {/* ▼ 各問題の回答履歴 (子) */}
            <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
              {history.answers.map((answer, aIndex) => (
                <div key={aIndex} className={`bg-white p-4 rounded-lg border-l-4 shadow-sm ${
                  answer.is_correct ? 'border-l-red-500' : 'border-l-blue-500'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-gray-800 leading-snug">
                      Q{aIndex + 1}. {answer.question_text}
                    </h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      answer.is_correct ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {answer.is_correct ? '正解' : '不正解'}
                    </span>
                  </div>

                  <div className="text-sm space-y-1 mb-4">
                    <p className="text-gray-600">
                      あなたの回答：<span className={`font-medium ${answer.is_correct ? 'text-red-600' : 'text-blue-600'}`}>
                        {answer.user_answer_text}
                      </span>
                    </p>
                    {!answer.is_correct && (
                      <p className="text-gray-500 italic">
                        正解は... <span className="font-bold text-gray-800">{answer.correct_answer_text}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <Link
                      href={`/spot_detail?spot_type=${history.spot_type}&spot_id=${answer.question_id}`}
                      className="flex-1 text-center py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors"
                    >
                      スポット詳細
                    </Link>
                    <div className="shrink-0">
                      <InterestButton interests={interests} spotId={answer.question_id} spotType={history.spot_type}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}