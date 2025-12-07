import Image from "next/image";

// コンポーネントのインポート
import QuestionCountSelector from "@/components/home/QuestionCountSelector";
import QuestionTypeSelectBtn from "@/components/home/QuestionTypeSelectBtn";

export default function Home() {
  return (
    <main>
      <button className="border">説明</button>
      <button><Image src="/human.svg" width={50} height={50} alt="人のアイコン"></Image></button>
      <h1>クイズ彩の国</h1>
      <QuestionCountSelector />
      <QuestionTypeSelectBtn />
    </main>
  );
}
