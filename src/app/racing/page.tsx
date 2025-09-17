"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGameActions, useGameState } from "@/game/store";
import GameCanvas from "@/components/game/GameCanvas";
import HUD from "@/components/game/HUD";
import VictoryOverlay from "@/components/game/VictoryOverlay";
import BoostButton from "@/components/game/BoostButton";
import MiniMap from "@/components/game/MiniMap";
import { GameConfig, useGameCore } from "@/game/core/engine";

export default function RacingPage() {
  const { addCoins } = useGameActions();
  const { vehicle } = useGameState();

  // Compute player speed from upgrades (performance=speed, shinyWheels=shine, deluxeSponge=clean)
  const baseSpeed = useMemo(() => {
    let b = 0.25; // increased base speed for faster, smoother gameplay
    if (vehicle.upgrades.performance) b += 0.035;
    if (vehicle.upgrades.shinyWheels) b += 0.015;
    if (vehicle.upgrades.deluxeSponge) b += 0.015;
    return b;
  }, [vehicle.upgrades.performance, vehicle.upgrades.shinyWheels, vehicle.upgrades.deluxeSponge]);

  // Core game instance
  const config: GameConfig = useMemo(() => ({
    trackRadius: 260,
    roadWidth: 70,
    lapsToWin: 5, // ~30s total
    player: { baseSpeed, turnRate: 2.8, boostSpeed: Math.max(baseSpeed + 0.25, 0.45), boostDuration: 1.8, boostCooldown: 2.8 },
    ai: { count: 2 },
  }), [baseSpeed]);

  const core = useGameCore(config, {
    onCoin: (n) => addCoins(n),
    onFinish: (place, timeSec, coins) => {
      // Reward coins based on placement (in addition to collected coins)
      const placementBonus = place === 1 ? 20 : place === 2 ? 12 : 6;
      addCoins(placementBonus);
      console.log("Race finished", { place, timeSec, coins, placementBonus });
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

  const playerImageSrc = "/base_vehicle.png"; // map vehicle.id to image if more are added

  return (
    <div className="min-h-[75vh] w-full mx-auto max-w-[960px] relative select-none">
      <div className="relative bg-gradient-to-b from-sky-100 to-white rounded-2xl shadow-lg overflow-hidden aspect-[16/9]">
        <GameCanvas api={core.api} state={core.state} playerImageSrc={playerImageSrc} />

        {/* HUD overlay */}
        <HUD state={core.state} onPause={() => { setPaused((p)=>!p); core.api.togglePause(); }} />
        <div className="absolute top-3 right-3">
          <MiniMap state={core.state} />
        </div>

        {/* Controls */}
        <div className="absolute left-3 bottom-3">
          <BoostButton state={core.state} onBoost={core.api.tryBoost} />
        </div>
        <div className="absolute right-3 bottom-3 pointer-events-auto">
          <button
            onClick={() => core.api.toggleLane?.()}
            className="rounded-full w-20 h-20 sm:w-24 sm:h-24 bg-gray-800/70 text-white font-bold shadow-lg hover:bg-gray-800"
            aria-label="Steer"
          >
            Steer
          </button>
        </div>

        {/* Victory/summary */}
        {core.state.phase === "finished" && (
          <VictoryOverlay state={core.state} onRestart={core.api.restart} />
        )}
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">Controls: A/D or Left/Right to steer, Space to Boost, P/Esc to pause. On mobile: drag left/right to steer, tap Boost, tap Steer to switch lane.</p>
    </div>
  );
}
