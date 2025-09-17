"use client";
import React, { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useGameActions, useGameState, Upgrades } from "@/game/store";

const PRICES: Record<keyof Upgrades, number> = {
  shinyWheels: 50,
  performance: 120,
  deluxeSponge: 30,
  customPaint: 80,
};

type UpgradeKey = keyof Upgrades;

function UpgradeCard({ k, owned, coins, onBuy }: { k: UpgradeKey; owned: boolean; coins: number; onBuy: (k: UpgradeKey) => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const price = PRICES[k];
  const disabled = owned || coins < price || loading;
  const label: Record<UpgradeKey, string> = {
    shinyWheels: "Shiny Wheels",
    performance: "Performance Kit",
    deluxeSponge: "Deluxe Sponge",
    customPaint: "Custom Paint",
  };

  const icon: Record<UpgradeKey, string> = {
    shinyWheels: "🛞",
    performance: "⚙️",
    deluxeSponge: "🧽",
    customPaint: "🎨",
  };

  async function handle() {
    if (disabled) return;
    setLoading(true);
    await onBuy(k);
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl grid place-items-center text-xl ${owned ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{icon[k]}</div>
        <div>
          <div className="font-semibold">{label[k]}</div>
          <div className="text-xs text-gray-600">{owned ? "Owned" : `${price} coins`}</div>
        </div>
      </div>
      <button
        onClick={handle}
        disabled={disabled}
        className={`rounded-xl px-4 py-2 text-sm font-semibold shadow ${
          owned
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : coins < price
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-orange-600 text-white hover:bg-orange-700"
        }`}
      >
        {owned ? "Owned" : loading ? "Buying..." : "Buy"}
      </button>
    </div>
  );
}

export default function ShopPage() {
  const { coins, vehicle } = useGameState();
  const { buyUpgrade } = useGameActions();
  const items = useMemo(() => Object.keys(PRICES) as UpgradeKey[], []);

  async function onBuy(key: UpgradeKey) {
    buyUpgrade(key, PRICES[key]);
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Shop</h1>
        <div className="text-sm rounded-full bg-yellow-100 text-yellow-800 px-3 py-1">🪙 {coins}</div>
      </div>

      <div className="space-y-3">
        {items.map((k) => (
          <UpgradeCard key={k} k={k} owned={!!vehicle.upgrades[k]} coins={coins} onBuy={onBuy} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
