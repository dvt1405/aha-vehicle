"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string };

export default function CTAButton({ className = "", label, children, ...rest }: Props) {
  return (
    <button
      className={`w-full rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 text-white font-semibold px-5 py-3 shadow-[0_8px_20px_rgba(251,146,60,0.45)] hover:shadow-[0_12px_28px_rgba(251,146,60,0.6)] transition-transform duration-200 active:scale-95 will-change-transform animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 ${className}`}
      {...rest}
    >
      {label ?? children}
    </button>
  );
}
