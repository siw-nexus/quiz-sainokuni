import Image from "next/image";

// コンポーネントのインポート
import QuizSelect from "@/components/home/QuizSelect";

export default function Home() {
  return (
    <main>
      <button className="border">説明</button>
      <button><Image src="/human.svg" width={50} height={50} alt="人のアイコン"></Image></button>
      <h1>クイズ彩の国</h1>
      <QuizSelect />
    </main>
  );
}
