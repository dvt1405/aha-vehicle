"use client";
import React from "react";
import { PublicState } from "@/game/core/engine";

export default function VictoryOverlay({ state, onRestart }: { state: PublicState; onRestart: ()=>void }) {
  const first = (state as any).lastFinishPlace === 1;
  const title = first ? "VICTORY!" : `Place ${((state as any).lastFinishPlace ?? 3)} - Try Again`;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Big center title over gameplay */}
      <div className="absolute inset-x-0 top-1/3 text-center">
        <div className="text-5xl sm:text-6xl font-extrabold text-amber-400 drop-shadow-[0_6px_0_rgba(190,92,0,0.6)]">
          {title}
        </div>
        {/* coin rain simple visuals */}
        <div className="relative h-12 mt-2">
          {[...Array(10)].map((_,i)=> (
            <div key={i} className="absolute -top-2 left-1/2 animate-coin-wiggle" style={{transform:`translateX(${(i-5)*18}px)`}}>
              <span role="img" aria-label="coin">🪙</span>
            </div>
          ))}
        </div>
      </div>
      {/* Summary bottom and CTA */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-auto">
        <div className="text-sm text-white drop-shadow">Time: {state.time.toFixed(1)}s · Coins: {state.player.coins}</div>
        <button onClick={onRestart} className="mt-2 inline-flex items-center justify-center px-5 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600">Race Again</button>
      </div>
    </div>
  );
}
