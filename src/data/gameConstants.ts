import { PaintColorOption, WheelRimOption, ExteriorDirtPatch, InteriorMessItem, CarState } from '../types/gameTypes';

export const PAINT_COLORS: PaintColorOption[] = [
  {
    id: 'racing-red',
    name: 'Super Fire Red',
    bodyColor: '#FF3B30',
    roofColor: '#D70015',
    stripeColor: '#FFD60A',
    badge: '🏎️'
  },
  {
    id: 'ocean-blue',
    name: 'Turbo Ocean Blue',
    bodyColor: '#007AFF',
    roofColor: '#0051D5',
    stripeColor: '#FFFFFF',
    badge: '🌊'
  },
  {
    id: 'sunshine-yellow',
    name: 'Sunshine Yellow',
    bodyColor: '#FFCC00',
    roofColor: '#E09F00',
    stripeColor: '#1C1C1E',
    badge: '☀️'
  },
  {
    id: 'lime-rocket',
    name: 'Lime Rocket Green',
    bodyColor: '#34C759',
    roofColor: '#248A3D',
    stripeColor: '#FFFFFF',
    badge: '🚀'
  },
  {
    id: 'purple-turbo',
    name: 'Grape Lightning',
    bodyColor: '#AF52DE',
    roofColor: '#7826B6',
    stripeColor: '#FFD60A',
    badge: '⚡'
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Monster',
    bodyColor: '#FF9500',
    roofColor: '#C93400',
    stripeColor: '#1C1C1E',
    badge: '🐯'
  }
];

export const WHEEL_RIMS: WheelRimOption[] = [
  {
    id: 'classic-star',
    name: 'Silver 5-Star',
    rimColor: '#E5E5EA',
    accentColor: '#3A3A3C',
    tireWidth: 26,
    description: 'Shiny classic silver stars for everyday adventures!',
    speedBoostText: '+5 Cruising Speed'
  },
  {
    id: 'lightning-bolt',
    name: 'Gold Lightning',
    rimColor: '#FFD60A',
    accentColor: '#FF9500',
    tireWidth: 28,
    description: 'Electric golden rims that look like lightning bolts!',
    speedBoostText: '+15 Turbo Dash'
  },
  {
    id: 'rainbow-spinner',
    name: 'Rainbow Spinner',
    rimColor: '#34C759',
    accentColor: '#007AFF',
    tireWidth: 26,
    description: 'Spins rainbow colors whenever your wheels roll!',
    speedBoostText: '+10 Super Fun'
  },
  {
    id: 'monster-tread',
    name: 'Monster Truck Off-Road',
    rimColor: '#FF3B30',
    accentColor: '#1C1C1E',
    tireWidth: 36,
    description: 'Giant chunky tires for mud puddles and bumpy roads!',
    speedBoostText: '+20 Mud Grip'
  },
  {
    id: 'golden-crown',
    name: 'Grand Champion Crown',
    rimColor: '#FFD60A',
    accentColor: '#007AFF',
    tireWidth: 30,
    description: 'Royal trophy rims for 6-year-old racing champions!',
    speedBoostText: '+25 Grand Prize'
  }
];

export const INITIAL_EXTERIOR_DIRT: ExteriorDirtPatch[] = [
  { id: 'mud-hood-1', x: 26, y: 38, size: 52, type: 'mud', cleaned: false, foamed: false },
  { id: 'mud-door-left', x: 44, y: 64, size: 48, type: 'mud', cleaned: false, foamed: false },
  { id: 'dust-windshield', x: 53, y: 28, size: 45, type: 'dust', cleaned: false, foamed: false },
  { id: 'leaf-roof', x: 67, y: 44, size: 42, type: 'leaf', cleaned: false, foamed: false },
  { id: 'mud-bumper', x: 18, y: 55, size: 50, type: 'mud', cleaned: false, foamed: false },
  { id: 'dust-trunk', x: 82, y: 52, size: 46, type: 'dust', cleaned: false, foamed: false }
];

