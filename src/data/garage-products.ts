import type { BikeType, CategorySlug, GarageGroup, Product } from "@/data/catalog";

/**
 * Garage products: modifications (visors, handlebars, LED lights, accessories) and
 * spare parts (engine internals). Spare parts are listed for the Yamaha TW200 only,
 * so other bikes show an honest "not listed yet" state.
 */
const ALL_TYPES: BikeType[] = ["Sport", "Commuter", "Scooter", "Off-road"];
const TW200: string[] = ["yamaha-tw200"];

type Input = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  group: GarageGroup;
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
  models?: string[];
  badge?: Product["badge"];
  addedOn: string;
};

const item = (i: Input): Product => {
  const { models, ...rest } = i;
  return { ...rest, ...(models ? { models } : {}), image: `/products/${i.slug}.svg` };
};

export const GARAGE_PRODUCTS: Product[] = [
  // ───────────── Modifications ─────────────
  item({
    id: "g-001", slug: "smoked-wind-visor", name: "Smoked Wind Visor", brand: "VisionPro", category: "controls", group: "modification",
    price: 4200, mrp: 4900, rating: 4.5, reviews: 64, stock: 12, addedOn: "2026-10-01",
    description: "Smoked wind visor that deflects wind and rain away from the rider's chest and face. Bolts onto the fork area with a simple bracket.",
    features: ["Smoked polycarbonate", "Bolt-on bracket included", "Reduces wind buffeting"],
    specs: { Material: "Polycarbonate", Finish: "Smoked", Mounting: "Bolt-on", Warranty: "3 months" },
    compatibility: ALL_TYPES, tags: ["visor", "wind", "smoked", "windshield"],
  }),
  item({
    id: "g-002", slug: "headlight-visor-sport", name: "Headlight Visor (Sport Style)", brand: "VisionPro", category: "controls", group: "modification",
    price: 2800, mrp: 3300, rating: 4.3, reviews: 41, stock: 18, addedOn: "2026-09-12",
    description: "Sporty headlight visor that shields the lamp from rain and sun and gives the front a sharper look.",
    features: ["UV-stable ABS", "Matches headlight shape", "Quick fit with existing holes"],
    specs: { Material: "ABS", Finish: "Matt black", Mounting: "Screw-on", Warranty: "3 months" },
    compatibility: ALL_TYPES, tags: ["visor", "headlight", "sport"],
  }),
  item({
    id: "g-003", slug: "racing-windscreen", name: "Racing Windscreen", brand: "VisionPro", category: "controls", group: "modification",
    price: 6500, mrp: 7200, rating: 4.6, reviews: 29, stock: 4, addedOn: "2026-08-20",
    description: "Tall racing-style windscreen for better wind protection on highway rides. Includes mounting hardware.",
    features: ["Tall profile for highway riding", "Scratch-resistant coating", "Full mounting kit"],
    specs: { Material: "Acrylic", Height: "Tall", Mounting: "Bracket kit", Warranty: "6 months" },
    compatibility: ["Sport", "Commuter", "Off-road"], tags: ["windscreen", "racing", "highway"],
    badge: "New", 
  }),
  item({
    id: "g-004", slug: "sport-handle-bar", name: "Sport Handle Bar (Aluminium)", brand: "NovaGrip", category: "controls", group: "modification",
    price: 5400, mrp: 6000, rating: 4.7, reviews: 52, stock: 6, addedOn: "2026-07-15",
    description: "Lightweight aluminium sport handle bar with a wider stance for better control. Anodised finish that resists scratches.",
    features: ["6061 aluminium", "Wider stance for control", "Anodised finish"],
    specs: { Material: "Aluminium 6061", Finish: "Anodised black", Diameter: "22 mm", Warranty: "6 months" },
    compatibility: ["Sport", "Commuter", "Off-road"], tags: ["handle bar", "handlebar", "aluminium"],
  }),
  item({
    id: "g-005", slug: "handle-bar-risers", name: "Handle Bar Risers (Pair)", brand: "NovaGrip", category: "controls", group: "modification",
    price: 1900, mrp: 2200, rating: 4.2, reviews: 38, stock: 22, addedOn: "2026-06-10",
    description: "Raises the handle bar for a more upright riding position. Easy bolt-on fitting, great for commuting and touring.",
    features: ["Raises riding position", "Bolt-on fitting", "Anti-vibration mounts"],
    specs: { Material: "Aluminium", Rise: "25 mm", Pieces: "Pair", Warranty: "3 months" },
    compatibility: ["Commuter", "Scooter", "Off-road"], tags: ["handle bar", "riser", "comfort"],
    
  }),
  item({
    id: "g-006", slug: "projector-led-headlight-kit", name: "Projector LED Headlight Kit", brand: "LumoX", category: "electrical", group: "modification",
    price: 7800, mrp: 9000, rating: 4.7, reviews: 96, stock: 7, addedOn: "2026-10-18", badge: "New",
    description: "Projector-style LED headlight kit with a sharp beam cut-off for much better night visibility. Plug-and-play wiring.",
    features: ["Projector lens with sharp cut-off", "Plug-and-play wiring", "6500K daylight white"],
    specs: { Type: "Projector LED", Colour: "6500K", Power: "35 W", Warranty: "1 year" },
    compatibility: ALL_TYPES, tags: ["led", "headlight", "projector", "light"],
  }),
  item({
    id: "g-007", slug: "led-tail-light", name: "LED Tail Light", brand: "LumoX", category: "electrical", group: "modification",
    price: 2400, mrp: 2800, rating: 4.4, reviews: 77, stock: 20, addedOn: "2026-09-05",
    description: "Bright LED tail light with brake-light function. Slim design that suits sport and commuter bikes.",
    features: ["Brake-light function", "Slim low-profile housing", "Long-life LEDs"],
    specs: { Type: "LED", Function: "Tail + brake", Voltage: "12 V", Warranty: "6 months" },
    compatibility: ALL_TYPES, tags: ["led", "tail light", "brake light"],
    
  }),
  item({
    id: "g-008", slug: "led-indicator-set", name: "LED Indicator Set (Amber, 4 pcs)", brand: "LumoX", category: "electrical", group: "modification",
    price: 1600, mrp: 1900, rating: 4.3, reviews: 58, stock: 30, addedOn: "2026-08-02",
    description: "Four amber LED indicators that flash brightly in daylight. Built-in resistor option for stable flashing.",
    features: ["Bright amber in daylight", "Four-piece set", "Stable flasher compatible"],
    specs: { Colour: "Amber", Pieces: "4", Voltage: "12 V", Warranty: "6 months" },
    compatibility: ALL_TYPES, tags: ["led", "indicator", "turn signal"],
    
  }),
  item({
    id: "g-009", slug: "led-fog-light-pair", name: "LED Fog Light Pair", brand: "LumoX", category: "electrical", group: "modification",
    price: 3200, mrp: 3700, rating: 4.4, reviews: 33, stock: 13, addedOn: "2026-07-22", badge: "Sale",
    description: "Compact LED fog lights that add a wide, low beam for better visibility in rain, fog and dusty roads.",
    features: ["Wide low beam", "Water-resistant housing", "Pair with mounting brackets"],
    specs: { Type: "LED fog", Pieces: "Pair", Colour: "6000K", Warranty: "6 months" },
    compatibility: ["Sport", "Commuter", "Off-road"], tags: ["led", "fog light", "auxiliary"],
    
  }),
  item({
    id: "g-010", slug: "engine-crash-guard", name: "Engine Crash Guard", brand: "Trailmaster", category: "accessories", group: "modification",
    price: 4800, mrp: 5500, rating: 4.5, reviews: 45, stock: 8, addedOn: "2026-06-28",
    description: "Tubular steel crash guard that protects the engine casing and radiator area in a low-speed fall or off-road slide.",
    features: ["Tubular steel frame", "Powder-coated finish", "Bolt-on, no drilling"],
    specs: { Material: "Steel", Finish: "Powder-coated black", Mounting: "Bolt-on", Warranty: "6 months" },
    compatibility: ["Sport", "Off-road", "Commuter"], tags: ["crash guard", "engine guard", "protection"],
  }),
  item({
    id: "g-011", slug: "comfort-seat-cover", name: "Comfort Seat Cover", brand: "RideComfort", category: "accessories", group: "modification",
    price: 2200, mrp: 2600, rating: 4.4, reviews: 88, stock: 25, addedOn: "2026-05-18",
    description: "Padded seat cover with a grippy top layer for long rides. Water-resistant and easy to fit over the original seat.",
    features: ["Padded comfort foam", "Grippy top layer", "Water-resistant cover"],
    specs: { Material: "PU leather", Padding: "Foam", Fitting: "Slip-on", Warranty: "3 months" },
    compatibility: ALL_TYPES, tags: ["seat", "seat cover", "comfort"],
    
  }),
  item({
    id: "g-012", slug: "adjustable-footrest-set", name: "Adjustable Footrest Set", brand: "Trailmaster", category: "accessories", group: "modification",
    price: 3100, mrp: 3500, rating: 4.3, reviews: 27, stock: 10, addedOn: "2026-04-30",
    description: "Billet footrests that adjust in several positions for rider comfort. Anodised finish with a rubber insert.",
    features: ["Adjustable height positions", "Billet aluminium", "Rubber insert for grip"],
    specs: { Material: "Aluminium", Adjustment: "Multi-position", Finish: "Anodised", Pieces: "Pair" },
    compatibility: ["Sport", "Commuter", "Off-road"], tags: ["footrest", "foot peg", "adjustable"],
    
  }),
  item({
    id: "g-013", slug: "sport-exhaust-silencer", name: "Sport Exhaust Silencer", brand: "Trailmaster", category: "accessories", group: "modification",
    price: 9800, mrp: 11200, rating: 4.6, reviews: 61, stock: 3, addedOn: "2026-03-14",
    description: "Sport exhaust silencer with a deeper note and lighter weight than the stock pipe. Includes a removable db killer.",
    features: ["Lighter stainless build", "Deeper sport note", "Removable db killer"],
    specs: { Material: "Stainless steel", Type: "Slip-on silencer", Noise: "Sport tune", Warranty: "6 months" },
    compatibility: ["Sport", "Commuter"], tags: ["exhaust", "silencer", "sport"],
    
  }),

  // ───────────── Spare parts (Yamaha TW200) ─────────────
  item({
    id: "g-101", slug: "piston-valve", name: "Piston Valve", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 1450, mrp: 1650, rating: 4.4, reviews: 19, stock: 15, addedOn: "2026-10-09",
    description: "Replacement piston valve that keeps the intake timing sealed and the engine running smoothly.",
    features: ["Matches original dimensions", "Hardened finish", "Fits TW200 engine"],
    specs: { Fits: "TW200", Position: "Engine internal", Pieces: "1", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["piston valve", "valve", "tw200"],
  }),
  item({
    id: "g-102", slug: "valve-rubber-set", name: "Valve Rubber Set", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 380, mrp: 450, rating: 4.2, reviews: 23, stock: 40, addedOn: "2026-10-09",
    description: "Set of valve rubbers that stop oil leaks at the valve seals and keep compression stable.",
    features: ["Oil-resistant rubber", "Full valve set", "Easy replacement"],
    specs: { Fits: "TW200", Material: "NBR rubber", Pieces: "Set", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["valve rubber", "seal", "tw200"],
    
  }),
  item({
    id: "g-103", slug: "full-gasket-set", name: "Full Gasket Set", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 1200, mrp: 1400, rating: 4.5, reviews: 36, stock: 20, addedOn: "2026-09-27",
    description: "Complete engine gasket set for head, base and cover joints. Stops leaks and restores a tight seal after a rebuild.",
    features: ["Complete engine set", "Heat-resistant material", "Matched to TW200 specs"],
    specs: { Fits: "TW200", Includes: "Head, base, cover gaskets", Material: "Multi-layer", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["gasket", "seal", "tw200"],
    
  }),
  item({
    id: "g-104", slug: "bar-picking-set", name: "Bar Picking Set", brand: "TrueFit", category: "controls", group: "spare", models: TW200,
    price: 950, mrp: 1100, rating: 4.1, reviews: 12, stock: 18, addedOn: "2026-08-15",
    description: "Bar picking (pick-up) set for the handle bar controls. Gives a smooth, positive action at the bar.",
    features: ["Smooth action at the bar", "Hardened contact points", "Fits TW200 handle bar"],
    specs: { Fits: "TW200", Position: "Handle bar", Pieces: "Set", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["bar picking", "bar", "tw200"],
    
  }),
  item({
    id: "g-105", slug: "oil-seal-set", name: "Oil Seal Set", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 720, mrp: 850, rating: 4.4, reviews: 31, stock: 25, addedOn: "2026-07-30",
    description: "Oil seal set for crankshaft and gearbox shafts. Keeps oil inside the engine and dirt out.",
    features: ["Crankshaft and gearbox seals", "Oil-resistant lip", "Fits TW200"],
    specs: { Fits: "TW200", Includes: "Crank + gearbox seals", Material: "NBR", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["oil seal", "seal", "tw200"],
    
  }),
  item({
    id: "g-106", slug: "engine-rebuild-kit", name: "Engine Rebuild Kit", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 8500, mrp: 9500, rating: 4.7, reviews: 14, stock: 2, badge: "Bestseller", addedOn: "2026-06-05",
    description: "Complete rebuild kit with piston, rings, gaskets and seals for a full engine overhaul on the TW200.",
    features: ["Piston and rings included", "Gasket and seal set", "Full overhaul in one kit"],
    specs: { Fits: "TW200", Includes: "Piston, rings, gaskets, seals", Type: "Overhaul kit", Warranty: "6 months" },
    compatibility: ["Off-road"], tags: ["rebuild", "overhaul", "kit", "red kit", "tw200"],
    
  }),
  item({
    id: "g-107", slug: "bearing-set", name: "Bearing Set", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 1100, mrp: 1300, rating: 4.3, reviews: 17, stock: 14, addedOn: "2026-05-22",
    description: "Engine and gearbox bearing set that keeps shafts turning smoothly and quietly.",
    features: ["Smooth, quiet running", "Sealed bearings", "Fits TW200 shafts"],
    specs: { Fits: "TW200", Includes: "Crank and gearbox bearings", Type: "Sealed ball", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["bearing", "crank", "tw200"],
    
  }),
  item({
    id: "g-108", slug: "rocker-arm", name: "Rocker Arm", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 1650, mrp: 1900, rating: 4.4, reviews: 11, stock: 9, addedOn: "2026-04-18",
    description: "Replacement rocker arm that transfers cam motion to the valves for accurate valve timing.",
    features: ["Hardened contact face", "Accurate valve timing", "Fits TW200 head"],
    specs: { Fits: "TW200", Position: "Cylinder head", Pieces: "1", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["rocker arm", "valve", "tw200"],
    
  }),
  item({
    id: "g-109", slug: "camshaft", name: "Camshaft", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 4800, mrp: 5400, rating: 4.6, reviews: 9, stock: 4, addedOn: "2026-03-29",
    description: "Replacement camshaft that controls intake and exhaust valve lift for a smooth, reliable engine.",
    features: ["Precision-ground lobes", "Matched valve timing", "Fits TW200"],
    specs: { Fits: "TW200", Position: "Cylinder head", Material: "Hardened steel", Warranty: "6 months" },
    compatibility: ["Off-road"], tags: ["camshaft", "cam", "valve timing", "tw200"],
    
  }),
  item({
    id: "g-110", slug: "timing-chain", name: "Timing Chain", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 1350, mrp: 1550, rating: 4.5, reviews: 15, stock: 11, addedOn: "2026-03-02",
    description: "Timing chain that links the crankshaft to the camshaft. Heat-treated links for long life under constant load.",
    features: ["Heat-treated links", "Keeps valve timing accurate", "Fits TW200"],
    specs: { Fits: "TW200", Type: "Timing chain", Material: "Heat-treated steel", Warranty: "6 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["timing chain", "chain", "tw200"],
    
  }),
  item({
    id: "g-111", slug: "timing-chain-guard", name: "Timing Chain Guard", brand: "TrueFit", category: "engine", group: "spare", models: TW200,
    price: 620, mrp: 750, rating: 4.2, reviews: 8, stock: 16, addedOn: "2026-02-12",
    description: "Timing chain guard (cover) that protects the chain and keeps it running on track. Fits over the timing area.",
    features: ["Protects timing chain", "Easy bolt-on", "Fits TW200"],
    specs: { Fits: "TW200", Position: "Timing cover", Material: "Pressed steel", Warranty: "3 months" },
    compatibility: ["Off-road", "Commuter"], tags: ["timing guard", "chain guard", "cover", "tw200"],
    
  }),
];

