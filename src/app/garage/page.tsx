"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import VehicleDisplay from "@/components/VehicleDisplay";
import BottomNav from "@/components/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import { useGameState } from "@/game/store";

export default function GaragePage() {
  const { vehicle, coins } = useGameState();
  
  // Calculate vehicle performance stats based on upgrades
  const vehicleStats = useMemo(() => {
    const upgrades = vehicle.upgrades || {};
    let speed = 50; // base speed
    let handling = 40; // base handling
    let durability = 60; // base durability
    
    if (upgrades.performance) speed += 25;
    if (upgrades.turboBoost) speed += 15;
    if (upgrades.shinyWheels) handling += 20;
    if (upgrades.gps) handling += 10;
    if (upgrades.deluxeSponge) durability += 15;
    if (upgrades.helmet) durability += 20;
    if (upgrades.seatCover) durability += 10;
    
    return {
      speed: Math.min(100, speed),
      handling: Math.min(100, handling),
      durability: Math.min(100, durability)
    };
  }, [vehicle.upgrades]);
  
  const upgradeCount = Object.values(vehicle.upgrades || {}).filter(Boolean).length;
  const totalUpgrades = 12;
  
  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">🏠 My Garage</h1>
        <div className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
          <span>🪙</span>
          <span>{coins}</span>
        </div>
      </div>

      {/* Vehicle Display */}
      <VehicleDisplay />

      {/* Vehicle Statistics */}
      <div className="mt-6 p-4 rounded-2xl bg-white shadow border">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          📊 Vehicle Performance
        </h2>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium flex items-center gap-2">
                🚀 Speed
              </span>
              <span className="text-sm font-bold">{vehicleStats.speed}%</span>
            </div>
            <ProgressBar value={vehicleStats.speed} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium flex items-center gap-2">
                🎯 Handling
              </span>
              <span className="text-sm font-bold">{vehicleStats.handling}%</span>
            </div>
            <ProgressBar value={vehicleStats.handling} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium flex items-center gap-2">
                🛡️ Durability
              </span>
              <span className="text-sm font-bold">{vehicleStats.durability}%</span>
            </div>
            <ProgressBar value={vehicleStats.durability} />
          </div>
        </div>
      </div>

      {/* Upgrade Summary */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-blue-50 border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold flex items-center gap-2">
            🔧 Upgrades Installed
          </h3>
          <span className="text-sm font-bold text-orange-600">
            {upgradeCount}/{totalUpgrades}
          </span>
        </div>
        <ProgressBar value={(upgradeCount / totalUpgrades) * 100} />
        <div className="mt-3 flex gap-2">
          <Link
            href="/shop"
            className="flex-1 text-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 shadow"
          >
            🛒 Shop More
          </Link>
          <Link
            href="/upgrade"
            className="flex-1 text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 shadow"
          >
            ⚙️ View Upgrades
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          href="/racing"
          className="p-4 rounded-2xl bg-white border shadow hover:shadow-lg transition-shadow text-center"
        >
          <div className="text-2xl mb-2">🏁</div>
          <div className="font-semibold text-sm">Test Drive</div>
          <div className="text-xs text-gray-600">Racing Mode</div>
        </Link>
        <Link
          href="/delivery"
          className="p-4 rounded-2xl bg-white border shadow hover:shadow-lg transition-shadow text-center"
        >
          <div className="text-2xl mb-2">🚚</div>
          <div className="font-semibold text-sm">Delivery Run</div>
          <div className="text-xs text-gray-600">Earn Coins</div>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