export const INITIAL_INTERIOR_MESSES: InteriorMessItem[] = [
  {
    id: 'crumbs-seat',
    label: 'Cracker Crumbs on Seat',
    x: 32,
    y: 62,
    size: 50,
    type: 'cookie-crumbs',
    cleaned: false,
    toolNeeded: 'vacuum'
  },
  {
    id: 'juice-cup-holder',
    label: 'Sticky Berry Juice Spill',
    x: 54,
    y: 72,
    size: 48,
    type: 'juice-spill',
    cleaned: false,
    toolNeeded: 'wipe-spray'
  },
  {
    id: 'fingerprint-nav',
    label: 'Jam Fingerprints on Screen',
    x: 51,
    y: 34,
    size: 46,
    type: 'fingerprint',
    cleaned: false,
    toolNeeded: 'wipe-spray'
  },
  {
    id: 'crumbs-floor',
    label: 'Pretzel Crumbs on Mat',
    x: 24,
    y: 84,
    size: 52,
    type: 'cookie-crumbs',
    cleaned: false,
    toolNeeded: 'vacuum'
  },
  {
    id: 'toy-wrapper',
    label: 'Toy Car Wrapper on Dashboard',
    x: 74,
    y: 38,
    size: 44,
    type: 'toy-wrapper',
    cleaned: false,
    toolNeeded: 'trash-grab'
  },
  {
    id: 'footprint-passenger',
    label: 'Muddy Sneaker Print',
    x: 74,
    y: 82,
    size: 54,
    type: 'muddy-footprint',
    cleaned: false,
    toolNeeded: 'wipe-spray'
  }
];

export const createDefaultCars = (): CarState[] => [
  {
    id: 'grandson-hero-car',
    name: "Grandson's Super Racer",
    driverName: 'Grandson (Age 6!)',
    carType: 'sports',
    homeStreet: "Maple Ave (Grandpa's Street!)",
    paintColor: 'racing-red',
    wheelRim: 'lightning-bolt',
    headlightsOn: true,
    hornPitch: 1.05,
    exteriorDirt: INITIAL_EXTERIOR_DIRT.map((d) => ({ ...d })),
    interiorMesses: INITIAL_INTERIOR_MESSES.map((m) => ({ ...m })),
    exteriorCleanPercent: 0,
    interiorCleanPercent: 0,
    waxShineApplied: false,
    tirePressurePsi: [18, 22, 19, 21], // needs pumping up to 32 PSI!
    fuelPercent: 28, // needs gasoline!
    fuelGallons: 3.4,
    serviceStampEarned: false,
    washStampEarned: false,
    x: 220,
    y: 720, // Parked on Grandpa's Street (bottom residential lane)
    angle: 0,
    isGrandsonCar: true
  },
  {
    id: 'grandpa-pickup',
    name: "Grandpa's Big Blue Truck",
    driverName: 'Grandpa',
    carType: 'pickup',
    homeStreet: "Maple Ave (Grandpa's Street!)",
    paintColor: 'ocean-blue',
    wheelRim: 'monster-tread',
    headlightsOn: true,
    hornPitch: 0.75,
    exteriorDirt: INITIAL_EXTERIOR_DIRT.map((d) => ({ ...d, x: (d.x + 15) % 85 })),
    interiorMesses: INITIAL_INTERIOR_MESSES.map((m) => ({ ...m })),
    exteriorCleanPercent: 0,
    interiorCleanPercent: 0,
    waxShineApplied: false,
    tirePressurePsi: [20, 20, 20, 20],
    fuelPercent: 45,
    fuelGallons: 5.4,
    serviceStampEarned: false,
    washStampEarned: false,
    x: 410,
    y: 720, // Parked right next door on Grandpa's Street!
    angle: 0,
    isGrandsonCar: false
  },
  {
    id: 'neighbor-yellow-taxi',
    name: 'Sunshine Town Cruiser',
    driverName: 'Neighbor Lily',
    carType: 'convertible',
    homeStreet: "Maple Ave (Grandpa's Street!)",
    paintColor: 'sunshine-yellow',
    wheelRim: 'rainbow-spinner',
    headlightsOn: false,
    hornPitch: 1.25,
    exteriorDirt: INITIAL_EXTERIOR_DIRT.map((d) => ({ ...d })),
    interiorMesses: INITIAL_INTERIOR_MESSES.map((m) => ({ ...m })),
    exteriorCleanPercent: 0,
    interiorCleanPercent: 0,
    waxShineApplied: false,
    tirePressurePsi: [24, 25, 23, 24],
    fuelPercent: 35,
    fuelGallons: 4.2,
    serviceStampEarned: false,
    washStampEarned: false,
    x: 630,
    y: 720,
    angle: 0,
    isGrandsonCar: false
  }
];
