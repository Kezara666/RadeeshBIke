import { GARAGE_PRODUCTS } from "@/data/garage-products";

export type CategorySlug =
  | "brakes"
  | "drivetrain"
  | "tyres"
  | "engine"
  | "electrical"
  | "suspension"
  | "controls"
  | "care"
  | "accessories";

export type BikeType = "Sport" | "Commuter" | "Scooter" | "Off-road";

export type Badge = "New" | "Bestseller" | "Sale";

/** Garage group: spare parts (engine internals) or modifications (visors, lights, accessories). */
export type GarageGroup = "spare" | "modification";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: "Disc3" | "Cog" | "CircleDot" | "Wrench" | "Lightbulb" | "ArrowUpDown" | "Gauge" | "Droplets" | "Package";
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  features: string[];
  specs: Record<string, string>;
  compatibility: BikeType[];
  tags: string[];
  badge?: Badge;
  addedOn: string;
  /** Garage group. Products without one only appear in the normal catalogue. */
  group?: GarageGroup;
  /** Bike ids from data/bikes.ts this part fits. Undefined = fits every bike. */
  models?: string[];
  /** Sample image path under /public. */
  image?: string;
};

export const BIKE_TYPES: BikeType[] = ["Sport", "Commuter", "Scooter", "Off-road"];

export const CATEGORIES: Category[] = [
  { slug: "brakes", name: "Brakes & Discs", description: "Pads, rotors and brake levers for confident stopping.", icon: "Disc3" },
  { slug: "drivetrain", name: "Chains & Sprockets", description: "Chains, sprockets and complete drivetrain kits.", icon: "Cog" },
  { slug: "tyres", name: "Tyres & Tubes", description: "Grip-focused tyres and durable inner tubes.", icon: "CircleDot" },
  { slug: "engine", name: "Engine Parts", description: "Plugs, air filters and clutch components.", icon: "Wrench" },
  { slug: "electrical", name: "Electrical & Lighting", description: "Bulbs, batteries and horns for every ride.", icon: "Lightbulb" },
  { slug: "suspension", name: "Suspension", description: "Shocks, fork oil and seal kits for a smooth ride.", icon: "ArrowUpDown" },
  { slug: "controls", name: "Controls & Cockpit", description: "Grips, mirrors and digital instrument clusters.", icon: "Gauge" },
  { slug: "care", name: "Oils & Care", description: "Engine oil, chain lube and cleaning essentials.", icon: "Droplets" },
  { slug: "accessories", name: "Body & Accessories", description: "Visors, crash guards, seats and styling parts.", icon: "Package" },
];

