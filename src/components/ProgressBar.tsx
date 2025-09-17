"use client";
import React from "react";

export default function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full">
      {label && <div className="mb-1 text-sm text-gray-700">{label}</div>}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${v}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-600">{v}%</div>
    </div>
  );
}
