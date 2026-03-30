"use client";

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="logo-grad"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" className="fill-bg-primary" />
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="13"
        stroke="url(#logo-grad)"
        strokeWidth="2"
      />
      {/* C letter */}
      <path
        d="M16 24C16 20 19 16 25 16C28 16 30 17.5 30 17.5"
        className="stroke-text-primary"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M16 40C16 44 19 48 25 48C28 48 30 46.5 30 46.5"
        className="stroke-text-primary"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M16 24L16 40"
        className="stroke-text-primary"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* X letter */}
      <path
        d="M36 16L50 48"
        stroke="url(#logo-grad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M50 16L36 48"
        stroke="url(#logo-grad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
