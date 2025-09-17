"use client";
import React from "react";
import { GameProvider } from "@/game/store";
import "@/lib/i18n"; // Initialize i18n

export default function Providers({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}
