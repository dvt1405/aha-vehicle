"use client";
import React from "react";
import { useGameState } from "@/game/store";

export default function CoinBadge() {
  const { coins } = useGameState();
  return (
    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(234,179,8,0.25)] border border-yellow-200/70">
      <span className="text-lg animate-coin-wiggle">🪙</span>
      <span className="text-sm font-semibold">{coins} AhaCoin</span>
    </div>
  );
}
