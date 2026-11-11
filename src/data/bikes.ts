/** Bikes the garage can be set up for. Spare parts reference these ids in `models`. */
export type BikeModel = {
  id: string;
  brand: string;
  name: string;
  /** Photo under /public/bikes. Shows a placeholder until the file is added. */
  image: string;
};

export const BIKE_MODELS: BikeModel[] = [
  { id: "yamaha-tw200", brand: "Yamaha", name: "TW200", image: "/bikes/yamaha-tw200.jpg" },
  { id: "yamaha-ybr125", brand: "Yamaha", name: "YBR125", image: "/bikes/yamaha-ybr125.jpg" },
  { id: "yamaha-fzs-v3", brand: "Yamaha", name: "FZ-S V3", image: "/bikes/yamaha-fzs-v3.jpg" },
  { id: "yamaha-r15-v4", brand: "Yamaha", name: "R15 V4", image: "/bikes/yamaha-r15-v4.jpg" },
  { id: "honda-shine-125", brand: "Honda", name: "Shine 125", image: "/bikes/honda-shine-125.jpg" },
  { id: "bajaj-pulsar-150", brand: "Bajaj", name: "Pulsar 150", image: "/bikes/bajaj-pulsar-150.jpg" },
  { id: "tvs-apache-160", brand: "TVS", name: "Apache RTR 160", image: "/bikes/tvs-apache-160.jpg" },
];

export const BIKE_BRANDS: string[] = Array.from(new Set(BIKE_MODELS.map((b) => b.brand)));

export function getBike(id: string | null | undefined): BikeModel | undefined {
  return BIKE_MODELS.find((b) => b.id === id);
}
