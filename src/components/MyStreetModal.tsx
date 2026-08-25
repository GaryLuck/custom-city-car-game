import React from 'react';
import { CarState } from '../types/gameTypes';
import { TopDownCarSvg } from './TopDownCarSvg';
import { sound } from '../utils/soundEffects';
import { Home, Lightbulb, Volume2, PlusCircle, Check } from 'lucide-react';

interface MyStreetModalProps {
  cars: CarState[];
  selectedCarId: string;
  onSelectCar: (id: string) => void;
  onToggleHeadlights: (id: string) => void;
  onHonkCar: (id: string) => void;
  onAddNewCarToStreet: () => void;
  onClose: () => void;
}

export const MyStreetModal: React.FC<MyStreetModalProps> = ({
  cars,
  selectedCarId,
  onSelectCar,
  onToggleHeadlights,
  onHonkCar,
  onAddNewCarToStreet,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-[#FFFDF7] border-4 border-[#1C1C1E] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_16px_0_#1C1C1E] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] px-6 py-4 flex items-center justify-between border-b-4 border-[#1C1C1E] text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-3xl font-bold border-2 border-black shadow">
              🏡
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold drop-shadow">
                MAPLE AVE — OUR HOME STREET!
              </h2>
              <p className="text-sm md:text-base font-bold text-emerald-100">
                Pick which car on our street you want to drive to the car wash or garage!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playHonk(1.1);
              onClose();
            }}
            className="toy-btn bg-[#FF3B30] hover:bg-[#D70015] text-white font-heading font-extrabold px-5 py-2 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E] text-base"
          >
            LET'S DRIVE! ✕
          </button>
        </div>

        {/* Cars Parked on Maple Ave Driveways */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {cars.map((car) => {
            const isSelected = car.id === selectedCarId;
            return (
              <div
                key={car.id}
                onClick={() => {
                  sound.playVroom();
                  onSelectCar(car.id);
                }}
                className={`border-4 border-[#1C1C1E] rounded-3xl p-5 flex flex-col items-center justify-between cursor-pointer transition relative ${
                  isSelected
                    ? 'bg-[#FFF8E7] ring-4 ring-[#FFD60A] shadow-[0_10px_0_#1C1C1E] scale-102'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3.5 right-4 bg-[#34C759] text-white font-heading font-extrabold text-xs px-3 py-1 rounded-full border-2 border-black shadow flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    DRIVING NOW!
                  </div>
                )}

                <div className="w-full text-center">
                  <span className="text-xs font-heading font-extrabold bg-[#E2F5FF] text-[#007AFF] px-2.5 py-0.5 rounded-full border border-black/20">
                    PARKED AT #{cars.indexOf(car) + 1} MAPLE AVE
                  </span>
                  <h3 className="font-heading font-extrabold text-lg text-[#1C1C1E] mt-2">
                    {car.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Driver: {car.driverName}
                  </p>
                </div>

                <div className="my-5">
                  <TopDownCarSvg
                    paintColor={car.paintColor}
                    wheelRim={car.wheelRim}
                    headlightsOn={car.headlightsOn}
                    carType={car.carType}
                    scale={1.3}
                  />
                </div>

                {/* Status Badges */}
                <div className="w-full grid grid-cols-2 gap-2 mb-3 text-xs font-mono-num font-bold">
                  <div className="bg-slate-100 rounded-xl px-2 py-1 border border-black/20 text-center">
                    ⛽ {car.fuelPercent}%
                  </div>
                  <div className="bg-slate-100 rounded-xl px-2 py-1 border border-black/20 text-center">
                    ✨ Wash: {car.exteriorCleanPercent}%
                  </div>
                </div>

                {/* Quick actions */}
                <div className="w-full flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      sound.playHonk(car.hornPitch);
                      onHonkCar(car.id);
                    }}
                    className="toy-btn flex-1 bg-[#FFD60A] text-[#1C1C1E] font-heading font-extrabold py-2 rounded-xl border-2 border-black flex items-center justify-center gap-1 text-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                    HONK!
                  </button>
                  <button
                    onClick={() => {
                      sound.playBubbleSpray();
                      onToggleHeadlights(car.id);
                    }}
                    className={`toy-btn flex-1 font-heading font-extrabold py-2 rounded-xl border-2 border-black flex items-center justify-center gap-1 text-xs ${
                      car.headlightsOn
                        ? 'bg-[#007AFF] text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    LIGHTS
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add a New Fun Neighbor Car card */}
          <button
            onClick={() => {
              sound.playSuccessJingle();
              onAddNewCarToStreet();
            }}
            className="toy-btn border-4 border-dashed border-[#1C1C1E] bg-[#E8FBF0] hover:bg-[#D5F7E3] rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-[#34C759] text-white flex items-center justify-center border-2 border-black shadow">
              <PlusCircle className="w-9 h-9" />
            </div>
            <div className="font-heading font-extrabold text-xl text-[#1C1C1E]">
              PARK A FIRE RESCUE SUV ON OUR STREET!
            </div>
            <p className="text-xs font-bold text-slate-600">
              Click to park Grandpa & Grandson's Fire Rescue SUV on Maple Ave!
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-[#FFF8E7] border-t-4 border-[#1C1C1E] px-6 py-3 flex items-center justify-between text-sm font-heading font-extrabold text-[#1C1C1E]">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-[#2E7D32]" />
            <span>Maple Ave Street Speed Limit: 15 MPH (Kids Playing!)</span>
          </div>
          <span>TAP ANY CAR OR ROAD ON THE MAP TO DRIVE!</span>
        </div>
      </div>
    </div>
  );
};
