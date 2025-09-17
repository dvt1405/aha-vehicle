"use client";
import React, { useMemo, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useGameActions, useGameState, Upgrades } from "@/game/store";

// Expanded upgrades with 12 items
const PRICES: Record<string, number> = {
  shinyWheels: 50,
  performance: 120,
  deluxeSponge: 30,
  customPaint: 80,
  turboBoost: 200,
  neonLights: 90,
  horn: 40,
  gps: 60,
  music: 70,
  seatCover: 35,
  helmet: 55,
  deliveryBox: 100,
};

const LABELS: Record<string, string> = {
  shinyWheels: "Shiny Wheels",
  performance: "Performance Kit",
  deluxeSponge: "Deluxe Sponge",
  customPaint: "Custom Paint",
  turboBoost: "Turbo Boost",
  neonLights: "Neon Lights",
  horn: "Funny Horn",
  gps: "GPS Tracker",
  music: "Music Player",
  seatCover: "Seat Cover",
  helmet: "Safety Helmet",
  deliveryBox: "Delivery Box",
};

const ICONS: Record<string, string> = {
  shinyWheels: "🛞",
  performance: "⚙️",
  deluxeSponge: "🧽",
  customPaint: "🎨",
  turboBoost: "🚀",
  neonLights: "💡",
  horn: "📯",
  gps: "📡",
  music: "🎵",
  seatCover: "🪑",
  helmet: "🪖",
  deliveryBox: "📦",
};

type UpgradeKey = keyof typeof PRICES;

function ShoppingAnimation({ show }: { show: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="animate-bounce text-5xl mb-2">🛒</div>
        <div className="animate-pulse text-lg font-black text-orange-500 drop-shadow">Purchased!</div>
      </div>
    </div>
  );
}

function UpgradeCard({
  k,
  owned,
  coins,
  onBuy,
}: {
  k: string;
  owned: boolean;
  coins: number;
  onBuy: (k: string, animate: () => void) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [showAnim, setShowAnim] = useState(false);
  const price = PRICES[k];
  const disabled = owned || coins < price || loading;

  async function handle() {
    if (disabled) return;
    setLoading(true);
    setShowAnim(true);
    await onBuy(k, () => setShowAnim(true));
    setTimeout(() => setShowAnim(false), 900);
    setLoading(false);
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-between p-4 rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] transition-all
        ${owned ? "opacity-60" : "hover:scale-105 hover:shadow-[0_12px_40px_0_rgba(255,140,0,0.18)]"}
      `}
      style={{
        boxShadow: owned
          ? "0 2px 8px 0 rgba(34,197,94,0.12)"
          : "0 8px 32px 0 rgba(0,0,0,0.18)",
      }}
    >
      <ShoppingAnimation show={showAnim} />
      <div
        className={`w-20 h-20 rounded-2xl grid place-items-center text-5xl mb-2 shadow-lg
          ${owned ? "bg-green-100 text-green-600" : "bg-orange-50 text-orange-500"}
        `}
        style={{
          filter: owned ? "drop-shadow(0 0 8px #bbf7d0)" : "drop-shadow(0 0 12px #fdba74)",
        }}
      >
        {ICONS[k]}
      </div>
      <div className="text-center">
        <div className="font-black text-base text-gray-800 drop-shadow mb-1">{LABELS[k]}</div>
        <div className={`text-xs font-bold ${owned ? "text-green-600" : "text-gray-500"}`}>
          {owned ? "Owned" : `${price} coins`}
        </div>
      </div>
      <button
        onClick={handle}
        disabled={disabled}
        className={`mt-3 rounded-xl px-4 py-2 text-xs font-extrabold shadow-lg w-full transition-all flex items-center justify-center gap-2
          ${
            owned
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : coins < price
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
          }`}
        style={{
          boxShadow: owned
            ? "0 2px 8px 0 #bbf7d0"
            : "0 4px 16px 0 #fdba74",
        }}
      >
        <span className="text-lg">🛒</span>
        {owned ? "Owned" : loading ? "Buying..." : "Buy"}
      </button>
    </div>
  );
}

export default function ShopPage() {
  const { coins, vehicle } = useGameState();
  const { buyUpgrade } = useGameActions();
  const upgrades = vehicle.upgrades || {};
  const items = useMemo(() => Object.keys(PRICES), []);

  async function onBuy(key: string, animate: () => void) {
    animate();
    buyUpgrade(key as UpgradeKey, PRICES[key]);
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center pb-24"
      style={{
        backgroundImage: "url('/aha-bg.png'), linear-gradient(to bottom, #e0f2fe, #f1f5f9)",
      }}
    >
      <div className="max-w-5xl mx-auto pt-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-gray-800 drop-shadow-lg tracking-tight">Shop</h1>
          <div className="text-lg rounded-full bg-yellow-100 text-yellow-800 px-5 py-2 font-black shadow flex items-center gap-2">
            <span role="img" aria-label="coin" className="text-2xl">🪙</span>
            {coins}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7">
          {items.map((k) => (
            <UpgradeCard
              key={k}
              k={k}
              owned={!!upgrades[k]}
              coins={coins}
              onBuy={onBuy}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
