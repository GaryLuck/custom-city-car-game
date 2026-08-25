import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CarState, ServiceStationTab, PaintColorId, WheelRimId } from '../types/gameTypes';
import { PAINT_COLORS, WHEEL_RIMS } from '../data/gameConstants';
import { TopDownCarSvg } from './TopDownCarSvg';
import { sound } from '../utils/soundEffects';
import {
  Gauge,
  Palette,
  Fuel,
  Disc,
  ShieldCheck
} from 'lucide-react';

interface ServiceStationModalProps {
  car: CarState;
  onClose: () => void;
  onUpdateCar: (updater: (prev: CarState) => CarState) => void;
}

export const ServiceStationModal: React.FC<ServiceStationModalProps> = ({
  car,
  onClose,
  onUpdateCar
}) => {
  const [activeTab, setActiveTab] = useState<ServiceStationTab>('TIRE_PRESSURE');
  const [stampEarnedModal, setStampEarnedModal] = useState(false);

  const checkAndAwardServiceStamp = () => {
    sound.playSuccessJingle();
    confetti({
      particleCount: 95,
      spread: 90,
      origin: { y: 0.55 }
    });
    onUpdateCar((prev) => ({
      ...prev,
      serviceStampEarned: true
    }));
    setStampEarnedModal(true);
  };

  // 1. TIRE AIR PRESSURE PUMP HANDLER
  const handlePumpTire = (tireIndex: number) => {
    sound.playTirePump();
    onUpdateCar((prev) => {
      const nextPsi = [...prev.tirePressurePsi] as [number, number, number, number];
      if (nextPsi[tireIndex] < 32) {
        nextPsi[tireIndex] = Math.min(32, nextPsi[tireIndex] + 2);
      }
      return {
        ...prev,
        tirePressurePsi: nextPsi
      };
    });
  };

  const handlePumpAllTires = () => {
    sound.playTirePump();
    sound.playSuccessJingle();
    onUpdateCar((prev) => ({
      ...prev,
      tirePressurePsi: [32, 32, 32, 32]
    }));
  };

  const allTiresFull = car.tirePressurePsi.every((psi) => psi === 32);

  // 2. PAINT SHOP HANDLER
  const handleSelectPaint = (paintId: PaintColorId) => {
    sound.playPaintSpray();
    onUpdateCar((prev) => ({
      ...prev,
      paintColor: paintId
    }));
  };

  // 3. GASOLINE PUMP HANDLER
  const handlePumpGas = () => {
    sound.playGasGlug();
    onUpdateCar((prev) => {
      const nextPercent = Math.min(100, prev.fuelPercent + 12);
      const nextGallons = Number(((nextPercent / 100) * 12.0).toFixed(1));
      return {
        ...prev,
        fuelPercent: nextPercent,
        fuelGallons: nextGallons
      };
    });
  };

  const handleFillFullTank = () => {
    sound.playGasGlug();
    sound.playSuccessJingle();
    onUpdateCar((prev) => ({
      ...prev,
      fuelPercent: 100,
      fuelGallons: 12.0
    }));
  };

  // 4. WHEEL UPGRADE HANDLER
  const handleSelectWheelRim = (rimId: WheelRimId) => {
    sound.playRatchetClick();
    onUpdateCar((prev) => ({
      ...prev,
      wheelRim: rimId
    }));
  };

  const tireLabels = [
    'FRONT-LEFT TIRE',
    'FRONT-RIGHT TIRE',
    'REAR-LEFT TIRE',
    'REAR-RIGHT TIRE'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-[#FFFDF7] border-4 border-[#1C1C1E] rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-[0_16px_0_#1C1C1E] overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#FF9500] to-[#FF3B30] px-6 py-4 flex items-center justify-between border-b-4 border-[#1C1C1E] text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-3xl font-bold border-2 border-black shadow">
              🔧
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold drop-shadow">
                GRANDPA'S FULL SERVICE GARAGE
              </h2>
              <p className="text-sm md:text-base font-bold text-amber-100">
                Tire Air • Custom Paint • Gasoline • Super Wheels for {car.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={checkAndAwardServiceStamp}
              className="toy-btn bg-[#34C759] hover:bg-[#28A745] text-white font-heading font-extrabold px-4 py-2 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] flex items-center gap-1.5 text-sm md:text-base"
            >
              <ShieldCheck className="w-5 h-5" />
              EARN MECHANIC BADGE!
            </button>
            <button
              onClick={() => {
                sound.playVroom();
                onClose();
              }}
              className="toy-btn bg-[#1C1C1E] hover:bg-slate-800 text-white font-heading font-extrabold px-5 py-2 rounded-2xl border-2 border-white/40 shadow-[0_4px_0_#1C1C1E]"
            >
              DRIVE AWAY ✕
            </button>
          </div>
        </div>

        {/* 4 Service Station Tabs */}
        <div className="bg-[#FFF8E7] border-b-4 border-[#1C1C1E] px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {[
            {
              id: 'TIRE_PRESSURE',
              label: '1. TIRE AIR PRESSURE',
              icon: <Gauge className="w-5 h-5" />,
              badge: allTiresFull ? '32 PSI FULL!' : 'NEEDS AIR',
              badgeColor: allTiresFull ? 'bg-[#34C759]' : 'bg-[#FF3B30]'
            },
            {
              id: 'PAINT_SHOP',
              label: '2. PAINT SHOP',
              icon: <Palette className="w-5 h-5" />,
              badge: 'CUSTOM COLORS',
              badgeColor: 'bg-[#007AFF]'
            },
            {
              id: 'GASOLINE_PUMP',
              label: '3. GASOLINE PUMP',
              icon: <Fuel className="w-5 h-5" />,
              badge: `${car.fuelPercent}% FULL`,
              badgeColor: car.fuelPercent === 100 ? 'bg-[#34C759]' : 'bg-[#FF9500]'
            },
            {
              id: 'WHEEL_UPGRADES',
              label: '4. WHEEL UPGRADES',
              icon: <Disc className="w-5 h-5" />,
              badge: '5 RIMS',
              badgeColor: 'bg-[#AF52DE]'
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playBubbleSpray();
                setActiveTab(tab.id as ServiceStationTab);
              }}
              className={`toy-btn px-4 py-2.5 rounded-2xl font-heading font-extrabold text-sm md:text-base border-2 border-black flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? 'bg-[#1C1C1E] text-white shadow-[0_5px_0_#FF9500] scale-105'
                  : 'bg-white text-[#1C1C1E] hover:bg-amber-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`${tab.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-mono-num font-bold`}
              >
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Preview Stage: Car on Hydraulic Lift */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#E2F5FF] to-[#FFF8E7] rounded-3xl border-4 border-[#1C1C1E] p-6 flex flex-col items-center justify-center relative shadow-inner">
            {/* Hydraulic Lift Bar under car */}
            <div className="w-full flex items-center justify-between text-xs font-heading font-extrabold text-slate-500 mb-2">
              <span>HYDRAULIC LIFT BAY #1</span>
              <span>CAR AGE: 6 YRS TURBO</span>
            </div>

            <div className="my-6">
              <TopDownCarSvg
                paintColor={car.paintColor}
                wheelRim={car.wheelRim}
                headlightsOn={car.headlightsOn}
                carType={car.carType}
                scale={1.55}
                isSparkling={car.serviceStampEarned}
              />
            </div>

            {/* Live Hydraulic Lift Ramp */}
            <div className="w-56 h-4 bg-[#FFD60A] border-2 border-black rounded-full shadow-md flex items-center justify-around">
              <span className="w-3 h-3 rounded-full bg-black" />
              <span className="w-3 h-3 rounded-full bg-black" />
              <span className="w-3 h-3 rounded-full bg-black" />
            </div>

            {/* Quick Car Stats Pill */}
            <div className="mt-5 grid grid-cols-2 gap-2 w-full">
              <div className="bg-white border-2 border-black rounded-2xl p-2.5 text-center">
                <div className="text-xs font-bold text-slate-500">TIRE PRESSURE</div>
                <div className="font-mono-num font-extrabold text-lg text-[#007AFF]">
                  {Math.round(
                    car.tirePressurePsi.reduce((a, b) => a + b, 0) / 4
                  )}{' '}
                  PSI
                </div>
              </div>
              <div className="bg-white border-2 border-black rounded-2xl p-2.5 text-center">
                <div className="text-xs font-bold text-slate-500">GAS TANK</div>
                <div className="font-mono-num font-extrabold text-lg text-[#34C759]">
                  {car.fuelPercent}% ({car.fuelGallons} GAL)
                </div>
              </div>
            </div>
          </div>

          {/* Right Active Bay Panel */}
          <div className="md:col-span-7 flex flex-col">
            {/* BAY 1: TIRE AIR PRESSURE */}
            {activeTab === 'TIRE_PRESSURE' && (
              <div className="bg-white border-4 border-[#1C1C1E] rounded-3xl p-5 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-extrabold text-[#1C1C1E]">
                      AIR COMPRESSOR STATION 🛞
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      Target Air Pressure is <span className="text-[#34C759] font-extrabold">32 PSI</span> (Green Zone)!
                    </p>
                  </div>
                  <button
                    onClick={handlePumpAllTires}
                    className="toy-btn bg-[#FFD60A] hover:bg-[#FFCA00] text-[#1C1C1E] font-heading font-extrabold px-4 py-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E]"
                  >
                    ⚡ PUMP ALL 4 TIRES TO 32 PSI!
                  </button>
                </div>

                {/* 4 Tires Interactive Pressure Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {car.tirePressurePsi.map((psi, idx) => {
                    const isFull = psi >= 32;
                    return (
                      <div
                        key={idx}
                        className={`border-3 border-black rounded-2xl p-4 flex flex-col justify-between transition ${
                          isFull
                            ? 'bg-[#E8FBF0] border-[#34C759]'
                            : 'bg-[#FFF8E7]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-extrabold text-sm text-[#1C1C1E]">
                            {tireLabels[idx]}
                          </span>
                          <span
                            className={`font-mono-num font-bold text-xs px-2.5 py-0.5 rounded-full border border-black ${
                              isFull
                                ? 'bg-[#34C759] text-white'
                                : 'bg-[#FF3B30] text-white'
                            }`}
                          >
                            {isFull ? 'OPTIMAL ✔' : 'LOW AIR!'}
                          </span>
                        </div>

                        {/* Digital PSI Dial Bar */}
                        <div className="my-3">
                          <div className="flex justify-between text-xs font-mono-num font-bold mb-1">
                            <span>CURRENT: {psi} PSI</span>
                            <span>GOAL: 32 PSI</span>
                          </div>
                          <div className="w-full h-5 bg-slate-200 rounded-full border-2 border-black overflow-hidden">
                            <div
                              style={{ width: `${Math.min(100, (psi / 32) * 100)}%` }}
                              className={`h-full transition-all duration-300 ${
                                isFull ? 'bg-[#34C759]' : 'bg-[#FF9500]'
                              }`}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handlePumpTire(idx)}
                          disabled={isFull}
                          className={`toy-btn w-full font-heading font-extrabold py-2.5 rounded-xl border-2 border-black flex items-center justify-center gap-2 ${
                            isFull
                              ? 'bg-slate-200 text-slate-500 cursor-default'
                              : 'bg-[#007AFF] hover:bg-[#0051D5] text-white shadow-[0_4px_0_#1C1C1E]'
                          }`}
                        >
                          <span>💨</span>
                          {isFull ? '32 PSI PERFECT!' : 'TAP TO PUMP +2 PSI!'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BAY 2: PAINT SHOP */}
            {activeTab === 'PAINT_SHOP' && (
              <div className="bg-white border-4 border-[#1C1C1E] rounded-3xl p-5 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold text-[#1C1C1E]">
                    SPRAY PAINT COLOR BOOTH 🎨
                  </h3>
                  <p className="text-sm font-bold text-slate-600">
                    Pick your favorite racing color! Watch the car change right away!
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-2">
                  {PAINT_COLORS.map((paint) => {
                    const isSelected = car.paintColor === paint.id;
                    return (
                      <button
                        key={paint.id}
                        onClick={() => handleSelectPaint(paint.id)}
                        className={`toy-btn p-4 rounded-2xl border-3 border-black text-left flex flex-col items-center justify-between transition ${
                          isSelected
                            ? 'ring-4 ring-[#007AFF] shadow-[0_8px_0_#1C1C1E] scale-103 bg-[#FFFDF7]'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className="w-16 h-12 rounded-xl border-2 border-black mb-2 flex items-center justify-center text-2xl shadow"
                          style={{ backgroundColor: paint.bodyColor }}
                        >
                          {paint.badge}
                        </div>
                        <div className="font-heading font-extrabold text-sm text-center text-[#1C1C1E]">
                          {paint.name}
                        </div>
                        {isSelected && (
                          <span className="mt-1 bg-[#34C759] text-white text-xs font-heading font-extrabold px-2 py-0.5 rounded-full border border-black">
                            SELECTED ✔
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BAY 3: GASOLINE PUMP */}
            {activeTab === 'GASOLINE_PUMP' && (
              <div className="bg-white border-4 border-[#1C1C1E] rounded-3xl p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold text-[#1C1C1E]">
                    GASOLINE FUEL PUMP ISLAND ⛽
                  </h3>
                  <p className="text-sm font-bold text-slate-600">
                    Fill the tank with Super Kids High-Octane Fuel so the car can drive around town!
                  </p>
                </div>

                {/* Big Visual Fuel Pump Tank Gauge */}
                <div className="my-4 bg-[#FFF8E7] border-3 border-black rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-6">
                  {/* Glass Liquid Cylinder */}
                  <div className="w-28 h-44 bg-white border-4 border-black rounded-2xl relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
                    {/* Tick marks */}
                    <div className="absolute inset-y-0 right-2 flex flex-col justify-between py-2 text-[10px] font-mono-num font-bold text-slate-500 z-20">
                      <span>F</span>
                      <span>¾</span>
                      <span>½</span>
                      <span>¼</span>
                      <span>E</span>
                    </div>

                    {/* Rising Golden Gasoline Liquid */}
                    <div
                      style={{ height: `${car.fuelPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#FF9500] via-[#FFD60A] to-[#FFF176] rounded-xl transition-all duration-300 relative"
                    >
                      <div className="w-full h-3 bg-white/40 animate-pulse rounded-t-xl" />
                    </div>
                  </div>

                  {/* Pump Readout Screen */}
                  <div className="flex-1">
                    <div className="bg-[#1C1C1E] text-[#34C759] border-4 border-[#48484A] rounded-2xl p-4 font-mono-num">
                      <div className="text-xs text-slate-400">GALLONS PUMPED</div>
                      <div className="text-4xl font-extrabold tracking-wider">
                        {car.fuelGallons.toFixed(1)} GAL
                      </div>
                      <div className="text-xs text-slate-400 mt-2">FUEL TANK LEVEL</div>
                      <div className="text-2xl font-extrabold text-[#FFD60A]">
                        {car.fuelPercent}% FULL
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={handlePumpGas}
                        disabled={car.fuelPercent >= 100}
                        className="toy-btn flex-1 bg-[#FF9500] hover:bg-[#E08200] disabled:bg-slate-300 text-white font-heading font-extrabold py-3.5 px-4 rounded-2xl border-2 border-black shadow-[0_5px_0_#1C1C1E] text-base flex items-center justify-center gap-2"
                      >
                        <span>⛽</span>
                        PUMP GAS (+12%)
                      </button>
                      <button
                        onClick={handleFillFullTank}
                        disabled={car.fuelPercent >= 100}
                        className="toy-btn bg-[#34C759] hover:bg-[#28A745] disabled:bg-slate-300 text-white font-heading font-extrabold py-3.5 px-4 rounded-2xl border-2 border-black shadow-[0_5px_0_#1C1C1E] text-base"
                      >
                        FILL FULL 100%!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BAY 4: WHEEL UPGRADES */}
            {activeTab === 'WHEEL_UPGRADES' && (
              <div className="bg-white border-4 border-[#1C1C1E] rounded-3xl p-5 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold text-[#1C1C1E]">
                    CUSTOM WHEEL RIMS & TIRES 🛞
                  </h3>
                  <p className="text-sm font-bold text-slate-600">
                    Equip lightning rims, monster truck mud tires, or rainbow spinners!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                  {WHEEL_RIMS.map((rim) => {
                    const isSelected = car.wheelRim === rim.id;
                    return (
                      <button
                        key={rim.id}
                        onClick={() => handleSelectWheelRim(rim.id)}
                        className={`toy-btn p-4 rounded-2xl border-3 border-black text-left flex items-center gap-4 transition ${
                          isSelected
                            ? 'bg-[#FFF8E7] ring-4 ring-[#FF9500] shadow-[0_6px_0_#1C1C1E]'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        {/* Wheel Rim Preview Circle */}
                        <div className="w-14 h-14 rounded-full bg-[#1C1C1E] border-4 border-black flex items-center justify-center shrink-0">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold"
                            style={{ backgroundColor: rim.rimColor }}
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: rim.accentColor }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="font-heading font-extrabold text-base text-[#1C1C1E]">
                            {rim.name}
                          </div>
                          <div className="text-xs font-bold text-slate-600">
                            {rim.description}
                          </div>
                          <div className="mt-1 inline-block bg-[#FFD60A] text-[#1C1C1E] text-[11px] font-heading font-extrabold px-2 py-0.5 rounded-full border border-black">
                            {rim.speedBoostText}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Modal */}
        {stampEarnedModal && (
          <div
            onClick={() => setStampEarnedModal(false)}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="bg-[#FFFDF7] border-4 border-[#1C1C1E] rounded-3xl p-6 text-center max-w-md animate-stamp shadow-[0_12px_0_#1C1C1E]">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-5xl border-4 border-black mb-3">
                🏆
              </div>
              <h3 className="font-heading text-3xl font-extrabold text-[#1C1C1E]">
                MASTER MECHANIC BADGE!
              </h3>
              <p className="font-bold text-slate-700 mt-2">
                Tire air pressure, custom paint, full gas tank, and turbo rims look awesome!
              </p>
              <button
                onClick={() => setStampEarnedModal(false)}
                className="toy-btn mt-5 bg-[#34C759] text-white font-heading font-extrabold px-6 py-2.5 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E]"
              >
                RETURN TO TOWN MAP! 🚗
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
