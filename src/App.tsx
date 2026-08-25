import { useState, useEffect } from 'react';
import { CarState, ActiveStationModal } from './types/gameTypes';
import {
  createDefaultCars,
  INITIAL_EXTERIOR_DIRT,
  INITIAL_INTERIOR_MESSES
} from './data/gameConstants';
import { TopHudBar } from './components/TopHudBar';
import { CityMapCanvas } from './components/CityMapCanvas';
import { CarWashModal } from './components/CarWashModal';
import { ServiceStationModal } from './components/ServiceStationModal';
import { MyStreetModal } from './components/MyStreetModal';
import { GuideModal } from './components/GuideModal';
import { sound } from './utils/soundEffects';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'grandpa_grandson_car_game_state_v1';

export function App() {
  const [cars, setCars] = useState<CarState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved game state', e);
    }
    return createDefaultCars();
  });

  const [selectedCarId, setSelectedCarId] = useState<string>('grandson-hero-car');
  const [activeModal, setActiveModal] = useState<ActiveStationModal>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Persist car customizations in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }, [cars]);

  const activeCar = cars.find((c) => c.id === selectedCarId) || cars[0];

  const updateActiveCar = (updater: (prev: CarState) => CarState) => {
    setCars((prevList) =>
      prevList.map((c) => (c.id === activeCar.id ? updater(c) : c))
    );
  };

  const handleMoveCar = (
    carId: string,
    targetX: number,
    targetY: number,
    targetAngle: number
  ) => {
    setCars((prevList) =>
      prevList.map((c) =>
        c.id === carId
          ? {
              ...c,
              x: targetX,
              y: targetY,
              angle: targetAngle
            }
          : c
      )
    );
  };

  const handleToggleHeadlights = (id?: string) => {
    const targetId = id || activeCar.id;
    setCars((prevList) =>
      prevList.map((c) =>
        c.id === targetId ? { ...c, headlightsOn: !c.headlightsOn } : c
      )
    );
  };

  const handleHonkCar = (id: string) => {
    const found = cars.find((c) => c.id === id);
    sound.playHonk(found?.hornPitch || 1);
  };

  const handleAddNewCarToStreet = () => {
    if (cars.some((c) => c.id === 'fire-rescue-suv')) return;
    const newFireTruck: CarState = {
      id: 'fire-rescue-suv',
      name: 'Maple Ave Fire Chief SUV',
      driverName: 'Captain Grandson',
      carType: 'suv',
      homeStreet: "Maple Ave (Grandpa's Street!)",
      paintColor: 'racing-red',
      wheelRim: 'golden-crown',
      headlightsOn: true,
      hornPitch: 1.35,
      exteriorDirt: INITIAL_EXTERIOR_DIRT.map((d) => ({ ...d })),
      interiorMesses: INITIAL_INTERIOR_MESSES.map((m) => ({ ...m })),
      exteriorCleanPercent: 0,
      interiorCleanPercent: 0,
      waxShineApplied: false,
      tirePressurePsi: [26, 26, 26, 26],
      fuelPercent: 50,
      fuelGallons: 6.0,
      serviceStampEarned: false,
      washStampEarned: false,
      x: 320,
      y: 720,
      angle: 0,
      isGrandsonCar: true
    };
    setCars((prev) => [...prev, newFireTruck]);
    setSelectedCarId(newFireTruck.id);
  };

  // Fun reset button so 6-year-old can re-muddy and re-service cars anytime!
  const handleResetAdventure = () => {
    sound.playBubbleSpray();
    const fresh = createDefaultCars();
    setCars(fresh);
    setSelectedCarId(fresh[0].id);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#2E7D32]">
      {/* Top Floating Toy HUD Bar */}
      <TopHudBar
        activeCar={activeCar}
        allCars={cars}
        onSelectCar={(id) => setSelectedCarId(id)}
        onOpenModal={(modal) => setActiveModal(modal)}
        onToggleHeadlights={() => handleToggleHeadlights()}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          sound.enabled = next;
        }}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* Main Interactive City Play-Mat Map Canvas */}
      <main className="flex-1 relative overflow-hidden">
        <CityMapCanvas
          cars={cars}
          selectedCarId={selectedCarId}
          onSelectCar={(id) => setSelectedCarId(id)}
          onOpenStation={(station) => setActiveModal(station)}
          onMoveCar={handleMoveCar}
        />

        {/* Floating Reset Mud & Air Button bottom-left so kids can wash again & again */}
        <button
          onClick={handleResetAdventure}
          className="absolute left-3 bottom-3 z-30 toy-btn bg-[#FFFDF7] hover:bg-amber-100 text-[#1C1C1E] font-heading font-extrabold text-[11px] md:text-xs px-2.5 md:px-3 py-1.5 rounded-xl border-2 border-black shadow-[0_3px_0_#1C1C1E] flex items-center gap-1.5"
          title="Add fresh mud and reset tires/gas so you can wash again!"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#007AFF]" />
          <span>NEW ADVENTURE (MUD!)</span>
        </button>
      </main>

      {/* MODAL 1: CAR WASH (INSIDE CABIN + OUTSIDE BODY) */}
      {activeModal === 'CAR_WASH' && (
        <CarWashModal
          car={activeCar}
          onClose={() => setActiveModal(null)}
          onUpdateCar={updateActiveCar}
        />
      )}

      {/* MODAL 2: SERVICE STATION (TIRE AIR PRESSURE, PAINT, GASOLINE, WHEELS) */}
      {activeModal === 'SERVICE_STATION' && (
        <ServiceStationModal
          car={activeCar}
          onClose={() => setActiveModal(null)}
          onUpdateCar={updateActiveCar}
        />
      )}

      {/* MODAL 3: OUR HOME STREET (MAPLE AVE PARKED CARS) */}
      {activeModal === 'HOME_DRIVEWAY' && (
        <MyStreetModal
          cars={cars}
          selectedCarId={selectedCarId}
          onSelectCar={(id) => {
            setSelectedCarId(id);
            setActiveModal(null);
          }}
          onToggleHeadlights={(id) => handleToggleHeadlights(id)}
          onHonkCar={(id) => handleHonkCar(id)}
          onAddNewCarToStreet={handleAddNewCarToStreet}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* MODAL 4: STORYBOOK GUIDE */}
      {showGuideModal && (
        <GuideModal onClose={() => setShowGuideModal(false)} />
      )}
    </div>
  );
}

export default App;
