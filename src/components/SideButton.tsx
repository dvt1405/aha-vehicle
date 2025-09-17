"use client";
import React from "react";
import Link from "next/link";

export type SideButtonProps = (
  | { as?: "button"; href?: never; onClick?: () => void }
  | { as: "link"; href: string; onClick?: never }
) & {
  icon: string;
  label: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

function isLinkProps(p: SideButtonProps): p is Extract<SideButtonProps, { as: "link"; href: string; onClick?: never }> {
  return p.as === "link" && typeof (p as any).href === "string";
}

export default function SideButton(props: SideButtonProps) {
  const { icon, label, disabled, className = "", ariaLabel } = props;
  const base = `flex flex-col items-center justify-center gap-1 w-14 sm:w-16 h-16 sm:h-20 rounded-2xl shadow-md border text-xs font-medium select-none ${
    disabled ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
  } transition-transform bg-white/90 backdrop-blur border-orange-100 text-gray-700 ${className}`;

  const content = (
    <div className="flex flex-col items-center justify-center">
      <span className="text-xl sm:text-2xl" aria-hidden>
        {icon}
      </span>
      <span className="mt-0.5 text-[11px] sm:text-xs text-center leading-tight">{label}</span>
    </div>
  );

  if (isLinkProps(props)) {
    const { href } = props;
    return (
      <Link href={href} className={base} aria-label={ariaLabel ?? label}>
        {content}
      </Link>
    );
  }

  const onClick = (props.as === "button" || !props.as) ? props.onClick : undefined;
  return (
    <button type="button" onClick={onClick} className={base} aria-label={ariaLabel ?? label} disabled={disabled}>
      {content}
    </button>
  );
}
