"use client";
import React from "react";
import CTAButton from "./CTAButton";

export type MainButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export default function MainButton({ className = "", label, children, ...rest }: MainButtonProps) {
  return (
    <CTAButton
      className={`w-full max-w-sm mx-auto text-base sm:text-lg py-3.5 sm:py-4 px-6 rounded-2xl ${className}`}
      {...rest}
    >
      {label ?? children}
    </CTAButton>
  );
}