const BASE_PRODUCTS: Product[] = [
  // Brakes
  {
    id: "p-001",
    slug: "ceramic-brake-pads-set",
    name: "Ceramic Brake Pads Set",
    brand: "Apex",
    category: "brakes",
    price: 3150,
    mrp: 4200,
    rating: 4.6,
    reviews: 218,
    stock: 42,
    description:
      "Low-dust ceramic compound pads that deliver strong, fade-free braking in wet and dry conditions. A quiet, long-lasting upgrade for daily riding.",
    features: ["Low-dust ceramic compound", "Quiet operation", "Fade-resistant under heavy braking"],
    specs: { Material: "Ceramic", Position: "Front", Pieces: "2 pads", Warranty: "6 months" },
    compatibility: ["Sport", "Commuter"],
    tags: ["pads", "front brake", "ceramic"],
    badge: "Bestseller",
    addedOn: "2026-08-14",
  },
  {
    id: "p-002",
    slug: "front-disc-rotor-240mm",
    name: "Front Disc Rotor 240mm",
    brand: "IronHide",
    category: "brakes",
    price: 5080,
    mrp: 5780,
    rating: 4.4,
    reviews: 96,
    stock: 15,
    description:
      "Wave-style stainless steel rotor with heat-dissipating design. A precise fit for most commuter and off-road front brake calipers.",
    features: ["Stainless steel wave rotor", "Heat dissipation vents", "Corrosion resistant finish"],
    specs: { Diameter: "240 mm", Thickness: "4 mm", Material: "Stainless steel", Position: "Front"},
    compatibility: ["Sport", "Commuter", "Off-road"],
    tags: ["rotor", "disc", "front brake"],
    badge: "Sale",
    addedOn: "2026-07-02",
  },
  {
    id: "p-003",
    slug: "hydraulic-brake-lever-set",
    name: "Hydraulic Brake Lever Set",
    brand: "NovaGrip",
    category: "brakes",
    price: 6620,
    mrp: 7700,
    rating: 4.7,
    reviews: 61,
    stock: 8,
    description:
      "Adjustable reach hydraulic brake levers with CNC-machined aluminium body for a firm, progressive feel at the bar.",
    features: ["CNC aluminium body", "Adjustable reach", "Progressive hydraulic feel"],
    specs: { Material: "Aluminium 6061", Reach: "Adjustable 5 steps", Finish: "Anodised black" },
    compatibility: ["Sport"],
    tags: ["lever", "hydraulic", "handlebar"],
    badge: "New",
    addedOn: "2026-10-21",
  },

  // Drivetrain
  {
    id: "p-004",
    slug: "428h-chain-116-links",
    name: "428H Chain 116 Links",
    brand: "SpeedLine",
    category: "drivetrain",
    price: 4030,
    mrp: 4730,
    rating: 4.5,
    reviews: 174,
    stock: 30,
    description:
      "Heavy-duty O-ring sealed chain that keeps lubrication inside and dirt outside. Built to handle high torque and extended riding.",
    features: ["O-ring sealed for longer life", "Heat-treated steel plates", "Smooth shifting"],
    specs: { Standard: "428H", Links: "116", Type: "O-ring", Warranty: "1 year" },
    compatibility: ["Sport", "Commuter", "Off-road"],
    tags: ["chain", "428", "o-ring"],
    badge: "Bestseller",
    addedOn: "2026-06-18",
  },
  {
    id: "p-005",
    slug: "rear-sprocket-45t-steel",
    name: "Rear Sprocket 45T Steel",
    brand: "SpeedLine",
    category: "drivetrain",
    price: 2730,
    mrp: 3150,
    rating: 4.3,
    reviews: 88,
    stock: 22,
    description:
      "Hardened steel rear sprocket with precision-cut teeth for quiet engagement and reduced wear on your chain.",
    features: ["Hardened steel teeth", "Precision-cut profile", "Corrosion-resistant coating"],
    specs: { Teeth: "45T", Material: "Hardened steel", Pitch: "428", Position: "Rear" },
    compatibility: ["Sport", "Commuter"],
    tags: ["sprocket", "rear", "steel"],
    addedOn: "2026-05-30",
  },
  {
    id: "p-006",
    slug: "chain-and-sprocket-kit",
    name: "Chain & Sprocket Kit",
    brand: "SpeedLine",
    category: "drivetrain",
    price: 8750,
    mrp: 10330,
    rating: 4.8,
    reviews: 132,
    stock: 12,
    description:
      "Complete front and rear sprocket and chain set, matched for a clean fit and longer service life. Save more compared to buying parts separately.",
    features: ["Matched chain and sprocket set", "Better value than separate parts", "Easy installation"],
    specs: { Includes: "Chain, front and rear sprocket", Standard: "428H", Warranty: "1 year" },
    compatibility: ["Sport", "Commuter"],
    tags: ["kit", "chain", "sprocket", "combo"],
    badge: "Sale",
    addedOn: "2026-09-09",
  },

  // Tyres
  {
    id: "p-007",
    slug: "tubeless-tyre-90-90-17",
    name: "Tubeless Tyre 90/90-17",
    brand: "Trailmaster",
    category: "tyres",
    price: 5780,
    mrp: 6650,
    rating: 4.5,
    reviews: 240,
    stock: 25,
    description:
      "All-weather tubeless tyre with a multi-compound tread for strong wet-road grip and a long, even wear life.",
    features: ["Tubeless construction", "Wet-weather grip", "Puncture-resistant casing"],
    specs: { Size: "90/90-17", Type: "Tubeless", Tread: "Multi-compound", Position: "Front or rear" },
    compatibility: ["Commuter", "Sport"],
    tags: ["tyre", "tubeless", "17 inch"],
    badge: "Bestseller",
    addedOn: "2026-04-11",
  },
  {
    id: "p-008",
    slug: "off-road-knobby-tyre-80-100-21",
    name: "Off-road Knobby Tyre 80/100-21",
    brand: "Trailmaster",
    category: "tyres",
    price: 11200,
    mrp: 12600,
    rating: 4.6,
    reviews: 57,
    stock: 6,
    description:
      "Aggressive knobby tread engineered for loose gravel, mud and trail riding. Reinforced sidewalls handle rough terrain.",
    features: ["Deep knobby tread", "Reinforced sidewalls", "Self-cleaning tread pattern"],
    specs: { Size: "80/100-21", Type: "Tube-type", Tread: "Knobby", Position: "Front" },
    compatibility: ["Off-road"],
    tags: ["tyre", "off-road", "knobby", "21 inch"],
    addedOn: "2026-10-03",
  },
  {
    id: "p-009",
    slug: "heavy-duty-inner-tube-17",
    name: "Heavy Duty Inner Tube 17-inch",
    brand: "Trailmaster",
    category: "tyres",
    price: 770,
    mrp: 910,
    rating: 4.2,
    reviews: 310,
    stock: 120,
    description:
      "Butyl rubber inner tube with thicker walls for reduced pinch-flat risk. Fits 17-inch wheels across most bike types.",
    features: ["Thick butyl rubber", "Pinch-flat resistant", "Valve included"],
    specs: { Size: "17 inch", Material: "Butyl rubber", Valve: "Schrader" },
    compatibility: ["Sport", "Commuter", "Off-road"],
    tags: ["tube", "inner tube", "17 inch"],
    addedOn: "2026-03-22",
  },

  // Engine
  {
    id: "p-010",
    slug: "iridium-spark-plug",
    name: "Iridium Spark Plug",
    brand: "VoltEdge",
    category: "engine",
    price: 1190,
    mrp: 1470,
    rating: 4.7,
    reviews: 402,
    stock: 80,
    description:
      "Fine-wire iridium electrode for reliable ignition, faster cold starts and better fuel efficiency.",
    features: ["Iridium fine-wire electrode", "Faster cold starts", "Long service interval"],
    specs: { Type: "Iridium", Reach: "12 mm", Heat: "Standard", Pieces: "1" },
    compatibility: ["Sport", "Commuter", "Scooter"],
    tags: ["spark plug", "ignition", "iridium"],
    badge: "Bestseller",
    addedOn: "2026-02-15",
  },
  {
    id: "p-011",
    slug: "high-flow-air-filter",
    name: "High-Flow Air Filter",
    brand: "BreathPro",
    category: "engine",
    price: 1960,
    mrp: 2420,
    rating: 4.4,
    reviews: 119,
    stock: 35,
    description:
      "Washable multi-layer foam air filter that boosts airflow while keeping dust out of the intake.",
    features: ["Washable and reusable", "Multi-layer dust filtration", "Improves throttle response"],
    specs: { Type: "Foam, washable", Layers: "3", Position: "Air box" },
    compatibility: ["Commuter", "Sport"],
    tags: ["air filter", "intake", "foam"],
    addedOn: "2026-06-05",
  },
  {
    id: "p-012",
    slug: "wet-clutch-plate-set",
    name: "Wet Clutch Plate Set",
    brand: "Apex",
    category: "engine",
    price: 4620,
    mrp: 5250,
    rating: 4.3,
    reviews: 54,
    stock: 10,
    description:
      "Friction and steel clutch plate set designed for smooth engagement and consistent power transfer under load.",
    features: ["Friction-lined plates", "Smooth engagement", "Heat-resistant design"],
    specs: { Type: "Wet clutch", Plates: "Friction + steel set", Position: "Engine" },
    compatibility: ["Sport"],
    tags: ["clutch", "plates", "engine"],
    addedOn: "2026-01-28",
  },

  // Electrical
  {
    id: "p-013",
    slug: "led-headlight-bulb-h4",
    name: "LED Headlight Bulb H4",
    brand: "LumoX",
    category: "electrical",
    price: 2800,
    mrp: 3500,
    rating: 4.5,
    reviews: 276,
    stock: 50,
    description:
      "Bright, cool-running LED bulb with a plug-and-play H4 base. Dramatically improves night visibility.",
    features: ["6000K white light", "Plug-and-play H4 base", "Cool running, long life"],
    specs: { Base: "H4", Colour: "6000K", Power: "24 W", Pieces: "1 pair" },
    compatibility: ["Sport", "Commuter", "Scooter", "Off-road"],
    tags: ["led", "headlight", "bulb", "h4"],
    badge: "New",
    addedOn: "2026-10-30",
  },
  {
    id: "p-014",
    slug: "maintenance-free-battery-12v-7ah",
    name: "Maintenance-Free Battery 12V 7Ah",
    brand: "VoltEdge",
    category: "electrical",
    price: 6620,
    mrp: 7700,
    rating: 4.6,
    reviews: 188,
    stock: 18,
    description:
      "Sealed maintenance-free battery with strong cranking power and vibration-resistant construction. No topping up required.",
    features: ["Sealed, no topping up", "Vibration-resistant", "Strong cranking power"],
    specs: { Voltage: "12 V", Capacity: "7 Ah", Type: "VRLA sealed", Warranty: "18 months" },
    compatibility: ["Commuter", "Scooter", "Sport"],
    tags: ["battery", "12v", "7ah"],
    addedOn: "2026-07-19",
  },
  {
    id: "p-015",
    slug: "dual-tone-horn-12v",
    name: "Dual-Tone Horn 12V",
    brand: "LumoX",
    category: "electrical",
    price: 1580,
    mrp: 1930,
    rating: 4.1,
    reviews: 73,
    stock: 40,
    description:
      "Loud, clear dual-tone horn that meets everyday safety needs. Easy bracket mounting for most bikes and scooters.",
    features: ["Dual-tone sound", "Waterproof housing", "Universal mounting bracket"],
    specs: { Voltage: "12 V", Tone: "Dual", Mounting: "Universal bracket" },
    compatibility: ["Sport", "Commuter", "Scooter", "Off-road"],
    tags: ["horn", "electrical", "12v"],
    addedOn: "2026-04-02",
  },

  // Suspension
  {
    id: "p-016",
    slug: "adjustable-rear-shock-absorber",
    name: "Adjustable Rear Shock Absorber",
    brand: "Trailmaster",
    category: "suspension",
    price: 14700,
    mrp: 17150,
    rating: 4.5,
    reviews: 77,
    stock: 5,
    description:
      "Gas-charged rear shock with 5-step preload adjustment to tune ride comfort for solo or pillion riding.",
    features: ["Gas-charged damping", "5-step preload adjustment", "Durable chrome shaft"],
    specs: { Type: "Gas-charged", Adjustment: "5-step preload", Position: "Rear", Length: "330 mm" },
    compatibility: ["Sport", "Commuter"],
    tags: ["shock", "rear", "suspension", "adjustable"],
    addedOn: "2026-08-27",
  },
  {
    id: "p-017",
    slug: "fork-oil-10w-500ml",
    name: "Fork Oil 10W 500ml",
    brand: "Apex",
    category: "suspension",
    price: 2170,
    mrp: 2450,
    rating: 4.4,
    reviews: 99,
    stock: 40,
    description:
      "Low-viscosity fork oil for a responsive, plush front end. Keeps damping consistent in changing temperatures.",
    features: ["Consistent viscosity", "Anti-foam formula", "Smooth fork action"],
    specs: { Grade: "10W", Volume: "500 ml", Type: "Fork oil" },
    compatibility: ["Sport", "Commuter", "Off-road"],
    tags: ["fork oil", "suspension", "front"],
    addedOn: "2026-05-12",
  },
  {
    id: "p-018",
    slug: "front-fork-seal-kit",
    name: "Front Fork Seal Kit",
    brand: "IronHide",
    category: "suspension",
    price: 3430,
    mrp: 4030,
    rating: 4.2,
    reviews: 35,
    stock: 14,
    description:
      "Complete dust and oil seal kit that stops leaks and restores a clean, smooth front suspension.",
    features: ["Dust and oil seals included", "Easy replacement", "Durable NBR rubber"],
    specs: { Includes: "Oil seals, dust seals", Material: "NBR rubber", Position: "Front fork" },
    compatibility: ["Sport", "Commuter"],
    tags: ["seal", "fork", "leak"],
    addedOn: "2026-03-08",
  },

  // Controls
  {
    id: "p-019",
    slug: "ergonomic-rubber-grips",
    name: "Ergonomic Rubber Grips (Pair)",
    brand: "NovaGrip",
    category: "controls",
    price: 1230,
    mrp: 1580,
    rating: 4.3,
    reviews: 142,
    stock: 60,
    description:
      "Soft-touch ergonomic grips that reduce vibration and hand fatigue on long rides. Anti-slip texture even in rain.",
    features: ["Anti-vibration rubber", "Anti-slip texture", "Easy slide-on fitting"],
    specs: { Material: "Rubber", Length: "120 mm", Pieces: "Pair" },
    compatibility: ["Sport", "Commuter", "Scooter", "Off-road"],
    tags: ["grips", "handlebar", "rubber"],
    addedOn: "2026-02-20",
  },
  {
    id: "p-020",
    slug: "rear-view-mirror-pair",
    name: "Rear View Mirror Pair",
    brand: "NovaGrip",
    category: "controls",
    price: 1680,
    mrp: 2100,
    rating: 4.0,
    reviews: 46,
    stock: 27,
    description:
      "Wide-angle convex mirrors with adjustable stems for a clear view of traffic behind you.",
    features: ["Wide-angle convex glass", "Adjustable stems", "Vibration-dampened mount"],
    specs: { Thread: "10 mm", Glass: "Convex", Pieces: "Pair" },
    compatibility: ["Commuter", "Scooter"],
    tags: ["mirror", "rear view", "safety"],
    addedOn: "2026-06-29",
  },
  {
    id: "p-021",
    slug: "digital-speedometer-cluster",
    name: "Digital Speedometer Cluster",
    brand: "LumoX",
    category: "controls",
    price: 9630,
    mrp: 10850,
    rating: 4.6,
    reviews: 29,
    stock: 9,
    description:
      "Backlit digital instrument cluster with speed, odometer, trip meter, fuel gauge and gear indicator.",
    features: ["Backlit LCD display", "Odometer and dual trip meter", "Fuel and gear indicators"],
    specs: { Display: "LCD backlit", Functions: "Speed, ODO, trip, fuel", Voltage: "12 V" },
    compatibility: ["Sport", "Commuter", "Scooter"],
    tags: ["speedometer", "cluster", "digital", "dashboard"],
    badge: "New",
    addedOn: "2026-11-02",
  },

  // Care
  {
    id: "p-022",
    slug: "chain-lube-spray-500ml",
    name: "Chain Lube Spray 500ml",
    brand: "Apex",
    category: "care",
    price: 1090,
    mrp: 1330,
    rating: 4.6,
    reviews: 412,
    stock: 150,
    description:
      "Long-lasting chain lubricant that penetrates rollers and reduces friction, noise and wear. Works in wet and dusty conditions.",
    features: ["Penetrating formula", "Water-resistant film", "Reduces chain noise"],
    specs: { Volume: "500 ml", Type: "Chain lube spray", Usage: "All chains" },
    compatibility: ["Sport", "Commuter", "Off-road"],
    tags: ["chain lube", "lubricant", "spray"],
    badge: "Bestseller",
    addedOn: "2026-01-10",
  },
  {
    id: "p-023",
    slug: "semi-synthetic-engine-oil-10w40",
    name: "Semi-Synthetic Engine Oil 10W-40",
    brand: "ProTrack",
    category: "care",
    price: 2420,
    mrp: 2870,
    rating: 4.7,
    reviews: 530,
    stock: 70,
    description:
      "Semi-synthetic 4-stroke engine oil that protects against wear, keeps the engine cool and cleans internal parts.",
    features: ["Semi-synthetic blend", "Excellent wear protection", "Cleans internal deposits"],
    specs: { Grade: "10W-40", Volume: "1 litre", Type: "Semi-synthetic", Standard: "JASO MA2" },
    compatibility: ["Sport", "Commuter", "Scooter", "Off-road"],
    tags: ["engine oil", "10w40", "oil"],
    badge: "Bestseller",
    addedOn: "2026-03-30",
  },
  {
    id: "p-024",
    slug: "bike-wash-and-shine-kit",
    name: "Bike Wash & Shine Kit",
    brand: "ProTrack",
    category: "care",
    price: 1890,
    mrp: 2280,
    rating: 4.3,
    reviews: 87,
    stock: 0,
    description:
      "Everything you need for a showroom finish: pH-balanced wash, microfibre cloth, brush and protective polish.",
    features: ["pH-balanced wash", "Microfibre cloth and brush", "Protective polish"],
    specs: { Includes: "Wash, polish, brush, cloth", Usage: "All bikes and scooters" },
    compatibility: ["Sport", "Commuter", "Scooter", "Off-road"],
    tags: ["wash", "polish", "cleaning", "kit"],
    addedOn: "2026-09-15",
  },
];

export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...GARAGE_PRODUCTS];

export const BRANDS: string[] =Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();

export const PRICE_BOUNDS = {
  min: Math.floor(Math.min(...PRODUCTS.map((p) => p.price)) / 100) * 100,
  max: Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 100) * 100,
};

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function discountPercent(p: Product): number {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}
