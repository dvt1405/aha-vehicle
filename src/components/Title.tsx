"use client";
import React from "react";

export default function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-extrabold text-gray-900">{children}</h1>;
}
