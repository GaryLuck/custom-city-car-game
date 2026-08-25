import React from 'react';
import { CarState, ActiveStationModal } from '../types/gameTypes';
import { sound } from '../utils/soundEffects';
import {
  Volume2,
  VolumeX,
  Lightbulb,
  Sparkles,
  Wrench,
  Home,
  HelpCircle,
  Car
} from 'lucide-react';

interface TopHudBarProps {
  activeCar: CarState;
  allCars: CarState[];
  onSelectCar: (id: string) => void;
  onOpenModal: (modal: ActiveStationModal) => void;
  onToggleHeadlights: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGuide: () => void;
}

export const TopHudBar: React.FC<TopHudBarProps> = ({
  activeCar,
  allCars,
  onSelectCar,
  onOpenModal,
  onToggleHeadlights,
  soundEnabled,
  onToggleSound,
  onOpenGuide
}) => {
  const avgPsi = Math.round(
    activeCar.tirePressurePsi.reduce((a, b) => a + b, 0) / 4
  );

  return (
    <header className="z-40 w-full bg-[#FFFDF7] border-b-4 border-[#1C1C1E] px-3 md:px-6 py-2.5 shadow-[0_6px_0_#1C1C1E] flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & Grandson Welcome */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => {
            sound.playHonk(1.2);
            onOpenModal('HOME_DRIVEWAY');
          }}
          className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-3xl font-extrabold border-3 border-black shadow cursor-pointer hover:scale-110 transition"
          title="Click to visit Maple Ave Home Street!"
        >
          🏎️
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-lg md:text-2xl text-[#1C1C1E] leading-none">
              GRANDPA & LEO'S CAR WORLD
            </h1>
            <span className="bg-[#34C759] text-white font-heading font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-black">
              AGE 6 EDITION ⭐
            </span>
          </div>
          <p className="text-xs md:text-sm font-bold text-slate-600">
            Driving: <span className="text-[#007AFF] font-extrabold">{activeCar.name}</span> on Maple Ave
          </p>
        </div>
      </div>

      {/* Car Selector Pill */}
      <div className="hidden lg:flex items-center gap-1.5 bg-[#FFF8E7] border-2 border-black rounded-2xl p-1">
        {allCars.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.playVroom();
              onSelectCar(c.id);
            }}
            className={`toy-btn px-3 py-1.5 rounded-xl font-heading font-extrabold text-xs border border-black flex items-center gap-1.5 transition ${
              c.id === activeCar.id
                ? 'bg-[#FFD60A] text-[#1C1C1E] shadow'
                : 'bg-white text-slate-700 hover:bg-amber-100'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{c.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Live Car Condition Mini Dashboard */}
      <div className="hidden sm:flex items-center gap-2">
        <div
          onClick={() => onOpenModal('SERVICE_STATION')}
          className="bg-white border-2 border-black rounded-2xl px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-sky-50 transition"
          title="Click to adjust Tire Air Pressure!"
        >
          <span className="text-lg">🛞</span>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">TIRE AIR</div>
            <div className="font-mono-num font-extrabold text-xs text-[#007AFF]">
              {avgPsi} / 32 PSI
            </div>
          </div>
        </div>

        <div
          onClick={() => onOpenModal('SERVICE_STATION')}
          className="bg-white border-2 border-black rounded-2xl px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition"
          title="Click to fill Gasoline!"
        >
          <span className="text-lg">⛽</span>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">GASOLINE</div>
            <div className="font-mono-num font-extrabold text-xs text-[#34C759]">
              {activeCar.fuelPercent}% FULL
            </div>
          </div>
        </div>
      </div>

      {/* Big Toy Buttons: Car Wash, Service Garage, Home Street, Honk */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => {
            sound.playBubbleSpray();
            onOpenModal('CAR_WASH');
          }}
          className="toy-btn bg-[#00A8E8] hover:bg-[#007AFF] text-white font-heading font-extrabold px-3.5 md:px-5 py-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] flex items-center gap-2 text-xs md:text-base"
        >
          <Sparkles className="w-5 h-5 text-[#FFD60A]" />
          <span>CAR WASH</span>
          <span className="hidden md:inline text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
            IN & OUT
          </span>
        </button>

        <button
          onClick={() => {
            sound.playRatchetClick();
            onOpenModal('SERVICE_STATION');
          }}
          className="toy-btn bg-[#FF9500] hover:bg-[#FF3B30] text-white font-heading font-extrabold px-3.5 md:px-5 py-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] flex items-center gap-2 text-xs md:text-base"
        >
          <Wrench className="w-5 h-5 text-white" />
          <span>GARAGE</span>
          <span className="hidden md:inline text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
            TIRES • PAINT • GAS
          </span>
        </button>

        <button
          onClick={() => {
            sound.playHonk(1.1);
            onOpenModal('HOME_DRIVEWAY');
          }}
          className="toy-btn bg-[#34C759] hover:bg-[#28A745] text-white font-heading font-extrabold px-3 py-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] flex items-center gap-1.5 text-xs md:text-sm"
          title="See our street cars"
        >
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">OUR STREET</span>
        </button>

        {/* Headlight Toggle */}
        <button
          onClick={() => {
            sound.playBubbleSpray();
            onToggleHeadlights();
          }}
          className={`toy-btn p-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] transition ${
            activeCar.headlightsOn
              ? 'bg-[#FFD60A] text-[#1C1C1E]'
              : 'bg-white text-slate-500'
          }`}
          title="Toggle Headlights"
        >
          <Lightbulb className="w-5 h-5" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`toy-btn p-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] transition ${
            soundEnabled
              ? 'bg-white text-[#1C1C1E]'
              : 'bg-red-100 text-[#FF3B30]'
          }`}
          title="Toggle Sound Effects"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* How to Play Help guide modal trigger */}
        <button
          onClick={onOpenGuide}
          className="toy-btn bg-[#AF52DE] text-white p-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E]"
          title="Grandpa & Kid Guide"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
