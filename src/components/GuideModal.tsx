import React from 'react';
import { sound } from '../utils/soundEffects';
import { Sparkles, Wrench, Home, Heart } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FFFDF7] border-4 border-[#1C1C1E] rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[0_16px_0_#1C1C1E] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#AF52DE] to-[#007AFF] px-6 py-4 flex items-center justify-between border-b-4 border-[#1C1C1E] text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#1C1C1E] flex items-center justify-center text-3xl border-2 border-black shadow">
              📖
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold drop-shadow">
                GRANDPA & GRANDSON'S GAME GUIDE!
              </h2>
              <p className="text-sm font-bold text-purple-100">
                Designed specially for 6-year-old car lovers!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playHonk(1.15);
              onClose();
            }}
            className="toy-btn bg-[#FF3B30] text-white font-heading font-extrabold px-5 py-2 rounded-2xl border-2 border-black shadow-[0_4px_0_#1C1C1E]"
          >
            PLAY NOW ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
          <div className="bg-[#E2F5FF] border-3 border-black rounded-3xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#007AFF] text-white flex items-center justify-center text-3xl border-2 border-black shrink-0 shadow">
              🫧
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#1C1C1E] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#007AFF]" />
                1. DUAL CAR WASH (INSIDE & OUTSIDE THE CAR!)
              </h3>
              <p className="text-sm font-bold text-slate-700 mt-1">
                • <b>Outside Tab:</b> Spray Soapy Foam Cannon over mud splatters, scrub with the Turbo Spin Brushes, rinse with the water hose, and apply shiny Wax! <br />
                • <b>Inside Cabin Tab:</b> Sit inside the driver seat! Vacuum cracker crumbs from seats, wipe sticky berry juice from cup holders, and honk the steering wheel horn!
              </p>
            </div>
          </div>

          <div className="bg-[#FFF8E7] border-3 border-black rounded-3xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF9500] text-white flex items-center justify-center text-3xl border-2 border-black shrink-0 shadow">
              🔧
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#1C1C1E] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#FF9500]" />
                2. FULL SERVICE GARAGE (4 REALISTIC SERVICE BAYS!)
              </h3>
              <p className="text-sm font-bold text-slate-700 mt-1">
                • <b>Tire Air Pressure (🛞):</b> Pump air into all 4 tires until the digital gauge reaches the green 32 PSI zone! <br />
                • <b>Spray Paint Shop (🎨):</b> Paint the car Super Fire Red, Turbo Ocean Blue, Lime Rocket Green, Sunshine Yellow, or Sunset Monster! <br />
                • <b>Gasoline Fuel Pump (⛽):</b> Watch the rising golden fuel in the glass tank and fill up to 100%! <br />
                • <b>Custom Wheel Rims (⚡):</b> Equip Gold Lightning, Monster Truck Off-Road, or Rainbow Spinner wheels!
              </p>
            </div>
          </div>

          <div className="bg-[#E8FBF0] border-3 border-black rounded-3xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#34C759] text-white flex items-center justify-center text-3xl border-2 border-black shrink-0 shadow">
              🏡
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#1C1C1E] flex items-center gap-2">
                <Home className="w-5 h-5 text-[#2E7D32]" />
                3. MAPLE AVE (CARS PARKED ON OUR STREET!)
              </h3>
              <p className="text-sm font-bold text-slate-700 mt-1">
                • Click <b>Maple Ave (Our Street)</b> at the bottom of the map or in the top bar to visit your street! Switch drivers or park a Fire Rescue SUV on Maple Ave anytime.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-4 text-center font-heading font-extrabold text-[#1C1C1E] flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-[#FF3B30] fill-current" />
            USE ARROW KEYS, TOUCH D-PAD, OR TAP ANY SERVICE STATION BUILDING TO DRIVE!
          </div>
        </div>
      </div>
    </div>
  );
};
