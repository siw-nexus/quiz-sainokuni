'use client'

import { LogIn } from 'lucide-react';
import Link from 'next/link';

type Props = {
	isLoggedIn: boolian;
}

export default function AuthStatusBtn({ isLoggedIn }: Props) {
	return (
		<div className="flex justify-end mb-8 md:mb-12">
			{/* ログインボタン or ユーザーボタン (PCでは右上に配置) */}
			<div className="relative group">
				{isLoggedIn ? (
					<button className="flex items-center justify-center w-12 h-12 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50 transition">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
						</svg>
					</button>
				) : (
					<>
						<button className="flex items-center justify-center w-12 h-12 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50 transition">
							<Link
								href='/login'
							>
								<LogIn />
							</Link>
						</button>
						<div className="absolute top-14 right-0 bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-bounce whitespace-nowrap">
							login
						</div>
					</>
				)}
			</div>
		</div>
	);
}