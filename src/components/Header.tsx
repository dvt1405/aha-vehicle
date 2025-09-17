"use client";
import Link from "next/link";
import React from "react";
import CoinBadge from "./CoinBadge";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-orange-100">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-orange-600 font-extrabold text-lg">
          <span>🚗</span>
          <span>Driver Vehicle Care</span>
        </Link>
        <div className="flex items-center gap-2">
          <CoinBadge />
          <Link href="/leaderboard" className="text-sm text-orange-700 hover:underline">Leaderboard</Link>
        </div>
      </div>
    </header>
  );
}
