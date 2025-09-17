"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CoinDisplay from "@/components/CoinDisplay";
import VehicleDisplay from "@/components/VehicleDisplay";
import ProgressBar from "@/components/ProgressBar";
import BottomNav from "@/components/BottomNav";
import SideButton from "@/components/SideButton";
import MainButton from "@/components/MainButton";
import { useGameActions, useGameState } from "@/game/store";

export default function HomeScreenPage() {
  const { t } = useTranslation();
  const { vehicle } = useGameState();
  const { startWash, finishWash } = useGameActions();
  const [washing, setWashing] = useState(false);
  const [shining, setShining] = useState(false);

  const levelProgress = useMemo(() => {
    const owned = Object.values(vehicle.upgrades || {}).filter(Boolean).length;
    const total = 4; // total possible shown upgrades
    return Math.round((owned / total) * 100);
  }, [vehicle.upgrades]);

  const canClean = vehicle.cleanliness < 100 && !washing;

  function handleClean() {
    if (!canClean) return;
    setWashing(true);
    startWash();
    setTimeout(() => {
      finishWash(40, 2);
      setWashing(false);
    }, 600);
  }

  function handleShine() {
    if (shining) return;
    setShining(true);
    finishWash(12, 1);
    setTimeout(() => setShining(false), 700);
  }

  return (
    <div className="pb-28">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <CoinDisplay />
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1" aria-label={t('close')}>
          ✕
        </Link>
      </div>

      {/* Scene with side buttons */}
      <div className="relative">
        <VehicleDisplay shining={shining} />

        {/* Left side buttons */}
        <div className="absolute inset-y-0 left-2 sm:left-3 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="pointer-events-auto">
            <SideButton as="link" href="/shop" icon="🛒" label={t('shop')} />
          </div>
          <div className="pointer-events-auto">
            <SideButton as="link" href="/tasks" icon="📝" label={t('tasks')} />
          </div>
          <div className="pointer-events-auto">
            <SideButton as="link" href="/racing" icon="🏁" label={t('ahaRace')} ariaLabel={t('playAhaRaceGame')} />
          </div>
          <div className="pointer-events-auto">
            <SideButton as="link" href="/delivery" icon="🚚" label={t('delivery')} ariaLabel={t('playDeliveryGame')} />
          </div>
        </div>

        {/* Right side buttons */}
        <div className="absolute inset-y-0 right-2 sm:right-3 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="pointer-events-auto">
            <SideButton as="link" href="/upgrade" icon="🛠️" label={t('upgrade')} />
          </div>
          <div className="pointer-events-auto">
            <SideButton icon="🧽" label={washing ? t('cleaning') : t('clean')} onClick={handleClean} disabled={!canClean} />
          </div>
          <div className="pointer-events-auto">
            <SideButton icon="✨" label={t('shine')} onClick={handleShine} disabled={shining} />
          </div>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="mt-6">
        <ProgressBar value={levelProgress} label={t('levelProgress', { level: vehicle.level })} />
      </div>

      {/* Start Task CTA */}
      <div className="mt-4 flex items-center justify-center">
        <Link href="/tasks" className="w-full sm:w-auto">
          <MainButton>
            <span className="mr-2">🚀</span> {t('startTask')}
          </MainButton>
        </Link>
      </div>

      {/* Bottom Nav (kept for continuity) */}
      <BottomNav />
    </div>
  );
}
