import React from 'react';

export const RahiqLogo: React.FC<{ className?: string, showText?: boolean }> = ({ className = "w-32 h-32", showText = true }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hexagon bee hive shape */}
    <path d="M100 5 L170 40 L170 110 L100 145 L30 110 L30 40 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2"/>
    <path d="M100 20 L155 47 L155 103 L100 130 L45 103 L45 47 Z" fill="#fbbf24" opacity="0.5"/>

    {/* Bee */}
    <ellipse cx="100" cy="80" rx="18" ry="12" fill="#1a1a1a" transform="rotate(-10 100 80)"/>
    <ellipse cx="100" cy="80" rx="18" ry="12" fill="#f59e0b" clipPath="url(#beeStripes)" transform="rotate(-10 100 80)"/>
    <ellipse cx="100" cy="80" rx="18" ry="12" fill="#1a1a1a" clipPath="url(#beeStripes2)" transform="rotate(-10 100 80)"/>

    <clipPath id="beeStripes"><rect x="85" y="68" width="6" height="24" rx="3"/></clipPath>
    <clipPath id="beeStripes2"><rect x="97" y="68" width="6" height="24" rx="3"/></clipPath>

    {/* Wings */}
    <ellipse cx="85" cy="74" rx="12" ry="7" fill="#c4e4f7" opacity="0.8" transform="rotate(-30 85 74)"/>
    <ellipse cx="115" cy="74" rx="12" ry="7" fill="#c4e4f7" opacity="0.8" transform="rotate(30 115 74)"/>
    <ellipse cx="83" cy="76" rx="8" ry="5" fill="#aad4ef" opacity="0.6" transform="rotate(-30 83 76)"/>
    <ellipse cx="117" cy="76" rx="8" ry="5" fill="#aad4ef" opacity="0.6" transform="rotate(30 117 76)"/>

    {/* Stripes on body */}
    <path d="M82 75 Q100 72 118 75" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    <path d="M80 80 Q100 77 120 80" stroke="#1a1a1a" strokeWidth="3" fill="none"/>

    {/* Antennae */}
    <path d="M88 70 Q82 58 78 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M112 70 Q118 58 122 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="78" cy="52" r="3" fill="#1a1a1a"/>
    <circle cx="122" cy="52" r="3" fill="#1a1a1a"/>

    {/* Honey drop */}
    <path d="M100 145 Q115 155 100 170 Q85 155 100 145" fill="#d97706" stroke="#b45309" strokeWidth="1"/>
    <ellipse cx="96" cy="150" rx="3" ry="5" fill="#fbbf24" opacity="0.6"/>

    {/* Text */}
    {showText && (
      <>
        <text x="100" y="190" textAnchor="middle" fontFamily="serif" fontSize="32" fontWeight="bold" fill="#78350f">Rahiq</text>
        <text x="100" y="203" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#d97706" letterSpacing="3">STORE</text>
      </>
    )}
  </svg>
);

export default RahiqLogo;