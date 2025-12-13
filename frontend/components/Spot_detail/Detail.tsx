'use client'

import { Spot } from "@/types/spot";

// Propsを定義
type Props = {
  proSpotDetail: Spot
}

export default function Detail({ proSpotDetail }: Props) {
  return (
    <div>
      <p>{proSpotDetail.name}</p>
      <p>詳細：{proSpotDetail.detail}</p>
    </div>
  );
}