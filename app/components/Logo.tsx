"use client";

import React from "react";

interface LogoProps {
  collapsed?: boolean;
}

export function LogoIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background rounded square */}
      <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />

      {/* Brick wall pattern */}
      {/* Bottom row - 3 bricks */}
      <rect x="8" y="32" width="10" height="6" rx="1.2" fill="white" opacity="0.95" />
      <rect x="19.5" y="32" width="10" height="6" rx="1.2" fill="white" opacity="0.95" />
      <rect x="31" y="32" width="10" height="6" rx="1.2" fill="white" opacity="0.95" />

      {/* Middle row - 2.5 bricks (offset) */}
      <rect x="13" y="24.5" width="10" height="6" rx="1.2" fill="white" opacity="0.85" />
      <rect x="24.5" y="24.5" width="10" height="6" rx="1.2" fill="white" opacity="0.85" />

      {/* Top row - 2 bricks (offset again) */}
      <rect x="17" y="17" width="10" height="6" rx="1.2" fill="white" opacity="0.7" />
      <rect x="28.5" y="17" width="6" height="6" rx="1.2" fill="white" opacity="0.55" />

      {/* Rising bar / chart element */}
      <rect x="10" y="10" width="4" height="28" rx="2" fill="url(#bar-gradient)" opacity="0.9" />

      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="0.5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="bar-gradient" x1="12" y1="10" x2="12" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({ collapsed = false }: LogoProps) {
  if (collapsed) {
    return <LogoIcon className="w-9 h-9" />;
  }

  return (
    <div className="flex items-center gap-3">
      <LogoIcon className="w-10 h-10 flex-shrink-0" />
      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[19px] font-extrabold tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            Constru
          </span>
          <span className="text-[19px] font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 text-transparent bg-clip-text" style={{ fontFamily: "'Inter', sans-serif" }}>
            Joy
          </span>
        </div>
        <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-gray-500 leading-none">
          Gestão de Crédito
        </span>
      </div>
    </div>
  );
}
