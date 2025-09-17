"use client";
import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import BottomNav from "@/components/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import { useGameActions, useGameState } from "@/game/store";

export default function TasksPage() {
  const { t } = useTranslation();
  const { missions } = useGameState();
  const { completeDelivery, claimMissionReward } = useGameActions();

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">{t('tasksAndMissions')}</h1>
        <div className="flex gap-2">
          <Link
            href="/racing"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 shadow"
          >
            🏁 {t('race')}
          </Link>
          <Link
            href="/delivery"
            className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 shadow"
          >
            🚚 {t('deliver')}
          </Link>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-100 to-blue-100 border">
        <h2 className="font-bold text-lg mb-2">🎯 {t('dailyChallenges')}</h2>
        <p className="text-sm text-gray-700">{t('completeMinigamesDescription')}</p>
      </div>

      <div className="space-y-4">
        {missions.map((m) => {
          const pct = Math.round((m.progress / m.goal) * 100);
          return (
            <div key={m.key} className="p-4 rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{m.title}</div>
                  <div className="text-xs text-gray-600">{t('reward', { amount: m.reward })}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {m.progress}/{m.goal}
                </div>
              </div>
              <div className="mt-2">
                <ProgressBar value={pct} />
              </div>
              <div className="mt-3 flex justify-end">
                {m.completed ? (
                  <button
                    onClick={() => claimMissionReward(m.key)}
                    disabled={m.claimed}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold shadow ${
                      m.claimed ? "bg-gray-100 text-gray-400" : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {m.claimed ? `✓ ${t('claimed')}` : `🎁 ${t('claimReward')}`}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/delivery"
                      className="rounded-xl px-4 py-2 text-sm font-semibold shadow bg-orange-600 text-white hover:bg-orange-700"
                    >
                      🚚 {t('playDelivery')}
                    </Link>
                    <Link
                      href="/racing"
                      className="rounded-xl px-4 py-2 text-sm font-semibold shadow bg-blue-600 text-white hover:bg-blue-700"
                    >
                      🏁 {t('playRacing')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
