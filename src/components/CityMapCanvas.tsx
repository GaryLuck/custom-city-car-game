import React, { useEffect, useState } from 'react';
import { CarState, ActiveStationModal } from '../types/gameTypes';
import { TopDownCarSvg } from './TopDownCarSvg';
import { sound } from '../utils/soundEffects';
import { Sparkles, Wrench, Home, Navigation } from 'lucide-react';

interface CityMapCanvasProps {
  cars: CarState[];
  selectedCarId: string;
  onSelectCar: (id: string) => void;
  onOpenStation: (station: ActiveStationModal) => void;
  onMoveCar: (carId: string, targetX: number, targetY: number, targetAngle: number) => void;
}

// Key road waypoints so the car follows city streets cleanly
export interface StreetWaypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  stationTrigger?: ActiveStationModal;
}

export const STREET_WAYPOINTS: StreetWaypoint[] = [
  {
    id: 'home-driveway-1',
    name: "Grandpa's House Driveway (#1 Maple Ave)",
    x: 230,
    y: 720,
    stationTrigger: 'HOME_DRIVEWAY'
  },
  {
    id: 'home-driveway-2',
    name: "Neighbor Driveway (#2 Maple Ave)",
    x: 430,
    y: 720,
    stationTrigger: 'HOME_DRIVEWAY'
  },
  {
    id: 'home-driveway-3',
    name: "Corner Park (#3 Maple Ave)",
    x: 650,
    y: 720,
    stationTrigger: 'HOME_DRIVEWAY'
  },
  {
    id: 'car-wash-station',
    name: 'Splashy Bubble Car Wash Station',
    x: 230,
    y: 220,
    stationTrigger: 'CAR_WASH'
  },
  {
    id: 'service-garage-station',
    name: 'Grandpa Full Service Garage (Air, Paint, Gas, Wheels)',
    x: 740,
    y: 220,
    stationTrigger: 'SERVICE_STATION'
  },
  {
    id: 'downtown-intersection-west',
    name: 'Main Street & Bubble Ave Corner',
    x: 230,
    y: 470
  },
  {
    id: 'downtown-intersection-center',
    name: 'Town Square Fountain Corner',
    x: 490,
    y: 470
  },
  {
    id: 'downtown-intersection-east',
    name: 'Main Street & Garage Way Corner',
    x: 740,
    y: 470
  }
];

