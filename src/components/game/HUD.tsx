"use client";
import React from "react";
import Image from "next/image";
import { PublicState } from "@/game/core/engine";

export default function HUD({ state, onPause }: { state: PublicState; onPause: ()=>void }) {
  const lapNow = Math.min(state.player.laps + 1, state.totalLaps);
  const lapText = `LAP ${lapNow}/${state.totalLaps}`;
  const lapProgress = (state.player.u + state.player.laps) / state.totalLaps;

  // Helper to build an arc path for the curved progress (approx 200° -> -20°)
  const R = 26; const cx = 120; const cy = 32; const start = 200 * Math.PI/180; const end = -20 * Math.PI/180;
  const arcPath = (pct:number) => {
    const a1 = start; const a2 = start + (end - start) * Math.max(0, Math.min(1, pct));
    const x1 = cx + Math.cos(a1)*R, y1 = cy + Math.sin(a1)*R;
    const x2 = cx + Math.cos(a2)*R, y2 = cy + Math.sin(a2)*R;
    const large = (a2 - a1) % (Math.PI*2) > Math.PI ? 1 : 0;
    const sweep = 1; // clockwise
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} ${sweep} ${x2} ${y2}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top-left coin pill */}
      <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/30 backdrop-blur rounded-full px-3 py-1 pointer-events-auto shadow">
        <Image src="/ic_aha_coin.png" alt="coin" width={22} height={22} className="drop-shadow" />
        <span className="text-white font-semibold">{state.player.coins}</span>
      </div>

      {/* Top-center Lap + curved gauge */}
      <div className="absolute top-2 inset-x-0 flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1">
          <div className="text-xs font-extrabold text-white drop-shadow">{lapText}</div>
          <Image src="/ic_race_flags.png" alt="flags" width={16} height={16} className="opacity-90" />
        </div>
        <svg width="240" height="40" className="drop-shadow">
          {/* track */}
          <path d={arcPath(1)} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* progress */}
          <defs>
            <linearGradient id="lapgrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#facc15"/>
              <stop offset="100%" stopColor="#38bdf8"/>
            </linearGradient>
          </defs>
          <path d={arcPath(Math.max(0, Math.min(1, lapProgress)))} stroke="url(#lapgrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <button onClick={onPause} className="absolute top-2 right-[120px] w-8 h-8 rounded-full bg-black/30 text-white pointer-events-auto flex items-center justify-center" aria-label="Pause">⏸</button>

      {/* Boost feedback text */}
      {state.player.boosting>0 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-10 text-white font-extrabold text-lg drop-shadow animate-pulse">Speed Boost!</div>
      )}
    </div>
  );
}
