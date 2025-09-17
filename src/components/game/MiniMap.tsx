"use client";
import React from "react";
import { PublicState } from "@/game/core/engine";
import { progressDelta } from "@/game/core/world";

export default function MiniMap({ state }: { state: PublicState }) {
  const w=110, h=80;
  const roadWidth = 30; // width of the straight road in minimap
  
  // Convert progress (u) and lane to straight track coordinates
  const toXY = (u:number, lane:number)=>{
    // u represents progress along straight track (0 = top, 1 = bottom)
    const y = 10 + u * (h - 20); // vertical position along track
    const x = w/2 + lane * roadWidth/2; // lateral position (lane offset)
    return {x, y};
  };
  
  const p = toXY(state.player.u, state.player.lane);
  const a0 = toXY(state.ai[0]?.u ?? 0, state.ai[0]?.lane ?? 0);
  const a1 = toXY(state.ai[1]?.u ?? 0, state.ai[1]?.lane ?? 0);

  // Compute current place (1 = first)  
  const playerProgress = state.player.u + state.player.laps;
  const opponentsAhead = state.ai.filter(a => (a.u + (a.laps || 0)) > playerProgress).length;
  const place = 1 + opponentsAhead;

  return (
    <svg width={w} height={h} className="drop-shadow">
      <defs>
        <linearGradient id="mm" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0ea5e9"/>
          <stop offset="1" stopColor="#38bdf8"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx="12" fill="rgba(0,0,0,0.25)" stroke="#94a3b8" />
      {/* Straight road representation */}
      <rect x={(w-roadWidth)/2} y="10" width={roadWidth} height={h-20} fill="#374151" rx="2" />
      {/* Lane dividers */}
      <line x1={w/2} y1="10" x2={w/2} y2={h-10} stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
      {/* Road edges */}
      <rect x={(w-roadWidth)/2} y="10" width={roadWidth} height={h-20} stroke="#6b7280" strokeWidth="2" fill="none" rx="2" />
      {/* Start/finish line */}
      <rect x={(w-roadWidth)/2} y={h-12} width={roadWidth} height="2" fill="#fff" />
      <circle cx={p.x} cy={p.y} r="4" fill="#ff8c00" stroke="#fff" strokeWidth="1" />
      <circle cx={a0.x} cy={a0.y} r="3" fill="#3b82f6" />
      <circle cx={a1.x} cy={a1.y} r="3" fill="#22c55e" />
      {/* place bubble */}
      <g>
        <circle cx={w-14} cy={14} r={10} fill="#94a3b8" stroke="#e2e8f0"/>
        <text x={w-14} y={17} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{place}</text>
      </g>
    </svg>
  );
}
