"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGameActions } from "@/game/store";
import GameCanvas from "@/components/game/GameCanvas";
import HUD from "@/components/game/HUD";
import VictoryOverlay from "@/components/game/VictoryOverlay";
import BoostButton from "@/components/game/BoostButton";
import MiniMap from "@/components/game/MiniMap";
import { GameAPI, GameConfig, useGameCore } from "@/game/core/engine";

export default function RacingPage() {
  const { addCoins } = useGameActions();

  // Core game instance
  const config: GameConfig = useMemo(() => ({
    trackRadius: 260,
    roadWidth: 70,
    lapsToWin: 3,
    player: { baseSpeed: 0.18, turnRate: 1.8, boostSpeed: 0.33, boostDuration: 1.5, boostCooldown: 3.5 },
    ai: { count: 2 },
  }), []);

  const core = useGameCore(config, {
    onCoin: (n) => addCoins(n),
    onFinish: (place, timeSec, coins) => {
      // simple console telemetry
      console.log("Race finished", { place, timeSec, coins });
    },
  });

  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key.toLowerCase() === "p") {
        setPaused((p) => !p);
        core.api.togglePause();
      }
      if (e.key === " ") {
        core.api.tryBoost();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [core.api]);

  return (
    <div className="min-h-[75vh] w-full mx-auto max-w-[960px] relative select-none">
      <div className="relative bg-gradient-to-b from-sky-100 to-white rounded-2xl shadow-lg overflow-hidden aspect-[16/9]">
        <GameCanvas api={core.api} state={core.state} />

        {/* HUD overlay */}
        <HUD state={core.state} onPause={() => { setPaused((p)=>!p); core.api.togglePause(); }} />
        <div className="absolute top-3 right-3">
          <MiniMap state={core.state} />
        </div>

        {/* Boost button bottom-right */}
        <div className="absolute right-3 bottom-3">
          <BoostButton state={core.state} onBoost={core.api.tryBoost} />
        </div>

        {/* Victory/summary */}
        {core.state.phase === "finished" && (
          <VictoryOverlay state={core.state} onRestart={core.api.restart} />
        )}
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">Controls: A/D or Left/Right to steer, Space to Boost, P/Esc to pause. On mobile: drag left/right to steer, tap Boost.</p>
    </div>
  );
}
