export type PaintColorId = 'racing-red' | 'ocean-blue' | 'sunshine-yellow' | 'lime-rocket' | 'purple-turbo' | 'sunset-orange';

export interface PaintColorOption {
  id: PaintColorId;
  name: string;
  bodyColor: string;
  roofColor: string;
  stripeColor: string;
  badge: string;
}

export type WheelRimId = 'classic-star' | 'lightning-bolt' | 'rainbow-spinner' | 'monster-tread' | 'golden-crown';

export interface WheelRimOption {
  id: WheelRimId;
  name: string;
  rimColor: string;
  accentColor: string;
  tireWidth: number;
  description: string;
  speedBoostText: string;
}

export interface ExteriorDirtPatch {
  id: string;
  x: number; // percentage 0-100 on car body view
  y: number;
  size: number;
  type: 'mud' | 'dust' | 'leaf' | 'birdy';
  cleaned: boolean;
  foamed: boolean;
}

export interface InteriorMessItem {
  id: string;
  label: string;
  x: number; // percentage 0-100 on dashboard/seat view
  y: number;
  size: number;
  type: 'cookie-crumbs' | 'juice-spill' | 'fingerprint' | 'toy-wrapper' | 'muddy-footprint';
  cleaned: boolean;
  toolNeeded: 'vacuum' | 'wipe-spray' | 'trash-grab';
}

export interface CarState {
  id: string;
  name: string; // e.g. "Grandpa's Red Cruiser", "Leo's Blue Lightning", "Ice Cream Truck", "Fire Rescue Truck"
  driverName: string;
  carType: 'sports' | 'suv' | 'pickup' | 'convertible';
  homeStreet: string; // e.g. "Maple Ave (Grandpa's Street!)"
  // Customization
  paintColor: PaintColorId;
  wheelRim: WheelRimId;
  headlightsOn: boolean;
  hornPitch: number;

  // Car Wash status
  exteriorDirt: ExteriorDirtPatch[];
  interiorMesses: InteriorMessItem[];
  exteriorCleanPercent: number;
  interiorCleanPercent: number;
  waxShineApplied: boolean;

  // Service Garage status
  tirePressurePsi: [number, number, number, number]; // Front-Left, Front-Right, Rear-Left, Rear-Right (Target: 32 PSI)
  fuelPercent: number; // 0 to 100
  fuelGallons: number; // 0.0 to 12.0
  serviceStampEarned: boolean;
  washStampEarned: boolean;

  // Map Position & movement
  x: number; // map coordinates (0 - 1000)
  y: number;
  targetX?: number;
  targetY?: number;
  angle: number; // degrees
  isGrandsonCar: boolean; // primary controllable car
  honkEmoji?: string;
}

export type ActiveStationModal =
  | null
  | 'CAR_WASH'
  | 'SERVICE_STATION'
  | 'HOME_DRIVEWAY'
  | 'GARAGE_SHOWROOM';

export type CarWashTab = 'EXTERIOR' | 'INTERIOR';

export type ServiceStationTab = 'TIRE_PRESSURE' | 'PAINT_SHOP' | 'GASOLINE_PUMP' | 'WHEEL_UPGRADES';
