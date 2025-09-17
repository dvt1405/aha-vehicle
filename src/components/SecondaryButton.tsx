"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string };

export default function SecondaryButton({ className = "", label, children, ...rest }: Props) {
  return (
    <button
      className={`w-full rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-5 py-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${className}`}
      {...rest}
    >
      {label ?? children}
    </button>
  );
}