export const CityMapCanvas: React.FC<CityMapCanvasProps> = ({
  cars,
  selectedCarId,
  onSelectCar,
  onOpenStation,
  onMoveCar
}) => {
  const activeCar = cars.find((c) => c.id === selectedCarId) || cars[0];
  const [drivingDestinationName, setDrivingDestinationName] = useState<string | null>(null);
  const [honkingCarId, setHonkingCarId] = useState<string | null>(null);

  // Keyboard Arrow / WASD control support for 6-year-old
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 45;
      let nextX = activeCar.x;
      let nextY = activeCar.y;
      let nextAngle = activeCar.angle;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        nextY = Math.max(160, activeCar.y - step);
        nextAngle = -90;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        nextY = Math.min(760, activeCar.y + step);
        nextAngle = 90;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        nextX = Math.max(120, activeCar.x - step);
        nextAngle = 180;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        nextX = Math.min(880, activeCar.x + step);
        nextAngle = 0;
      } else if (e.key === ' ') {
        sound.playHonk(activeCar.hornPitch);
        setHonkingCarId(activeCar.id);
        setTimeout(() => setHonkingCarId(null), 600);
        return;
      } else {
        return;
      }

      sound.playVroom();
      onMoveCar(activeCar.id, nextX, nextY, nextAngle);

      // Check if near Car Wash or Service Garage
      if (Math.hypot(nextX - 230, nextY - 220) < 95) {
        onOpenStation('CAR_WASH');
      } else if (Math.hypot(nextX - 740, nextY - 220) < 95) {
        onOpenStation('SERVICE_STATION');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCar, onMoveCar, onOpenStation]);

  // Drive to selected waypoint smoothly
  const handleDriveToWaypoint = (wp: StreetWaypoint) => {
    sound.playVroom();
    setDrivingDestinationName(wp.name);

    // Calculate facing angle towards target
    const dx = wp.x - activeCar.x;
    const dy = wp.y - activeCar.y;
    let angle = activeCar.angle;
    if (Math.abs(dx) > Math.abs(dy)) {
      angle = dx >= 0 ? 0 : 180;
    } else {
      angle = dy >= 0 ? 90 : -90;
    }

    onMoveCar(activeCar.id, wp.x, wp.y, angle);

    // Trigger station modal after arriving animation (650ms)
    if (wp.stationTrigger) {
      setTimeout(() => {
        setDrivingDestinationName(null);
        onOpenStation(wp.stationTrigger!);
      }, 620);
    } else {
      setTimeout(() => setDrivingDestinationName(null), 620);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#34A853] overflow-hidden select-none flex items-center justify-center">
      {/* 1000 x 860 City Play-Mat Scaled Container */}
      <div className="relative w-full max-w-[1360px] h-full flex items-center justify-center p-2 md:p-4">
        <div className="relative w-full h-full bg-[#4CAF50] rounded-3xl border-8 border-[#1C1C1E] shadow-2xl overflow-hidden">
          {/* GRASS LAWN TEXTURE & PARK PONDS */}
          <svg
            viewBox="0 0 1000 860"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Soft Green Park Areas */}
            <rect x="0" y="0" width="1000" height="860" fill="#43A047" />

            {/* Little Blue Duck Pond in Park */}
            <ellipse
              cx="490"
              cy="255"
              rx="95"
              ry="55"
              fill="#29B6F6"
              stroke="#FFF9C4"
              strokeWidth="5"
            />
            <text x="475" y="260" fontSize="30">
              🦆
            </text>
            <text x="515" y="250" fontSize="22">
              ⛵
            </text>

            {/* ASPHALT CITY ROADS NETWORK */}
            {/* Horizontal Road 1: North Service Station Avenue (Y=210) */}
            <rect
              x="80"
              y="165"
              width="840"
              height="110"
              rx="24"
              fill="#48484A"
              stroke="#E5E5EA"
              strokeWidth="5"
            />
            {/* Yellow dashed center line North Ave */}
            <line
              x1="120"
              y1="220"
              x2="880"
              y2="220"
              stroke="#FFD60A"
              strokeWidth="5"
              strokeDasharray="22,18"
            />

            {/* Horizontal Road 2: Main Downtown Street (Y=470) */}
            <rect
              x="80"
              y="415"
              width="840"
              height="110"
              rx="24"
              fill="#48484A"
              stroke="#E5E5EA"
              strokeWidth="5"
            />
            <line
              x1="120"
              y1="470"
              x2="880"
              y2="470"
              stroke="#FFD60A"
              strokeWidth="5"
              strokeDasharray="22,18"
            />

            {/* Horizontal Road 3: MAPLE AVE (Grandpa & Grandson's Home Street!) (Y=720) */}
            <rect
              x="80"
              y="665"
              width="840"
              height="110"
              rx="24"
              fill="#3A3A3C"
              stroke="#E5E5EA"
              strokeWidth="5"
            />
            <line
              x1="120"
              y1="720"
              x2="880"
              y2="720"
              stroke="#FFD60A"
              strokeWidth="5"
              strokeDasharray="22,18"
            />

            {/* Vertical Road West: Bubble Splash Avenue (X=230) */}
            <rect
              x="175"
              y="165"
              width="110"
              height="610"
              rx="24"
              fill="#48484A"
              stroke="#E5E5EA"
              strokeWidth="5"
            />
            <line
              x1="230"
              y1="200"
              x2="230"
              y2="750"
              stroke="#FFD60A"
              strokeWidth="5"
              strokeDasharray="22,18"
            />

            {/* Vertical Road Center: Maple Town Center Street (X=490) */}
            <rect
              x="435"
              y="415"
              width="110"
              height="360"
              rx="24"
              fill="#48484A"
              stroke="#E5E5EA"
              strokeWidth="5"
            />
            <line
              x1="490"
              y1="440"
              x2="490"
              y2="750"
              stroke="#FFD60A"
              strokeWidth="5"
              strokeDasharray="22,18"
            />

            {/* Vertical Road East: Garage Expressway (X=740) */}
            <rect
              x="685"
              y="165"
              width="110"
              height="610"
              rx="24"
              fill="#48484A"
              stroke="#E5E5EA"
              strokeWidth="5"
            />
            <line
              x1="740"
              y1="200"
              x2="740"
              y2="750"
              stroke="#FFD60A"
              strokeWidth="5"
              strokeDasharray="22,18"
            />

            {/* WHITE ZEBRA CROSSWALKS */}
            {/* North-West Crosswalk */}
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={185 + i * 18}
                y="285"
                width="11"
                height="28"
                fill="#FFFFFF"
              />
            ))}
            {/* North-East Crosswalk */}
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={695 + i * 18}
                y="285"
                width="11"
                height="28"
                fill="#FFFFFF"
              />
            ))}
            {/* Maple Ave Home Crosswalk */}
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={185 + i * 18}
                y="635"
                width="11"
                height="28"
                fill="#FFFFFF"
              />
            ))}

            {/* STREET NAME SIGNS PAINTED ON ROAD */}
            <text
              x="360"
              y="772"
              fill="#FFD60A"
              fontSize="16"
              fontWeight="900"
              fontFamily="Fredoka"
              letterSpacing="2"
            >
              🏡 MAPLE AVE — OUR HOME STREET!
            </text>
            <text
              x="365"
              y="522"
              fill="#E5E5EA"
              fontSize="14"
              fontWeight="900"
              fontFamily="Fredoka"
              letterSpacing="2"
            >
              MAIN STREET BOULEVARD
            </text>
            <text
              x="355"
              y="155"
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="900"
              fontFamily="Fredoka"
              letterSpacing="2"
            >
              SERVICE & WASH EXPRESSWAY
            </text>
          </svg>

          {/* =======================================================
              INTERACTIVE BUILDINGS & SERVICE STATIONS (ON MAP)
             ======================================================= */}

          {/* 1. BUBBLE SPLASH CAR WASH BUILDING (TOP-LEFT) */}
          <div
            onClick={() => {
              sound.playBubbleSpray();
              handleDriveToWaypoint(STREET_WAYPOINTS[3]);
            }}
            className="absolute left-[3%] top-[3%] w-[33%] md:w-[28%] bg-gradient-to-br from-[#00A8E8] to-[#007AFF] border-4 border-[#1C1C1E] rounded-3xl p-3 md:p-4 shadow-[0_8px_0_#1C1C1E] cursor-pointer hover:scale-103 active:scale-97 transition z-20 group"
          >
            {/* Pulsing Beacon Ring */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-2xl md:text-3xl border-2 border-black shadow">
                  🫧
                </div>
                <div>
                  <div className="font-heading font-extrabold text-white text-base md:text-xl drop-shadow leading-tight">
                    BUBBLE CAR WASH
                  </div>
                  <div className="text-xs font-bold text-sky-100">
                    Inside & Outside Wash!
                  </div>
                </div>
              </div>

              {/* Animated Spinning Wash Brush */}
              <div className="w-10 h-10 rounded-full bg-[#FFD60A] border-2 border-black spin-cw flex items-center justify-center text-lg shadow">
                🌀
              </div>
            </div>

            {/* Mini Drive-In Button */}
            <div className="mt-2.5 bg-[#FFD60A] group-hover:bg-white text-[#1C1C1E] font-heading font-extrabold text-xs md:text-sm py-1.5 px-3 rounded-2xl border-2 border-black text-center flex items-center justify-center gap-1.5 shadow">
              <Sparkles className="w-4 h-4 text-[#FF3B30]" />
              TAP TO ENTER CAR WASH!
            </div>
          </div>

          {/* 2. GRANDPA'S FULL SERVICE GARAGE (TOP-RIGHT) */}
          <div
            onClick={() => {
              sound.playRatchetClick();
              handleDriveToWaypoint(STREET_WAYPOINTS[4]);
            }}
            className="absolute right-[3%] top-[3%] w-[34%] md:w-[30%] bg-gradient-to-br from-[#FF9500] to-[#FF3B30] border-4 border-[#1C1C1E] rounded-3xl p-3 md:p-4 shadow-[0_8px_0_#1C1C1E] cursor-pointer hover:scale-103 active:scale-97 transition z-20 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-2xl md:text-3xl border-2 border-black shadow">
                  🔧
                </div>
                <div>
                  <div className="font-heading font-extrabold text-white text-base md:text-xl drop-shadow leading-tight">
                    SERVICE STATION
                  </div>
                  <div className="text-xs font-bold text-amber-100">
                    Air • Paint • Gas • Wheels
                  </div>
                </div>
              </div>

              {/* Air / Wrench Badge */}
              <div className="bg-[#1C1C1E] text-[#FFD60A] font-mono-num font-extrabold text-xs px-2.5 py-1 rounded-xl border border-white/30">
                32 PSI BAY
              </div>
            </div>

            {/* 4 Mini Icons Bar */}
            <div className="mt-2.5 grid grid-cols-4 gap-1 text-center text-xs font-heading font-extrabold">
              <span className="bg-white/90 text-[#1C1C1E] rounded-xl py-1 border border-black">
                🛞 Air
              </span>
              <span className="bg-white/90 text-[#1C1C1E] rounded-xl py-1 border border-black">
                🎨 Paint
              </span>
              <span className="bg-white/90 text-[#1C1C1E] rounded-xl py-1 border border-black">
                ⛽ Gas
              </span>
              <span className="bg-white/90 text-[#1C1C1E] rounded-xl py-1 border border-black">
                ⚡ Rims
              </span>
            </div>

            <div className="mt-2 bg-[#FFD60A] group-hover:bg-white text-[#1C1C1E] font-heading font-extrabold text-xs md:text-sm py-1.5 px-3 rounded-2xl border-2 border-black text-center flex items-center justify-center gap-1.5 shadow">
              <Wrench className="w-4 h-4 text-[#FF3B30]" />
              TAP TO ENTER SERVICE GARAGE!
            </div>
          </div>

          {/* 3. GRANDPA & GRANDSON'S HOUSES ON MAPLE AVE (BOTTOM RESIDENTIAL STREET) */}
          <div
            onClick={() => {
              sound.playHonk(1.1);
              onOpenStation('HOME_DRIVEWAY');
            }}
            className="absolute bottom-[2%] left-[4%] right-[4%] bg-[#FFFDF7] border-4 border-[#1C1C1E] rounded-3xl p-3 md:p-3.5 shadow-[0_8px_0_#1C1C1E] cursor-pointer hover:bg-[#FFF8E7] transition z-20 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#34C759] text-white flex items-center justify-center text-2xl border-2 border-black shadow">
                🏡
              </div>
              <div>
                <div className="font-heading font-extrabold text-lg md:text-xl text-[#1C1C1E]">
                  MAPLE AVE — OUR HOME STREET & DRIVEWAY!
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-600">
                  {cars.length} Cars parked on our street! Click to switch cars or turn on lights & horns!
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cars.map((c) => (
                <button
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playVroom();
                    onSelectCar(c.id);
                  }}
                  className={`toy-btn px-3 py-1.5 rounded-2xl font-heading font-extrabold text-xs md:text-sm border-2 border-black flex items-center gap-1.5 ${
                    c.id === activeCar.id
                      ? 'bg-[#FFD60A] text-[#1C1C1E] shadow-[0_3px_0_#1C1C1E]'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  <span>{c.isGrandsonCar ? '🏎️' : '🚙'}</span>
                  <span>{c.name.split(' ')[0]}</span>
                </button>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStation('HOME_DRIVEWAY');
                }}
                className="toy-btn bg-[#007AFF] text-white font-heading font-extrabold px-3.5 py-1.5 rounded-2xl border-2 border-black shadow-[0_3px_0_#1C1C1E] text-xs md:text-sm flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                VIEW ALL CARS
              </button>
            </div>
          </div>

          {/* =======================================================
              CARS ON THE STREETS (PARKED OR DRIVING)
             ======================================================= */}
          {cars.map((car) => {
            const isSelected = car.id === activeCar.id;

            // Convert 1000x860 map coordinate to percentage position
            const leftPct = (car.x / 1000) * 100;
            const topPct = (car.y / 860) * 100;

            return (
              <div
                key={car.id}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHonk(car.hornPitch);
                  setHonkingCarId(car.id);
                  setTimeout(() => setHonkingCarId(null), 600);
                  onSelectCar(car.id);
                }}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(-50%, -50%) rotate(${car.angle}deg)`,
                  transition: 'left 0.58s cubic-bezier(0.25, 1, 0.5, 1), top 0.58s cubic-bezier(0.25, 1, 0.5, 1), transform 0.28s ease'
                }}
                className="absolute z-30 cursor-pointer group"
                title={`${car.name} — Click to Drive or Honk!`}
              >
                {/* Active Player Halo Indicator */}
                {isSelected && (
                  <div className="absolute -inset-4 rounded-full border-4 border-[#FFD60A] animate-ping pointer-events-none" />
                )}

                <TopDownCarSvg
                  paintColor={car.paintColor}
                  wheelRim={car.wheelRim}
                  headlightsOn={car.headlightsOn}
                  carType={car.carType}
                  honking={honkingCarId === car.id}
                  isSparkling={car.washStampEarned}
                  scale={isSelected ? 1.15 : 0.95}
                />

                {/* Driver Name Floating Label above car */}
                <div
                  style={{
                    transform: `rotate(${-car.angle}deg)`
                  }}
                  className={`mt-1 text-[11px] font-heading font-extrabold px-2 py-0.5 rounded-full border-2 border-black whitespace-nowrap shadow ${
                    isSelected
                      ? 'bg-[#FFD60A] text-[#1C1C1E]'
                      : 'bg-white/90 text-slate-800'
                  }`}
                >
                  {car.name}
                </div>
              </div>
            );
          })}

          {/* =======================================================
              KID TOUCH CONTROLLER D-PAD & QUICK DRIVE PILLS (BOTTOM RIGHT & LEFT)
             ======================================================= */}
          {/* Quick Drive Waypoint Bar floating above bottom panel */}
          <div className="absolute top-[17%] left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
            {drivingDestinationName && (
              <div className="bg-[#FFD60A] text-[#1C1C1E] font-heading font-extrabold px-4 py-1.5 rounded-full border-2 border-black shadow-lg animate-bounce flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF3B30]" />
                DRIVING TO: {drivingDestinationName}!
              </div>
            )}
          </div>

          {/* Touch D-PAD Steering Wheel overlay in corner for kids on iPad/touchscreens */}
          <div className="absolute right-4 bottom-24 md:bottom-28 z-30 flex flex-col items-center gap-1.5 bg-[#FFFDF7]/95 border-4 border-[#1C1C1E] p-2.5 rounded-3xl shadow-[0_8px_0_#1C1C1E]">
            <div className="text-[11px] font-heading font-extrabold text-[#1C1C1E]">
              STEER CAR 🕹️
            </div>
            <button
              onClick={() => {
                sound.playVroom();
                onMoveCar(
                  activeCar.id,
                  activeCar.x,
                  Math.max(160, activeCar.y - 120),
                  -90
                );
              }}
              className="toy-btn w-12 h-11 bg-[#007AFF] text-white font-extrabold rounded-2xl border-2 border-black shadow text-lg"
            >
              ▲
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playVroom();
                  onMoveCar(
                    activeCar.id,
                    Math.max(120, activeCar.x - 130),
                    activeCar.y,
                    180
                  );
                }}
                className="toy-btn w-12 h-11 bg-[#007AFF] text-white font-extrabold rounded-2xl border-2 border-black shadow text-lg"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  sound.playHonk(activeCar.hornPitch);
                  setHonkingCarId(activeCar.id);
                  setTimeout(() => setHonkingCarId(null), 600);
                }}
                className="toy-btn w-12 h-11 bg-[#FFD60A] text-[#1C1C1E] font-extrabold rounded-full border-2 border-black shadow text-lg"
                title="Honk Horn!"
              >
                🎺
              </button>
              <button
                onClick={() => {
                  sound.playVroom();
                  onMoveCar(
                    activeCar.id,
                    Math.min(880, activeCar.x + 130),
                    activeCar.y,
                    0
                  );
                }}
                className="toy-btn w-12 h-11 bg-[#007AFF] text-white font-extrabold rounded-2xl border-2 border-black shadow text-lg"
              >
                ▶
              </button>
            </div>
            <button
              onClick={() => {
                sound.playVroom();
                onMoveCar(
                  activeCar.id,
                  activeCar.x,
                  Math.min(760, activeCar.y + 120),
                  90
                );
              }}
              className="toy-btn w-12 h-11 bg-[#007AFF] text-white font-extrabold rounded-2xl border-2 border-black shadow text-lg"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
