"use client";
import React from "react";
import { PublicState } from "@/game/core/engine";
import { progressDelta } from "@/game/core/world";

export default function MiniMap({ state }: { state: PublicState }) {
  const w=110, h=80;
  const rx = 45, ry = 28;
  const toXY = (u:number, lane:number)=>{
    const th = u*Math.PI*2; const x = w/2 + Math.cos(th)*rx + (-Math.sin(th))*lane*10; const y = h/2 + Math.sin(th)*ry + (Math.cos(th))*lane*10; return {x,y};
  };
  const p = toXY(state.player.u, state.player.lane);
  const a0 = toXY(state.ai[0]?.u ?? 0, state.ai[0]?.lane ?? 0);
  const a1 = toXY(state.ai[1]?.u ?? 0, state.ai[1]?.lane ?? 0);

  // Compute current place (1 = first)
  const opponentsAhead = state.ai.filter(a => progressDelta(state.player.u, a.u) > 0).length;
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
      <ellipse cx={w/2} cy={h/2} rx={rx} ry={ry} stroke="#cbd5e1" strokeDasharray="6 6" strokeWidth="2" fill="none" />
      <circle cx={p.x} cy={p.y} r="4" fill="#f97316" stroke="#fff" strokeWidth="1" />
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
