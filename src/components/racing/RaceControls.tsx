"use client";
import React from "react";
import BoostButton from "@/components/game/BoostButton";
import type { PublicState } from "@/game/core/engine";

export default function RaceControls({ state, onBoost, onSteer }: { state: PublicState; onBoost: ()=>void; onSteer: ()=>void }){
  return (
    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">
        <BoostButton state={state} onBoost={onBoost} />
      </div>
      <div className="pointer-events-auto">
        <button onClick={onSteer} className="rounded-full w-20 h-20 sm:w-24 sm:h-24 bg-gray-800/70 text-white font-bold shadow-lg hover:bg-gray-800" aria-label="Steer">Steer</button>
      </div>
    </div>
  );
}
