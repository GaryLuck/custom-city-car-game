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
    <div className="relative w-full h-full bg-[#2E7D32] overflow-hidden select-none flex items-center justify-center p-1 md:p-3">
      {/* 1000 x 860 City Play-Mat Scaled Container */}
      <div className="relative aspect-[1000/860] max-h-full max-w-full w-full h-auto bg-[#4CAF50] rounded-2xl md:rounded-3xl border-4 md:border-6 border-[#1C1C1E] shadow-2xl overflow-hidden flex items-center justify-center">
        {/* GRASS LAWN TEXTURE & PARK PONDS & BUILDINGS */}
        <svg
          viewBox="0 0 1000 860"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Soft Green Park Areas */}
          <rect x="0" y="0" width="1000" height="860" fill="#43A047" />

          {/* Little Blue Duck Pond in Park */}
          <ellipse
            cx="490"
            cy="245"
            rx="85"
            ry="48"
            fill="#29B6F6"
            stroke="#FFF9C4"
            strokeWidth="4"
          />
          <text x="475" y="252" fontSize="26">
            🦆
          </text>
          <text x="510" y="240" fontSize="18">
            ⛵
          </text>

          {/* Town Fountain & Flowerbed in Center Square */}
          <circle cx="490" cy="590" r="45" fill="#81C784" stroke="#2E7D32" strokeWidth="3" />
          <circle cx="490" cy="590" r="30" fill="#4FC3F7" stroke="#FFF" strokeWidth="3" />
          <text x="478" y="597" fontSize="22">⛲</text>
          <text x="430" y="580" fontSize="16">🌷</text>
          <text x="535" y="580" fontSize="16">🌻</text>
          <text x="445" y="620" fontSize="16">🌸</text>
          <text x="520" y="620" fontSize="16">🌼</text>

          {/* ASPHALT CITY ROADS NETWORK */}
          {/* Horizontal Road 1: North Service Station Avenue (Y=220) */}
          <rect
            x="80"
            y="165"
            width="840"
            height="110"
            rx="20"
            fill="#48484A"
            stroke="#E5E5EA"
            strokeWidth="4"
          />
          <line
            x1="120"
            y1="220"
            x2="880"
            y2="220"
            stroke="#FFD60A"
            strokeWidth="4"
            strokeDasharray="20,16"
          />

          {/* Horizontal Road 2: Main Downtown Street (Y=470) */}
          <rect
            x="80"
            y="415"
            width="840"
            height="110"
            rx="20"
            fill="#48484A"
            stroke="#E5E5EA"
            strokeWidth="4"
          />
          <line
            x1="120"
            y1="470"
            x2="880"
            y2="470"
            stroke="#FFD60A"
            strokeWidth="4"
            strokeDasharray="20,16"
          />

          {/* Horizontal Road 3: MAPLE AVE (Grandpa & Grandson's Home Street!) (Y=720) */}
          <rect
            x="80"
            y="665"
            width="840"
            height="110"
            rx="20"
            fill="#3A3A3C"
            stroke="#E5E5EA"
            strokeWidth="4"
          />
          <line
            x1="120"
            y1="720"
            x2="880"
            y2="720"
            stroke="#FFD60A"
            strokeWidth="4"
            strokeDasharray="20,16"
          />

          {/* Vertical Road West: Bubble Splash Avenue (X=230) */}
          <rect
            x="175"
            y="165"
            width="110"
            height="610"
            rx="20"
            fill="#48484A"
            stroke="#E5E5EA"
            strokeWidth="4"
          />
          <line
            x1="230"
            y1="200"
            x2="230"
            y2="750"
            stroke="#FFD60A"
            strokeWidth="4"
            strokeDasharray="20,16"
          />

          {/* Vertical Road Center: Maple Town Center Street (X=490) */}
          <rect
            x="435"
            y="415"
            width="110"
            height="360"
            rx="20"
            fill="#48484A"
            stroke="#E5E5EA"
            strokeWidth="4"
          />
          <line
            x1="490"
            y1="440"
            x2="490"
            y2="750"
            stroke="#FFD60A"
            strokeWidth="4"
            strokeDasharray="20,16"
          />

          {/* Vertical Road East: Garage Expressway (X=740) */}
          <rect
            x="685"
            y="165"
            width="110"
            height="610"
            rx="20"
            fill="#48484A"
            stroke="#E5E5EA"
            strokeWidth="4"
          />
          <line
            x1="740"
            y1="200"
            x2="740"
            y2="750"
            stroke="#FFD60A"
            strokeWidth="4"
            strokeDasharray="20,16"
          />

          {/* WHITE ZEBRA CROSSWALKS */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={`nwc-${i}`}
              x={185 + i * 18}
              y="285"
              width="10"
              height="24"
              fill="#FFFFFF"
            />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={`nec-${i}`}
              x={695 + i * 18}
              y="285"
              width="10"
              height="24"
              fill="#FFFFFF"
            />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={`swc-${i}`}
              x={185 + i * 18}
              y="635"
              width="10"
              height="24"
              fill="#FFFFFF"
            />
          ))}

          {/* DRIVEWAYS CONNECTING MAPLE AVE TO HOUSES */}
          {/* Driveway 1 */}
          <rect x="205" y="770" width="50" height="60" fill="#636366" stroke="#999" strokeWidth="2" rx="4" />
          {/* Driveway 2 */}
          <rect x="405" y="770" width="50" height="60" fill="#636366" stroke="#999" strokeWidth="2" rx="4" />
          {/* Driveway 3 */}
          <rect x="625" y="770" width="50" height="60" fill="#636366" stroke="#999" strokeWidth="2" rx="4" />

          {/* 🏡 MAPLE AVE HOUSES ALONG BOTTOM */}
          {/* House 1: Grandpa's House */}
          <g transform="translate(180, 780)">
            <rect x="0" y="18" width="80" height="48" fill="#FFF3E0" stroke="#1C1C1E" strokeWidth="2.5" rx="6" />
            <polygon points="-6,18 40,-6 86,18" fill="#E53935" stroke="#1C1C1E" strokeWidth="2.5" />
            <rect x="32" y="36" width="16" height="30" fill="#6D4C41" rx="2" />
            <rect x="10" y="28" width="16" height="16" fill="#81D4FA" stroke="#1C1C1E" strokeWidth="1.5" rx="2" />
            <rect x="54" y="28" width="16" height="16" fill="#81D4FA" stroke="#1C1C1E" strokeWidth="1.5" rx="2" />
            <text x="40" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFF">#1</text>
          </g>

          {/* House 2: Leo's House */}
          <g transform="translate(380, 780)">
            <rect x="0" y="18" width="80" height="48" fill="#E3F2FD" stroke="#1C1C1E" strokeWidth="2.5" rx="6" />
            <polygon points="-6,18 40,-6 86,18" fill="#1E88E5" stroke="#1C1C1E" strokeWidth="2.5" />
            <rect x="32" y="36" width="16" height="30" fill="#5D4037" rx="2" />
            <rect x="10" y="28" width="16" height="16" fill="#FFF59D" stroke="#1C1C1E" strokeWidth="1.5" rx="2" />
            <rect x="54" y="28" width="16" height="16" fill="#FFF59D" stroke="#1C1C1E" strokeWidth="1.5" rx="2" />
            <text x="40" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFF">#2</text>
          </g>

          {/* House 3: Sunshine House */}
          <g transform="translate(600, 780)">
            <rect x="0" y="18" width="80" height="48" fill="#FFFDE7" stroke="#1C1C1E" strokeWidth="2.5" rx="6" />
            <polygon points="-6,18 40,-6 86,18" fill="#FDD835" stroke="#1C1C1E" strokeWidth="2.5" />
            <rect x="32" y="36" width="16" height="30" fill="#4E342E" rx="2" />
            <rect x="10" y="28" width="16" height="16" fill="#B3E5FC" stroke="#1C1C1E" strokeWidth="1.5" rx="2" />
            <rect x="54" y="28" width="16" height="16" fill="#B3E5FC" stroke="#1C1C1E" strokeWidth="1.5" rx="2" />
            <text x="40" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1C1C1E">#3</text>
          </g>

          {/* Corner Park Trees */}
          <g transform="translate(780, 780)">
            <circle cx="25" cy="35" r="22" fill="#2E7D32" stroke="#1B5E20" strokeWidth="2" />
            <circle cx="65" cy="30" r="26" fill="#388E3C" stroke="#1B5E20" strokeWidth="2" />
            <circle cx="105" cy="38" r="20" fill="#43A047" stroke="#1B5E20" strokeWidth="2" />
            <text x="40" y="55" fontSize="18">🌲</text>
            <text x="80" y="55" fontSize="18">🌳</text>
          </g>

          {/* STREET NAME SIGNS PAINTED ON ROAD */}
          <text
            x="360"
            y="760"
            fill="#FFD60A"
            fontSize="14"
            fontWeight="900"
            fontFamily="Fredoka"
            letterSpacing="2"
          >
            🏡 MAPLE AVE (OUR HOME STREET)
          </text>
          <text
            x="365"
            y="510"
            fill="#E5E5EA"
            fontSize="13"
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
            fontSize="13"
            fontWeight="900"
            fontFamily="Fredoka"
            letterSpacing="2"
          >
            SERVICE & WASH EXPRESSWAY
          </text>
        </svg>

        {/* =======================================================
            COMPACT INTERACTIVE STATION BUILDINGS (TOP LOTS)
           ======================================================= */}

        {/* 1. BUBBLE SPLASH CAR WASH BUILDING (TOP-LEFT) */}
        <div
          onClick={() => {
            sound.playBubbleSpray();
            handleDriveToWaypoint(STREET_WAYPOINTS[3]);
          }}
          className="absolute left-[4%] top-[2%] w-[28%] max-w-[230px] bg-gradient-to-br from-[#00A8E8] to-[#007AFF] border-3 border-[#1C1C1E] rounded-2xl p-2 md:p-2.5 shadow-[0_4px_0_#1C1C1E] cursor-pointer hover:scale-105 active:scale-95 transition z-20 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-lg border-2 border-black shadow">
                🫧
              </div>
              <div>
                <div className="font-heading font-extrabold text-white text-xs md:text-sm drop-shadow leading-tight">
                  CAR WASH
                </div>
                <div className="text-[10px] font-bold text-sky-100 leading-none">
                  Inside & Out
                </div>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#FFD60A] border-2 border-black spin-cw flex items-center justify-center text-xs shadow">
              🌀
            </div>
          </div>

          <div className="mt-1.5 bg-[#FFD60A] group-hover:bg-white text-[#1C1C1E] font-heading font-extrabold text-[10px] md:text-xs py-1 px-2 rounded-xl border border-black text-center flex items-center justify-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#FF3B30]" />
            TAP TO ENTER WASH!
          </div>
        </div>

        {/* 2. GRANDPA'S FULL SERVICE GARAGE (TOP-RIGHT) */}
        <div
          onClick={() => {
            sound.playRatchetClick();
            handleDriveToWaypoint(STREET_WAYPOINTS[4]);
          }}
          className="absolute right-[4%] top-[2%] w-[28%] max-w-[230px] bg-gradient-to-br from-[#FF9500] to-[#FF3B30] border-3 border-[#1C1C1E] rounded-2xl p-2 md:p-2.5 shadow-[0_4px_0_#1C1C1E] cursor-pointer hover:scale-105 active:scale-95 transition z-20 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-lg border-2 border-black shadow">
                🔧
              </div>
              <div>
                <div className="font-heading font-extrabold text-white text-xs md:text-sm drop-shadow leading-tight">
                  SERVICE GARAGE
                </div>
                <div className="text-[10px] font-bold text-amber-100 leading-none">
                  Air • Paint • Gas
                </div>
              </div>
            </div>

            <div className="bg-[#1C1C1E] text-[#FFD60A] font-mono-num font-extrabold text-[10px] px-1.5 py-0.5 rounded-lg border border-white/30">
              32 PSI
            </div>
          </div>

          <div className="mt-1.5 bg-[#FFD60A] group-hover:bg-white text-[#1C1C1E] font-heading font-extrabold text-[10px] md:text-xs py-1 px-2 rounded-xl border border-black text-center flex items-center justify-center gap-1 shadow-sm">
            <Wrench className="w-3 h-3 text-[#FF3B30]" />
            TAP TO ENTER GARAGE!
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
              className="absolute z-30 cursor-pointer group flex flex-col items-center justify-center"
              title={`${car.name} — Click to Drive or Honk!`}
            >
              {/* Active Player Halo Indicator */}
              {isSelected && (
                <div className="absolute -inset-3 rounded-full border-3 border-[#FFD60A] animate-ping pointer-events-none" />
              )}

              <TopDownCarSvg
                paintColor={car.paintColor}
                wheelRim={car.wheelRim}
                headlightsOn={car.headlightsOn}
                carType={car.carType}
                honking={honkingCarId === car.id}
                isSparkling={car.washStampEarned}
                scale={isSelected ? 1.05 : 0.9}
              />

              {/* Driver Name Floating Label above car */}
              <div
                style={{
                  transform: `rotate(${-car.angle}deg)`
                }}
                className={`mt-0.5 text-[9px] md:text-[10px] font-heading font-extrabold px-1.5 py-0.2 rounded-full border border-black whitespace-nowrap shadow-sm pointer-events-none ${
                  isSelected
                    ? 'bg-[#FFD60A] text-[#1C1C1E]'
                    : 'bg-white/95 text-slate-800'
                }`}
              >
                {car.name}
              </div>
            </div>
          );
        })}

        {/* Quick Drive Waypoint notification banner */}
        {drivingDestinationName && (
          <div className="absolute top-[16%] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="bg-[#FFD60A] text-[#1C1C1E] font-heading font-extrabold text-xs md:text-sm px-3.5 py-1 rounded-full border-2 border-black shadow-lg animate-bounce flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#FF3B30]" />
              DRIVING TO: {drivingDestinationName}!
            </div>
          </div>
        )}

        {/* Touch D-PAD Steering Wheel overlay in bottom-right corner for kids on iPad/touchscreens */}
        <div className="absolute right-2 bottom-2 md:right-3 md:bottom-3 z-30 flex flex-col items-center gap-1 bg-[#FFFDF7]/90 backdrop-blur-sm border-2 border-[#1C1C1E] p-1.5 md:p-2 rounded-2xl shadow-md">
          <div className="text-[9px] md:text-[10px] font-heading font-extrabold text-[#1C1C1E] leading-none">
            STEER 🕹️
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
            className="toy-btn w-8 h-7 md:w-9 md:h-8 bg-[#007AFF] text-white font-extrabold rounded-lg border border-black shadow-sm text-sm md:text-base flex items-center justify-center"
          >
            ▲
          </button>
          <div className="flex gap-1">
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
              className="toy-btn w-8 h-7 md:w-9 md:h-8 bg-[#007AFF] text-white font-extrabold rounded-lg border border-black shadow-sm text-sm md:text-base flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onClick={() => {
                sound.playHonk(activeCar.hornPitch);
                setHonkingCarId(activeCar.id);
                setTimeout(() => setHonkingCarId(null), 600);
              }}
              className="toy-btn w-8 h-7 md:w-9 md:h-8 bg-[#FFD60A] text-[#1C1C1E] font-extrabold rounded-full border border-black shadow-sm text-sm md:text-base flex items-center justify-center"
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
              className="toy-btn w-8 h-7 md:w-9 md:h-8 bg-[#007AFF] text-white font-extrabold rounded-lg border border-black shadow-sm text-sm md:text-base flex items-center justify-center"
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
            className="toy-btn w-8 h-7 md:w-9 md:h-8 bg-[#007AFF] text-white font-extrabold rounded-lg border border-black shadow-sm text-sm md:text-base flex items-center justify-center"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};
