import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CarState, CarWashTab, ExteriorDirtPatch, InteriorMessItem } from '../types/gameTypes';
import { PAINT_COLORS, WHEEL_RIMS } from '../data/gameConstants';
import { sound } from '../utils/soundEffects';
import { Sparkles, Droplets, Volume2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CarWashModalProps {
  car: CarState;
  onClose: () => void;
  onUpdateCar: (updater: (prev: CarState) => CarState) => void;
}

export const CarWashModal: React.FC<CarWashModalProps> = ({
  car,
  onClose,
  onUpdateCar
}) => {
  const [activeTab, setActiveTab] = useState<CarWashTab>('EXTERIOR');
  const [exteriorTool, setExteriorTool] = useState<'FOAM' | 'BRUSH' | 'RINSE' | 'WAX'>('FOAM');
  const [interiorTool, setInteriorTool] = useState<'VACUUM' | 'WIPE' | 'TRASH'>('VACUUM');
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showStampPop, setShowStampPop] = useState(false);

  const paint = PAINT_COLORS.find((p) => p.id === car.paintColor) || PAINT_COLORS[0];
  const rim = WHEEL_RIMS.find((r) => r.id === car.wheelRim) || WHEEL_RIMS[0];

  // Calculate percentages
  const exteriorTotal = car.exteriorDirt.length || 1;
  const exteriorCleanedCount = car.exteriorDirt.filter((d) => d.cleaned).length;
  const extPercent = Math.round((exteriorCleanedCount / exteriorTotal) * 100);

  const interiorTotal = car.interiorMesses.length || 1;
  const interiorCleanedCount = car.interiorMesses.filter((m) => m.cleaned).length;
  const intPercent = Math.round((interiorCleanedCount / interiorTotal) * 100);

  const triggerCelebrationStamp = () => {
    sound.playSuccessJingle();
    setShowStampPop(true);
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.55 }
    });
  };

  const handleExteriorDirtClick = (patch: ExteriorDirtPatch) => {
    if (patch.cleaned) return;

    if (exteriorTool === 'FOAM') {
      sound.playBubbleSpray();
      onUpdateCar((prev) => ({
        ...prev,
        exteriorDirt: prev.exteriorDirt.map((d) =>
          d.id === patch.id ? { ...d, foamed: true } : d
        )
      }));
    } else if (exteriorTool === 'BRUSH' || exteriorTool === 'RINSE') {
      sound.playBubbleSpray();
      onUpdateCar((prev) => {
        const nextDirt = prev.exteriorDirt.map((d) =>
          d.id === patch.id ? { ...d, cleaned: true, foamed: false } : d
        );
        const allDone = nextDirt.every((d) => d.cleaned);
        if (allDone && !prev.washStampEarned) {
          setTimeout(triggerCelebrationStamp, 250);
        }
        return {
          ...prev,
          exteriorDirt: nextDirt,
          exteriorCleanPercent: Math.round(
            (nextDirt.filter((d) => d.cleaned).length / nextDirt.length) * 100
          ),
          washStampEarned: allDone ? true : prev.washStampEarned
        };
      });
    }
  };

  const handleApplyWax = () => {
    sound.playSuccessJingle();
    onUpdateCar((prev) => ({
      ...prev,
      waxShineApplied: true,
      exteriorDirt: prev.exteriorDirt.map((d) => ({ ...d, cleaned: true }))
    }));
  };

  // Quick Wash all button for kids who want instant sparkle
  const handleSuperAutomaticWash = () => {
    sound.playBubbleSpray();
    sound.playSuccessJingle();
    confetti({
      particleCount: 110,
      spread: 100,
      origin: { y: 0.6 }
    });
    onUpdateCar((prev) => ({
      ...prev,
      exteriorDirt: prev.exteriorDirt.map((d) => ({ ...d, cleaned: true, foamed: false })),
      interiorMesses: prev.interiorMesses.map((m) => ({ ...m, cleaned: true })),
      exteriorCleanPercent: 100,
      interiorCleanPercent: 100,
      waxShineApplied: true,
      washStampEarned: true
    }));
    setShowStampPop(true);
  };

  const handleInteriorMessClick = (mess: InteriorMessItem) => {
    if (mess.cleaned) return;

    const isMatch =
      (interiorTool === 'VACUUM' && mess.toolNeeded === 'vacuum') ||
      (interiorTool === 'WIPE' && mess.toolNeeded === 'wipe-spray') ||
      (interiorTool === 'TRASH' && mess.toolNeeded === 'trash-grab');

    if (isMatch) {
      if (interiorTool === 'VACUUM') sound.playVacuumHum();
      else sound.playBubbleSpray();

      onUpdateCar((prev) => {
        const nextMesses = prev.interiorMesses.map((m) =>
          m.id === mess.id ? { ...m, cleaned: true } : m
        );
        const allDone = nextMesses.every((m) => m.cleaned);
        if (allDone && !prev.washStampEarned) {
          setTimeout(triggerCelebrationStamp, 250);
        }
        return {
          ...prev,
          interiorMesses: nextMesses,
          interiorCleanPercent: Math.round(
            (nextMesses.filter((m) => m.cleaned).length / nextMesses.length) * 100
          ),
          washStampEarned: allDone ? true : prev.washStampEarned
        };
      });
    } else {
      // Gentle hint for 6-year-old
      sound.playHonk(1.4);
    }
  };

  const handleCanvasDragSpray = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBubbles((prev) => [...prev.slice(-14), { id: Date.now() + Math.random(), x, y }]);
    sound.playBubbleSpray();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-[#FFFDF7] border-4 border-[#1C1C1E] rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-[0_16px_0_#1C1C1E] overflow-hidden">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#00A8E8] to-[#007AFF] px-6 py-4 flex items-center justify-between border-b-4 border-[#1C1C1E] text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-3xl font-bold border-2 border-black shadow">
              🫧
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold drop-shadow">
                SPLASHY BUBBLE CAR WASH!
              </h2>
              <p className="text-sm md:text-base font-bold text-sky-100">
                Washing {car.name} ({car.homeStreet})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSuperAutomaticWash}
              className="toy-btn bg-[#FFD60A] hover:bg-[#FFCA00] text-[#1C1C1E] font-heading font-extrabold px-4 py-2 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] flex items-center gap-2 text-sm md:text-base"
            >
              <Sparkles className="w-5 h-5 text-[#FF3B30]" />
              MAGIC WASH ALL!
            </button>
            <button
              onClick={() => {
                sound.playHonk(1.2);
                onClose();
              }}
              className="toy-btn bg-[#FF3B30] hover:bg-[#D70015] text-white font-heading font-extrabold px-5 py-2 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] text-base"
            >
              DRIVE AWAY ✕
            </button>
          </div>
        </div>

        {/* Dual Tab Selector: OUTSIDE vs INSIDE THE CAR */}
        <div className="bg-[#E2F5FF] border-b-4 border-[#1C1C1E] px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => {
                sound.playBubbleSpray();
                setActiveTab('EXTERIOR');
              }}
              className={`toy-btn px-6 py-2.5 rounded-2xl font-heading font-extrabold text-lg border-2 border-black flex items-center gap-2 transition ${
                activeTab === 'EXTERIOR'
                  ? 'bg-[#007AFF] text-white shadow-[0_5px_0_#1C1C1E] scale-105'
                  : 'bg-white text-[#1C1C1E] hover:bg-sky-50'
              }`}
            >
              🚗 OUTSIDE THE CAR
              <span className="bg-[#FFD60A] text-[#1C1C1E] text-xs px-2 py-0.5 rounded-full font-mono-num">
                {extPercent}%
              </span>
            </button>
            <button
              onClick={() => {
                sound.playBubbleSpray();
                setActiveTab('INTERIOR');
              }}
              className={`toy-btn px-6 py-2.5 rounded-2xl font-heading font-extrabold text-lg border-2 border-black flex items-center gap-2 transition ${
                activeTab === 'INTERIOR'
                  ? 'bg-[#FF9500] text-white shadow-[0_5px_0_#1C1C1E] scale-105'
                  : 'bg-white text-[#1C1C1E] hover:bg-amber-50'
              }`}
            >
              🛋️ INSIDE THE CAR (CABIN)
              <span className="bg-[#FFD60A] text-[#1C1C1E] text-xs px-2 py-0.5 rounded-full font-mono-num">
                {intPercent}%
              </span>
            </button>
          </div>

          {/* Stamp Badge if earned */}
          {car.washStampEarned && (
            <div className="flex items-center gap-2 bg-[#34C759] text-white font-heading font-extrabold px-3.5 py-1 rounded-full border-2 border-black shadow">
              <ShieldCheck className="w-5 h-5" />
              SQUEAKY CLEAN STAMP EARNED!
            </div>
          )}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* TAB 1: OUTSIDE CAR WASH */}
          {activeTab === 'EXTERIOR' ? (
            <>
              {/* Tool Tray Left Column */}
              <div className="md:w-64 flex flex-col gap-3">
                <h3 className="font-heading font-extrabold text-lg text-[#1C1C1E] uppercase tracking-wide">
                  Choose Wash Tool:
                </h3>

                {[
                  {
                    id: 'FOAM',
                    name: '1. SOAPY FOAM CANNON',
                    desc: 'Spray giant fluffy suds on mud spots!',
                    emoji: '🧼',
                    color: 'bg-[#FF9500]'
                  },
                  {
                    id: 'BRUSH',
                    name: '2. TURBO SPIN BRUSH',
                    desc: 'Scrub the bubbles away with spinning brushes!',
                    emoji: '🔄',
                    color: 'bg-[#007AFF]'
                  },
                  {
                    id: 'RINSE',
                    name: '3. WATER HOSE RINSE',
                    desc: 'Blast cool water to make it sparkle!',
                    emoji: '🚿',
                    color: 'bg-[#00A8E8]'
                  },
                  {
                    id: 'WAX',
                    name: '4. SHINY SUPER WAX',
                    desc: 'Wax polish for extra bright sparkles!',
                    emoji: '✨',
                    color: 'bg-[#34C759]'
                  }
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      sound.playBubbleSpray();
                      setExteriorTool(tool.id as any);
                      if (tool.id === 'WAX') handleApplyWax();
                    }}
                    className={`toy-btn text-left p-3.5 rounded-2xl border-2 border-black flex items-center gap-3 transition ${
                      exteriorTool === tool.id
                        ? `${tool.color} text-white shadow-[0_6px_0_#1C1C1E] scale-102`
                        : 'bg-white text-[#1C1C1E] hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl bg-white/20 p-2 rounded-xl border border-black/20">
                      {tool.emoji}
                    </span>
                    <div>
                      <div className="font-heading font-extrabold text-base">
                        {tool.name}
                      </div>
                      <div className="text-xs opacity-90 font-bold">
                        {tool.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Big Side-View Car Wash Bay */}
              <div className="flex-1 bg-gradient-to-b from-[#87CEEB] via-[#BAE6FD] to-[#38BDF8] rounded-3xl border-4 border-[#1C1C1E] relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner min-h-[380px]">
                {/* Overhead Car Wash Shower Pipes & Spinning Brushes */}
                <div className="absolute top-0 inset-x-0 h-16 bg-[#1C1C1E]/10 flex items-center justify-around px-8 border-b-2 border-black/20">
                  <div className="w-16 h-16 rounded-full bg-[#00A8E8] border-2 border-black spin-cw flex items-center justify-center text-white font-bold text-xl shadow">
                    🌀
                  </div>
                  <div className="w-20 h-20 rounded-full bg-[#FFD60A] border-2 border-black spin-ccw flex items-center justify-center text-[#1C1C1E] font-bold text-2xl shadow">
                    ⭐
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#00A8E8] border-2 border-black spin-cw flex items-center justify-center text-white font-bold text-xl shadow">
                    🌀
                  </div>
                </div>

                {/* Big Interactive Side-View Cartoon Car */}
                <div
                  onMouseMove={handleCanvasDragSpray}
                  className="relative w-full max-w-2xl h-64 flex items-center justify-center cursor-pointer select-none mt-8"
                >
                  {/* Cartoon Side View Car SVG */}
                  <svg
                    viewBox="0 0 520 250"
                    className="w-full h-full drop-shadow-xl"
                  >
                    {/* Shadow */}
                    <ellipse cx="260" cy="225" rx="220" ry="16" fill="rgba(0,0,0,0.25)" />

                    {/* Car Lower Body */}
                    <path
                      d="M 40 145 C 35 110, 80 95, 140 95 L 360 95 C 440 95, 490 115, 490 155 C 490 190, 460 200, 440 200 L 70 200 C 45 200, 42 165, 40 145 Z"
                      fill={paint.bodyColor}
                      stroke="#1C1C1E"
                      strokeWidth="5"
                    />

                    {/* Cabin Upper Roof */}
                    <path
                      d="M 130 95 L 180 38 C 200 24, 290 24, 320 40 L 375 95 Z"
                      fill={paint.roofColor}
                      stroke="#1C1C1E"
                      strokeWidth="5"
                    />

                    {/* Front & Rear Windows */}
                    <path
                      d="M 185 45 L 145 92 L 255 92 L 255 42 Z"
                      fill="#7DD3FC"
                      stroke="#1C1C1E"
                      strokeWidth="4"
                    />
                    <path
                      d="M 270 42 L 270 92 L 360 92 L 315 45 Z"
                      fill="#7DD3FC"
                      stroke="#1C1C1E"
                      strokeWidth="4"
                    />

                    {/* Racing Stripe */}
                    <rect
                      x="90"
                      y="125"
                      width="350"
                      height="18"
                      rx="9"
                      fill={paint.stripeColor}
                      stroke="#1C1C1E"
                      strokeWidth="2.5"
                    />

                    {/* Grandson Number Badge on Door */}
                    <circle
                      cx="245"
                      cy="158"
                      r="22"
                      fill="#FFFFFF"
                      stroke="#1C1C1E"
                      strokeWidth="3.5"
                    />
                    <text
                      x="245"
                      y="166"
                      textAnchor="middle"
                      fontSize="24"
                      fontWeight="900"
                      fill="#1C1C1E"
                      fontFamily="Fredoka"
                    >
                      6
                    </text>

                    {/* Front Headlight Side */}
                    <path
                      d="M 465 125 L 485 130 L 485 155 L 465 150 Z"
                      fill="#FFD60A"
                      stroke="#1C1C1E"
                      strokeWidth="3"
                    />

                    {/* Front Wheel */}
                    <g transform="translate(370, 168)">
                      <circle
                        cx="0"
                        cy="0"
                        r="38"
                        fill="#1C1C1E"
                        stroke="#48484A"
                        strokeWidth="4"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="22"
                        fill={rim.rimColor}
                        stroke="#1C1C1E"
                        strokeWidth="3"
                      />
                      <circle cx="0" cy="0" r="7" fill={rim.accentColor} />
                    </g>

                    {/* Rear Wheel */}
                    <g transform="translate(130, 168)">
                      <circle
                        cx="0"
                        cy="0"
                        r="38"
                        fill="#1C1C1E"
                        stroke="#48484A"
                        strokeWidth="4"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="22"
                        fill={rim.rimColor}
                        stroke="#1C1C1E"
                        strokeWidth="3"
                      />
                      <circle cx="0" cy="0" r="7" fill={rim.accentColor} />
                    </g>
                  </svg>

                  {/* Interactive Mud & Suds Patches */}
                  {car.exteriorDirt.map((patch) => {
                    if (patch.cleaned) return null;
                    return (
                      <button
                        key={patch.id}
                        onClick={() => handleExteriorDirtClick(patch)}
                        style={{
                          left: `${patch.x}%`,
                          top: `${patch.y}%`,
                          width: `${patch.size}px`,
                          height: `${patch.size}px`
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-black/40 shadow-md ${
                          patch.foamed
                            ? 'bg-gradient-to-br from-white via-sky-100 to-pink-100 animate-bounce scale-110'
                            : patch.type === 'leaf'
                            ? 'bg-[#34C759] text-xl'
                            : 'bg-[#6B4423] text-amber-100'
                        }`}
                        title="Click or scrub with your wash tool!"
                      >
                        {patch.foamed ? (
                          <span className="text-2xl">🫧</span>
                        ) : patch.type === 'leaf' ? (
                          <span>🍂</span>
                        ) : (
                          <span className="text-xl">💩</span>
                        )}
                      </button>
                    );
                  })}

                  {/* Floating drag soap bubbles */}
                  {bubbles.map((b) => (
                    <div
                      key={b.id}
                      style={{ left: `${b.x}%`, top: `${b.y}%` }}
                      className="absolute w-8 h-8 rounded-full bg-white/80 border border-sky-300 pointer-events-none animate-ping"
                    />
                  ))}

                  {/* Wax Shimmer Stars when clean */}
                  {extPercent === 100 && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
                      <span className="text-4xl animate-bounce">✨</span>
                      <span className="text-4xl animate-pulse">🌟</span>
                      <span className="text-4xl animate-bounce">✨</span>
                    </div>
                  )}
                </div>

                {/* Kid Instruction Banner */}
                <div className="mt-4 bg-white/90 border-2 border-black px-4 py-2 rounded-2xl font-heading font-extrabold text-[#1C1C1E] flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#007AFF]" />
                  {exteriorTool === 'FOAM' &&
                    'TAP OR DRAG OVER THE MUD SPOTS TO COVER THEM IN BUBBLE FOAM! 🧼'}
                  {exteriorTool === 'BRUSH' &&
                    'SCRUB THE FOAM WITH THE TURBO BRUSH TO SCRUB AWAY ALL MUD! 🔄'}
                  {exteriorTool === 'RINSE' &&
                    'SPRAY THE HOSE TO WASH AWAY EVERY LAST BUBBLE! 🚿'}
                  {exteriorTool === 'WAX' &&
                    'CAR IS WAXED AND SHINING LIKE A JEWEL! ✨'}
                </div>
              </div>
            </>
          ) : (
            /* TAB 2: INSIDE THE CAR (CABIN & SEAT DETAILING) */
            <>
              {/* Interior Tool Selector */}
              <div className="md:w-64 flex flex-col gap-3">
                <h3 className="font-heading font-extrabold text-lg text-[#1C1C1E] uppercase tracking-wide">
                  Inside Cabin Tools:
                </h3>

                {[
                  {
                    id: 'VACUUM',
                    name: '1. TURBO VACUUM HOSE',
                    desc: 'Sucks up cracker & pretzel crumbs on seat and mat!',
                    emoji: '🧹',
                    color: 'bg-[#AF52DE]'
                  },
                  {
                    id: 'WIPE',
                    name: '2. CITRUS SPRAY & WIPE',
                    desc: 'Wipes sticky berry juice & jam fingerprints!',
                    emoji: '🧽',
                    color: 'bg-[#FF9500]'
                  },
                  {
                    id: 'TRASH',
                    name: '3. TRASH CLAW GRABBER',
                    desc: 'Picks up candy & toy car wrappers!',
                    emoji: '🗑️',
                    color: 'bg-[#34C759]'
                  }
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      sound.playBubbleSpray();
                      setInteriorTool(tool.id as any);
                    }}
                    className={`toy-btn text-left p-3.5 rounded-2xl border-2 border-black flex items-center gap-3 transition ${
                      interiorTool === tool.id
                        ? `${tool.color} text-white shadow-[0_6px_0_#1C1C1E] scale-102`
                        : 'bg-white text-[#1C1C1E] hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl bg-white/20 p-2 rounded-xl border border-black/20">
                      {tool.emoji}
                    </span>
                    <div>
                      <div className="font-heading font-extrabold text-base">
                        {tool.name}
                      </div>
                      <div className="text-xs opacity-90 font-bold">
                        {tool.desc}
                      </div>
                    </div>
                  </button>
                ))}

                {/* Working Honk Horn Inside Dashboard */}
                <button
                  onClick={() => sound.playHonk(1.15)}
                  className="toy-btn mt-auto bg-[#FFD60A] text-[#1C1C1E] font-heading font-extrabold p-3 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5 text-[#FF3B30]" />
                  HONK CAR HORN! 🎺
                </button>
              </div>

              {/* Interactive Cabin Dashboard & Front Seats View */}
              <div className="flex-1 bg-gradient-to-b from-[#2C2C2E] via-[#3A3A3C] to-[#1C1C1E] rounded-3xl border-4 border-[#1C1C1E] relative overflow-hidden flex flex-col items-center justify-between p-5 min-h-[400px]">
                {/* Windshield view of Maple Ave outside */}
                <div className="w-full h-28 bg-gradient-to-b from-[#38BDF8] to-[#87CEEB] rounded-2xl border-4 border-black relative overflow-hidden flex items-end justify-between px-6 pb-2">
                  <div className="text-xs font-heading font-extrabold bg-white/80 px-2.5 py-1 rounded-full border border-black">
                    📍 Parked at Maple Ave Car Wash
                  </div>
                  <div className="flex gap-4 text-2xl">
                    <span>🌳</span>
                    <span>🏠</span>
                    <span>🚦</span>
                  </div>
                </div>

                {/* Dashboard & Steering Wheel + Kid Cup Holders + Passenger Seat */}
                <div className="relative w-full flex-1 my-3 flex items-center justify-center">
                  {/* Dashboard panel SVG */}
                  <svg
                    viewBox="0 0 640 220"
                    className="w-full h-full drop-shadow-lg"
                  >
                    {/* Main Dash Frame */}
                    <rect
                      x="20"
                      y="10"
                      width="600"
                      height="195"
                      rx="24"
                      fill="#2C2C2E"
                      stroke="#636366"
                      strokeWidth="4"
                    />

                    {/* Speedometer Screen */}
                    <circle
                      cx="140"
                      cy="105"
                      r="55"
                      fill="#1C1C1E"
                      stroke="#007AFF"
                      strokeWidth="4"
                    />
                    <text
                      x="140"
                      y="105"
                      textAnchor="middle"
                      fill="#34C759"
                      fontSize="22"
                      fontWeight="900"
                      fontFamily="Space Mono"
                    >
                      25 MPH
                    </text>
                    <text
                      x="140"
                      y="126"
                      textAnchor="middle"
                      fill="#AEAEB2"
                      fontSize="12"
                      fontFamily="Fredoka"
                    >
                      AGE 6 TURBO
                    </text>

                    {/* Steering Wheel Left */}
                    <circle
                      cx="140"
                      cy="115"
                      r="70"
                      fill="none"
                      stroke="#FF3B30"
                      strokeWidth="14"
                    />
                    <line
                      x1="70"
                      y1="115"
                      x2="210"
                      y2="115"
                      stroke="#FF3B30"
                      strokeWidth="12"
                    />
                    <circle
                      cx="140"
                      cy="115"
                      r="22"
                      fill="#FFD60A"
                      stroke="#1C1C1E"
                      strokeWidth="3"
                    />
                    <text
                      x="140"
                      y="120"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="900"
                    >
                      🎺
                    </text>

                    {/* Center Infotainment Touchscreen */}
                    <rect
                      x="260"
                      y="40"
                      width="150"
                      height="95"
                      rx="14"
                      fill="#000000"
                      stroke="#007AFF"
                      strokeWidth="3"
                    />
                    <text
                      x="335"
                      y="75"
                      textAnchor="middle"
                      fill="#FFD60A"
                      fontSize="15"
                      fontWeight="900"
                      fontFamily="Fredoka"
                    >
                      🎵 KID RADIO 99.6
                    </text>
                    <text
                      x="335"
                      y="102"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="13"
                      fontFamily="Nunito"
                    >
                      "Wheels on the Bus Rock!"
                    </text>

                    {/* Passenger Seat Right with red racing trim */}
                    <rect
                      x="440"
                      y="45"
                      width="160"
                      height="150"
                      rx="20"
                      fill="#3A3A3C"
                      stroke="#FF3B30"
                      strokeWidth="5"
                    />
                    <text
                      x="520"
                      y="125"
                      textAnchor="middle"
                      fill="#8E8E93"
                      fontSize="16"
                      fontWeight="900"
                      fontFamily="Fredoka"
                    >
                      GRANDSON SEAT
                    </text>
                  </svg>

                  {/* Interactive Interior Mess Items */}
                  {car.interiorMesses.map((mess) => {
                    if (mess.cleaned) return null;
                    return (
                      <button
                        key={mess.id}
                        onClick={() => handleInteriorMessClick(mess)}
                        style={{
                          left: `${mess.x}%`,
                          top: `${mess.y}%`
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 bg-[#FFD60A] text-[#1C1C1E] border-2 border-black px-3 py-1.5 rounded-full font-heading font-extrabold text-xs md:text-sm shadow-lg hover:scale-110 active:scale-95 flex items-center gap-1.5 animate-bounce"
                      >
                        <span>
                          {mess.type === 'cookie-crumbs' && '🍪'}
                          {mess.type === 'juice-spill' && '🥤'}
                          {mess.type === 'fingerprint' && '🖐️'}
                          {mess.type === 'toy-wrapper' && '🍬'}
                          {mess.type === 'muddy-footprint' && '👟'}
                        </span>
                        <span>{mess.label}</span>
                      </button>
                    );
                  })}

                  {intPercent === 100 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-[#34C759] text-white border-4 border-black px-6 py-3 rounded-2xl font-heading font-extrabold text-xl shadow-2xl flex items-center gap-2 animate-bounce">
                        <CheckCircle2 className="w-7 h-7" />
                        INTERIOR CABIN IS 100% SQUEAKY CLEAN!
                      </div>
                    </div>
                  )}
                </div>

                {/* Helper prompt */}
                <div className="bg-white/95 border-2 border-black px-4 py-2 rounded-2xl font-heading font-extrabold text-sm text-[#1C1C1E]">
                  {interiorTool === 'VACUUM' &&
                    'USE TURBO VACUUM ON CRACKER & PRETZEL CRUMBS! 🍪'}
                  {interiorTool === 'WIPE' &&
                    'USE CITRUS SPRAY ON STICKY JUICE SPILLS & JAM FINGERPRINTS! 🥤'}
                  {interiorTool === 'TRASH' &&
                    'GRAB TOY CAR WRAPPERS INTO THE RECYCLING BIN! 🍬'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rubber Stamp Pop Overlay */}
        {showStampPop && (
          <div
            onClick={() => setShowStampPop(false)}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="bg-[#FFFDF7] border-4 border-[#1C1C1E] rounded-3xl p-6 text-center max-w-md animate-stamp shadow-[0_12px_0_#1C1C1E]">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#34C759] text-white flex items-center justify-center text-5xl border-4 border-black mb-3">
                🏆
              </div>
              <h3 className="font-heading text-3xl font-extrabold text-[#1C1C1E]">
                OFFICIAL CAR WASH CERTIFICATE!
              </h3>
              <p className="font-bold text-slate-700 mt-2">
                Great job! {car.name} is sparkling clean inside and outside!
              </p>
              <button
                onClick={() => setShowStampPop(false)}
                className="toy-btn mt-5 bg-[#007AFF] text-white font-heading font-extrabold px-6 py-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E]"
              >
                KEEP PLAYING! ⭐
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
