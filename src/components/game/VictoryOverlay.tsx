"use client";
import React from "react";
import { PublicState } from "@/game/core/engine";
import RewardScreen from "./RewardScreen";

export default function VictoryOverlay({ state, onRestart }: { state: PublicState; onRestart: ()=>void }) {
  const place = "lastFinishPlace" in state ? (state as { lastFinishPlace: number }).lastFinishPlace : 3;
  const placementBonus = place === 1 ? 20 : place === 2 ? 12 : 6;
  const totalCoins = state.player.coins + placementBonus;
  
  return (
    <RewardScreen
      coins={totalCoins}
      placement={place}
      gameStats={{
        time: state.time,
        collectedCoins: state.player.coins
      }}
      onClaim={onRestart}
      gameType="racing"
    />
  );
}
