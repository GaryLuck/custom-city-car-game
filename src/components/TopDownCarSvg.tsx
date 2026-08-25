import React from 'react';
import { PaintColorId, WheelRimId } from '../types/gameTypes';
import { PAINT_COLORS, WHEEL_RIMS } from '../data/gameConstants';

interface TopDownCarSvgProps {
  paintColor: PaintColorId;
  wheelRim: WheelRimId;
  headlightsOn: boolean;
  carType?: 'sports' | 'suv' | 'pickup' | 'convertible';
  isDirty?: boolean;
  isSparkling?: boolean;
  honking?: boolean;
  scale?: number;
}

export const TopDownCarSvg: React.FC<TopDownCarSvgProps> = ({
  paintColor,
  wheelRim,
  headlightsOn,
  carType = 'sports',
  isDirty = false,
  isSparkling = false,
  honking = false,
  scale = 1
}) => {
  const paint = PAINT_COLORS.find((p) => p.id === paintColor) || PAINT_COLORS[0];
  const rim = WHEEL_RIMS.find((r) => r.id === wheelRim) || WHEEL_RIMS[0];

  const isMonster = wheelRim === 'monster-tread';

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none"
      style={{ transform: `scale(${scale})` }}
    >
      {/* Headlight beams pointing right (forward direction of car) */}
      {headlightsOn && (
        <svg
          width="90"
          height="76"
          viewBox="0 0 90 76"
          className="absolute -right-16 top-1/2 -translate-y-1/2 pointer-events-none z-0"
        >
          <defs>
            <linearGradient id={`beamTop-${paintColor}`} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Top headlight cone */}
          <polygon
            points="0,15 88,2 88,28"
            fill={`url(#beamTop-${paintColor})`}
          />
          {/* Bottom headlight cone */}
          <polygon
            points="0,61 88,48 88,74"
            fill={`url(#beamTop-${paintColor})`}
          />
        </svg>
      )}

      {/* Main Car Top-Down SVG */}
      <svg
        width="112"
        height="64"
        viewBox="0 0 112 64"
        className="relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id={`bodyGrad-${paint.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={paint.bodyColor} />
            <stop offset="50%" stopColor={paint.roofColor} />
            <stop offset="100%" stopColor={paint.bodyColor} />
          </linearGradient>
        </defs>

        {/* Drop shadow ground oval */}
        <ellipse cx="54" cy="34" rx="46" ry="24" fill="rgba(0,0,0,0.22)" />

        {/* 4 Wheels (Top-left, Bottom-left, Top-right, Bottom-right) */}
        {/* Front-left wheel (top right in car coordinate) */}
        <g transform="translate(74, 4)">
          <rect
            x="0"
            y="0"
            width={isMonster ? 22 : 18}
            height={isMonster ? 11 : 8}
            rx="3"
            fill="#1C1C1E"
            stroke={rim.rimColor}
            strokeWidth="2"
          />
          {wheelRim === 'rainbow-spinner' && (
            <circle cx="9" cy="4" r="2.5" fill="#34C759" />
          )}
          {wheelRim === 'golden-crown' && (
            <circle cx="9" cy="4" r="2.5" fill="#FFD60A" />
          )}
        </g>
        {/* Front-right wheel (bottom right) */}
        <g transform="translate(74, 52)">
          <rect
            x="0"
            y="0"
            width={isMonster ? 22 : 18}
            height={isMonster ? 11 : 8}
            rx="3"
            fill="#1C1C1E"
            stroke={rim.rimColor}
            strokeWidth="2"
          />
          {wheelRim === 'rainbow-spinner' && (
            <circle cx="9" cy="4" r="2.5" fill="#FF2D55" />
          )}
          {wheelRim === 'golden-crown' && (
            <circle cx="9" cy="4" r="2.5" fill="#FFD60A" />
          )}
        </g>
        {/* Rear-left wheel (top left) */}
        <g transform="translate(18, 4)">
          <rect
            x="0"
            y="0"
            width={isMonster ? 22 : 18}
            height={isMonster ? 11 : 8}
            rx="3"
            fill="#1C1C1E"
            stroke={rim.rimColor}
            strokeWidth="2"
          />
        </g>
        {/* Rear-right wheel (bottom left) */}
        <g transform="translate(18, 52)">
          <rect
            x="0"
            y="0"
            width={isMonster ? 22 : 18}
            height={isMonster ? 11 : 8}
            rx="3"
            fill="#1C1C1E"
            stroke={rim.rimColor}
            strokeWidth="2"
          />
        </g>

        {/* Pickup Truck Bed if carType is pickup */}
        {carType === 'pickup' ? (
          <>
            {/* Truck bed back */}
            <rect
              x="12"
              y="12"
              width="36"
              height="40"
              rx="6"
              fill="#2C2C2E"
              stroke="#545458"
              strokeWidth="2"
            />
            {/* Cab */}
            <rect
              x="44"
              y="11"
              width="54"
              height="42"
              rx="12"
              fill={`url(#bodyGrad-${paint.id})`}
              stroke="#FFFFFF"
              strokeWidth="1.8"
            />
          </>
        ) : (
          /* Aerodynamic Sports / Family Car Body */
          <path
            d="M 16 20 C 14 14, 28 10, 52 10 L 82 11 C 94 12, 102 18, 102 32 C 102 46, 94 52, 82 53 L 52 54 C 28 54, 14 50, 16 44 Z"
            fill={`url(#bodyGrad-${paint.id})`}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        )}

        {/* Racing stripe on hood & roof */}
        <rect
          x="22"
          y="28"
          width="74"
          height="8"
          rx="4"
          fill={paint.stripeColor}
          opacity="0.9"
        />

        {/* Cockpit / Cabin Roof & Glass */}
        <path
          d="M 42 16 L 76 18 C 82 19, 84 24, 84 32 C 84 40, 82 45, 76 46 L 42 48 C 36 47, 34 41, 34 32 C 34 23, 36 17, 42 16 Z"
          fill="#1C1C1E"
          opacity="0.85"
        />
        {/* Front Windshield (bright cyan tint) */}
        <path
          d="M 68 19 L 78 21 C 81 22, 82 26, 82 32 C 82 38, 81 42, 78 43 L 68 45 Z"
          fill="#38BDF8"
          opacity="0.9"
        />
        {/* Rear Windshield */}
        <path
          d="M 42 18 L 36 21 L 36 43 L 42 46 Z"
          fill="#0284C7"
          opacity="0.75"
        />
        {/* Shiny Roof Panel */}
        <rect
          x="44"
          y="20"
          width="22"
          height="24"
          rx="5"
          fill={paint.bodyColor}
          stroke="#FFFFFF"
          strokeWidth="1"
        />
        {/* Racing Star / Number 6 on Roof for the 6-year-old grandson! */}
        <text
          x="55"
          y="36"
          textAnchor="middle"
          fontSize="13"
          fontWeight="900"
          fill={paint.stripeColor}
          fontFamily="Fredoka, sans-serif"
        >
          6
        </text>

        {/* Headlight Bulbs Front */}
        <circle
          cx="98"
          cy="18"
          r="4.5"
          fill={headlightsOn ? '#FFD60A' : '#E5E5EA'}
          stroke="#1C1C1E"
          strokeWidth="1.5"
        />
        <circle
          cx="98"
          cy="46"
          r="4.5"
          fill={headlightsOn ? '#FFD60A' : '#E5E5EA'}
          stroke="#1C1C1E"
          strokeWidth="1.5"
        />

        {/* Taillights Red Rear */}
        <rect x="14" y="15" width="4" height="9" rx="2" fill="#FF3B30" />
        <rect x="14" y="40" width="4" height="9" rx="2" fill="#FF3B30" />

        {/* If dirty, draw cartoon mud splatters on roof & hood */}
        {isDirty && (
          <g opacity="0.85">
            <circle cx="86" cy="24" r="5.5" fill="#6B4423" />
            <circle cx="58" cy="46" r="4.5" fill="#6B4423" />
            <circle cx="28" cy="22" r="5" fill="#6B4423" />
            <circle cx="72" cy="44" r="3.5" fill="#8D5B4C" />
          </g>
        )}
      </svg>

      {/* Honk Speech Bubble */}
      {honking && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#FFD60A] text-[#1C1C1E] font-heading font-extrabold text-sm px-2.5 py-0.5 rounded-full border-2 border-black shadow-lg animate-bounce z-30 whitespace-nowrap">
          BEEP BEEP! 🎺
        </div>
      )}

      {/* Freshly Washed/Polished Sparkles */}
      {isSparkling && (
        <div className="absolute -top-3 -right-3 text-lg animate-spin">✨</div>
      )}
    </div>
  );
};
