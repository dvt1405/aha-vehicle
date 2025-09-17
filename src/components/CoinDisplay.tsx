"use client";
import React from "react";
import { useGameState } from "@/game/store";

/**
 * CoinDisplay
 * Simple top bar coin display with an optional notifications badge.
 * The badge shows how many completed-but-unclaimed missions exist.
 */
export default function CoinDisplay() {
  const { coins, missions } = useGameState();
  const notiCount = missions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 shadow-inner">
        <span aria-hidden className="text-lg">🪙</span>
        <span className="text-sm font-semibold">{coins}</span>
      </div>
      <div className="relative">
        <span className="sr-only">Notifications</span>
        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 grid place-items-center text-gray-600">🔔</div>
        {notiCount > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 shadow">{notiCount}</span>
        )}
      </div>
    </div>
  );
}
