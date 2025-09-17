"use client";
import React from "react";
import Image from "next/image";
import { useGameState } from "@/game/store";
import ProgressBar from "./ProgressBar";

export default function VehicleDisplay({ shining = false }: { shining?: boolean }) {
  const { vehicle } = useGameState();

  const equipment: { key: keyof typeof vehicle.upgrades; label: string; icon: string }[] = [
    { key: "shinyWheels", label: "Wheels", icon: "🛞" },
    { key: "performance", label: "Engine", icon: "⚙️" },
    { key: "deluxeSponge", label: "Sponge", icon: "🧽" },
    { key: "customPaint", label: "Paint", icon: "🎨" },
  ];

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-sky-50 to-orange-50 p-4 sm:p-6 shadow-[0_10px_40px_rgba(2,132,199,0.15)]">
      {/* Background illustration */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white">
        {/* Garage background */}
        <Image
          src="/MainScreen.png"
          alt="Garage"
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />

        {/* City skyline window */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[85%] sm:w-2/3 h-8 sm:h-10 rounded-xl overflow-hidden border border-sky-200 shadow-inner">
          <div className="w-full h-full bg-gradient-to-b from-sky-200 via-sky-100 to-white/40 relative">
            <div className="absolute inset-0 flex items-end justify-center gap-2 text-[14px] sm:text-base opacity-70 select-none">
              <span>🏙️</span>
              <span>🌆</span>
              <span>🌇</span>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-7xl sm:text-8xl drop-shadow-lg select-none">🛵</div>
        </div>

        {/* Cleaning props around scooter */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute left-4 bottom-10 text-3xl sm:text-4xl">🪣</div>
          <div className="absolute right-6 bottom-14 text-2xl sm:text-3xl">🧽</div>
          <div className="absolute left-8 top-10 text-2xl sm:text-3xl">🧴</div>
        </div>

        {/* Dirt overlay based on cleanliness */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(124,58,237,0.04), transparent 40%), radial-gradient(circle at 70% 70%, rgba(124,58,237,0.06), transparent 45%)",
            opacity: (100 - vehicle.cleanliness) / 120,
            mixBlendMode: "multiply",
          }}
        />

        {/* Shine overlay */}
        {shining && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),rgba(255,255,255,0.0)_60%)] animate-slide-up-fade" />
            <div className="absolute inset-0 grid place-items-center text-3xl sm:text-4xl" aria-hidden>✨</div>
          </div>
        )}

        {/* Equipment slots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {equipment.map((e) => {
            const owned = !!vehicle.upgrades[e.key];
            return (
              <div key={String(e.key)} className={`relative w-10 h-10 rounded-full grid place-items-center text-lg ${owned ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                <span aria-hidden>{e.icon}</span>
                {!owned && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-300 grid place-items-center text-[10px]" title={`${e.label} locked`}>
                    🔒
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-700">Lv. {vehicle.level}</div>
        <div className="flex-1 mx-3">
          <ProgressBar value={vehicle.cleanliness} label="Cleanliness" />
        </div>
      </div>
    </div>
  );
}
