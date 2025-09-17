"use client";
import React from "react";
import VehicleDisplay from "@/components/VehicleDisplay";
import BottomNav from "@/components/BottomNav";
import { useGameState } from "@/game/store";

export default function GaragePage() {
  const { vehicle } = useGameState();
  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Garage</h1>
        <div className="text-sm text-gray-600">Vehicle ID: {vehicle.id}</div>
      </div>
      <VehicleDisplay />
      <div className="mt-4 text-sm text-gray-600">
        You currently own 1 vehicle. Visit the shop to upgrade its parts.
      </div>
      <BottomNav />
    </div>
  );
}
