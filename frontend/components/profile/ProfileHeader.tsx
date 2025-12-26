'use client'

// 型の定義をインポート
import { User } from "@/types/user"

// Propsの定義
type Props = {
  user: User;
}

export default function ProfileHeader({ user }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      {/* ▼ ユーザーアイコン（画像がない場合のプレースホルダー） */}
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </div>

      {/* ▼ ユーザー名とメールアドレスの表示 */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        {user.name}
      </h2>
      <p className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
        {user.email}
      </p>

      {/* ▼ 詳細情報のエリア（装飾用） */}
      <div className="mt-8 w-full border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">アカウント詳細</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-left">
          <div className="bg-gray-50 p-4 rounded-lg">
            <dt className="text-xs text-gray-500 mb-1">会員ステータス</dt>
            <dd className="text-sm font-medium text-green-600">有効</dd>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <dt className="text-xs text-gray-500 mb-1">登録日</dt>
            <dd className="text-sm font-medium text-gray-900">2024/01/01</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}