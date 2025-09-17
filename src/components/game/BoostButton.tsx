"use client";
import React from "react";
import { PublicState } from "@/game/core/engine";

export default function BoostButton({ state, onBoost }: { state: PublicState; onBoost: ()=>void }) {
  const cd = state.player.boostCooldown;
  const disabled = cd > 0 || state.phase !== "racing";
  const pct = cd > 0 ? (cd/3.5) : 0;
  return (
    <button
      onClick={onBoost}
      disabled={disabled}
      aria-label="Boost"
      className={`relative rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-lg pointer-events-auto flex items-center justify-center text-white font-bold ${disabled?"bg-sky-400/70":"bg-sky-500 hover:bg-sky-600"}`}
      style={{ boxShadow: disabled?"0 0 0 0 rgba(59,130,246,0)":"0 0 0 6px rgba(59,130,246,0.25), 0 8px 24px rgba(14,165,233,0.6)" }}
    >
      {/* Rocket icon */}
      <svg width="30" height="30" viewBox="0 0 64 64" className="drop-shadow">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e0f2fe"/>
            <stop offset="100%" stopColor="#ffffff"/>
          </linearGradient>
        </defs>
        <path d="M40 8c-6 2-12 8-16 16l8 8c8-4 14-10 16-16 0 0-4-8-8-8z" fill="url(#rg)" stroke="#0ea5e9" strokeWidth="2"/>
        <circle cx="38" cy="18" r="4" fill="#0ea5e9"/>
        <path d="M24 30l-8 8-6 2 2-6 8-8z" fill="#f59e0b" stroke="#b45309" strokeWidth="2"/>
      </svg>
      <span className="absolute bottom-2 text-[10px] font-extrabold">BOOST!</span>
      {/* radial cooldown overlay */}
      {cd>0 && (
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.7)" strokeWidth="8" fill="none" strokeDasharray={`${Math.round(276)}`} strokeDashoffset={`${Math.round(276*pct)}`} transform="rotate(-90 50 50)" />
        </svg>
      )}
    </button>
  );
}
