"use client";
import React, { useState } from "react";
import Link from "next/link";
import CTAButton from "./CTAButton";
import { useGameActions, useGameState } from "@/game/store";

export default function ActionButtons() {
  const { startWash, finishWash } = useGameActions();
  const { vehicle } = useGameState();
  const [washing, setWashing] = useState(false);

  const canClean = vehicle.cleanliness < 100 && !washing;

  async function handleClean() {
    if (!canClean) return;
    setWashing(true);
    startWash();
    // Simulate a short wash animation time
    setTimeout(() => {
      finishWash(40, 2); // Clean +40, +2 coins bonus
      setWashing(false);
    }, 600);
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <Link href="/shop" className="w-full sm:w-auto min-w-40">
        <CTAButton aria-label="Open Upgrades Shop" className="bg-blue-600/90 from-blue-500 to-blue-600">
          <span className="mr-2">🛠️</span> Upgrade
        </CTAButton>
      </Link>

      <CTAButton
        onClick={handleClean}
        disabled={!canClean}
        className="w-full sm:w-auto min-w-40 bg-green-600 from-green-500 to-green-600"
        aria-live="polite"
        aria-busy={washing}
      >
        {washing ? (
          <span>Cleaning...</span>
        ) : (
          <span><span className="mr-2">🧽</span> Clean</span>
        )}
      </CTAButton>
    </div>
  );
}
