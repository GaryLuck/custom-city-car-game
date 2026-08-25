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
    <header className="z-40 w-full bg-[#FFFDF7] border-b-3 border-[#1C1C1E] px-2.5 md:px-4 py-2 shadow-[0_4px_0_#1C1C1E] flex items-center justify-between gap-2 md:gap-3 select-none shrink-0">
      {/* Brand & Grandson Welcome */}
      <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
        <div
          onClick={() => {
            sound.playHonk(1.2);
            onOpenModal('HOME_DRIVEWAY');
          }}
          className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-xl md:text-2xl font-extrabold border-2 border-black shadow cursor-pointer hover:scale-105 active:scale-95 transition shrink-0"
          title="Click to visit Maple Ave Home Street!"
        >
          🏎️
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-heading font-extrabold text-sm md:text-lg text-[#1C1C1E] leading-tight">
              GRANDPA & LEO'S CAR WORLD
            </h1>
            <span className="hidden sm:inline bg-[#34C759] text-white font-heading font-extrabold text-[10px] md:text-xs px-2 py-0.2 rounded-full border border-black">
              AGE 6 ⭐
            </span>
          </div>
          <p className="text-[11px] md:text-xs font-bold text-slate-600 truncate max-w-[180px] sm:max-w-none">
            Driving: <span className="text-[#007AFF] font-extrabold">{activeCar.name}</span>
          </p>
        </div>
      </div>

      {/* Car Selector Pill */}
      <div className="hidden xl:flex items-center gap-1 bg-[#FFF8E7] border-2 border-black rounded-xl p-1 shrink-0">
        {allCars.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.playVroom();
              onSelectCar(c.id);
            }}
            className={`toy-btn px-2.5 py-1 rounded-lg font-heading font-extrabold text-xs border border-black flex items-center gap-1 transition ${
              c.id === activeCar.id
                ? 'bg-[#FFD60A] text-[#1C1C1E] shadow-sm'
                : 'bg-white text-slate-700 hover:bg-amber-100'
            }`}
          >
            <Car className="w-3 h-3" />
            <span>{c.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Live Car Condition Mini Dashboard */}
      <div className="hidden lg:flex items-center gap-2 shrink-0">
        <div
          onClick={() => onOpenModal('SERVICE_STATION')}
          className="bg-white border-2 border-black rounded-xl px-2.5 py-1 flex items-center gap-1.5 cursor-pointer hover:bg-sky-50 transition"
          title="Click to adjust Tire Air Pressure!"
        >
          <span className="text-base">🛞</span>
          <div>
            <div className="text-[9px] font-bold text-slate-500 uppercase leading-none">TIRE AIR</div>
            <div className="font-mono-num font-extrabold text-xs text-[#007AFF] leading-tight">
              {avgPsi} / 32 PSI
            </div>
          </div>
        </div>

        <div
          onClick={() => onOpenModal('SERVICE_STATION')}
          className="bg-white border-2 border-black rounded-xl px-2.5 py-1 flex items-center gap-1.5 cursor-pointer hover:bg-amber-50 transition"
          title="Click to fill Gasoline!"
        >
          <span className="text-base">⛽</span>
          <div>
            <div className="text-[9px] font-bold text-slate-500 uppercase leading-none">GASOLINE</div>
            <div className="font-mono-num font-extrabold text-xs text-[#34C759] leading-tight">
              {activeCar.fuelPercent}% FULL
            </div>
          </div>
        </div>
      </div>

      {/* Big Toy Buttons: Car Wash, Service Garage, Home Street, Honk */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <button
          onClick={() => {
            sound.playBubbleSpray();
            onOpenModal('CAR_WASH');
          }}
          className="toy-btn bg-[#00A8E8] hover:bg-[#007AFF] text-white font-heading font-extrabold px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-xl border-2 border-black shadow-[0_3px_0_#1C1C1E] flex items-center gap-1.5 text-xs md:text-sm"
        >
          <Sparkles className="w-4 h-4 text-[#FFD60A]" />
          <span>CAR WASH</span>
        </button>

        <button
          onClick={() => {
            sound.playRatchetClick();
            onOpenModal('SERVICE_STATION');
          }}
          className="toy-btn bg-[#FF9500] hover:bg-[#FF3B30] text-white font-heading font-extrabold px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-xl border-2 border-black shadow-[0_3px_0_#1C1C1E] flex items-center gap-1.5 text-xs md:text-sm"
        >
          <Wrench className="w-4 h-4 text-white" />
          <span>GARAGE</span>
        </button>

        <button
          onClick={() => {
            sound.playHonk(1.1);
            onOpenModal('HOME_DRIVEWAY');
          }}
          className="toy-btn bg-[#34C759] hover:bg-[#28A745] text-white font-heading font-extrabold px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl border-2 border-black shadow-[0_3px_0_#1C1C1E] flex items-center gap-1 text-xs md:text-sm"
          title="See our street cars"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">STREET</span>
        </button>

        {/* Headlight Toggle */}
        <button
          onClick={() => {
            sound.playBubbleSpray();
            onToggleHeadlights();
          }}
          className={`toy-btn p-1.5 md:p-2 rounded-xl border-2 border-black shadow-[0_3px_0_#1C1C1E] transition ${
            activeCar.headlightsOn
              ? 'bg-[#FFD60A] text-[#1C1C1E]'
              : 'bg-white text-slate-500'
          }`}
          title="Toggle Headlights"
        >
          <Lightbulb className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`toy-btn p-1.5 md:p-2 rounded-xl border-2 border-black shadow-[0_3px_0_#1C1C1E] transition ${
            soundEnabled
              ? 'bg-white text-[#1C1C1E]'
              : 'bg-red-100 text-[#FF3B30]'
          }`}
          title="Toggle Sound Effects"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* How to Play Help guide modal trigger */}
        <button
          onClick={onOpenGuide}
          className="toy-btn bg-[#AF52DE] text-white p-1.5 md:p-2 rounded-xl border-2 border-black shadow-[0_3px_0_#1C1C1E]"
          title="Grandpa & Kid Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
