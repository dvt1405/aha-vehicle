"use client";
import React from "react";
import Link from "next/link";
import { useGameState } from "@/game/store";
import BottomNav from "@/components/BottomNav";

export default function UpgradePage() {
  const { vehicle } = useGameState();
  const upgrades = vehicle.upgrades || {};

  // All available upgrades to match shop consistency
  const items: { key: keyof typeof upgrades; label: string; icon: string }[] = [
    { key: "shinyWheels", label: "Shiny Wheels", icon: "🛞" },
    { key: "performance", label: "Performance Kit", icon: "⚙️" },
    { key: "deluxeSponge", label: "Deluxe Sponge", icon: "🧽" },
    { key: "customPaint", label: "Custom Paint", icon: "🎨" },
    { key: "turboBoost", label: "Turbo Boost", icon: "🚀" },
    { key: "neonLights", label: "Neon Lights", icon: "💡" },
    { key: "horn", label: "Funny Horn", icon: "📯" },
    { key: "gps", label: "GPS Tracker", icon: "📡" },
    { key: "music", label: "Music Player", icon: "🎵" },
    { key: "seatCover", label: "Seat Cover", icon: "🪑" },
    { key: "helmet", label: "Safety Helmet", icon: "🪖" },
    { key: "deliveryBox", label: "Delivery Box", icon: "📦" },
  ];

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Upgrade</h1>
        <Link href="/shop" className="text-sm text-orange-700 hover:underline">Open Shop</Link>
      </div>

      <p className="text-gray-600 mb-3">View your installed upgrades. Visit the shop to purchase more.</p>

      <div className="space-y-3">
        {items.map((it) => {
          const owned = !!upgrades[it.key];
          return (
            <div key={String(it.key)} className="flex items-center justify-between p-4 rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl grid place-items-center text-xl ${owned ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{it.icon}</div>
                <div>
                  <div className="font-semibold">{it.label}</div>
                  <div className="text-xs text-gray-500">{owned ? "Installed" : "Not owned"}</div>
                </div>
              </div>
              <Link href="/shop" className="rounded-xl px-4 py-2 text-sm font-semibold shadow bg-orange-600 text-white hover:bg-orange-700">{owned ? "Upgrade More" : "Buy"}</Link>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
