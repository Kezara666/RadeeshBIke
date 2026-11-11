import { BIKE_TYPES, PRICE_BOUNDS, type BikeType, type CategorySlug, type Product } from "@/data/catalog";
import { PRODUCT_SI } from "@/data/catalog-si";
import { en, si } from "@/i18n/messages";

export const SORT_VALUES = ["featured", "price-asc", "price-desc", "rating", "newest", "name"] as const;
export type SortKey = (typeof SORT_VALUES)[number];

export type Filters = {
  q: string;
  categories: CategorySlug[];
  brands: string[];
  compatibility: BikeType[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = {
  q: "",
  categories: [],
  brands: [],
  compatibility: [],
  minPrice: PRICE_BOUNDS.min,
  maxPrice: PRICE_BOUNDS.max,
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  sort: "featured",
};

const list = (value: string | null): string[] =>
  value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

const num = (value: string | null, fallback: number): number => {
  if (value === null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

/** Read filters from URL search params (the URL is the source of truth). */
export function parseFilters(sp: URLSearchParams): Filters {
  const sort = sp.get("sort") ?? "";
  return {
    q: (sp.get("q") ?? "").slice(0, 100),
    categories: list(sp.get("cat")) as CategorySlug[],
    brands: list(sp.get("brand")),
    compatibility: list(sp.get("bike")).filter((b): b is BikeType => (BIKE_TYPES as string[]).includes(b)),
    minPrice: Math.max(PRICE_BOUNDS.min, num(sp.get("min"), PRICE_BOUNDS.min)),
    maxPrice: Math.min(PRICE_BOUNDS.max, num(sp.get("max"), PRICE_BOUNDS.max)),
    minRating: Math.min(5, Math.max(0, num(sp.get("rating"), 0))),
    inStockOnly: sp.get("stock") === "1",
    onSaleOnly: sp.get("sale") === "1",
    sort: (SORT_VALUES as readonly string[]).includes(sort) ? (sort as SortKey) : "featured",
  };
}

/** Serialise filters to a query string, omitting defaults to keep URLs clean. */
export function toQueryString(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set("q", f.q.trim());
  if (f.categories.length) sp.set("cat", f.categories.join(","));
  if (f.brands.length) sp.set("brand", f.brands.join(","));
  if (f.compatibility.length) sp.set("bike", f.compatibility.join(","));
  if (f.minPrice > PRICE_BOUNDS.min) sp.set("min", String(f.minPrice));
  if (f.maxPrice < PRICE_BOUNDS.max) sp.set("max", String(f.maxPrice));
  if (f.minRating > 0) sp.set("rating", String(f.minRating));
  if (f.inStockOnly) sp.set("stock", "1");
  if (f.onSaleOnly) sp.set("sale", "1");
  if (f.sort !== "featured") sp.set("sort", f.sort);
  return sp.toString();
}

export function activeFilterCount(f: Filters): number {
  return (
    f.categories.length +
    f.brands.length +
    f.compatibility.length +
    (f.minPrice > PRICE_BOUNDS.min || f.maxPrice < PRICE_BOUNDS.max ? 1 : 0) +
    (f.minRating > 0 ? 1 : 0) +
    (f.inStockOnly ? 1 : 0) +
    (f.onSaleOnly ? 1 : 0)
  );
}

/**
 * Score a free-text query against a product. Search runs over English AND Sinhala
 * text, so a Sinhala query finds products whatever the UI language is. 0 = no match.
 * Every term must match at least one field.
 */
function relevance(p: Product, terms: string[]): number {
  const tr = PRODUCT_SI[p.id];
  const fields: { text: string; weight: number }[] = [
    { text: p.name, weight: 5 },
    { text: tr?.name ?? "", weight: 5 },
    { text: p.brand, weight: 3 },
    { text: p.tags.join(" "), weight: 3 },
    { text: en[`cat.${p.category}`], weight: 2 },
    { text: si[`cat.${p.category}`], weight: 2 },
    { text: p.description, weight: 1 },
    { text: tr?.description ?? "", weight: 1 },
  ].map((f) => ({ ...f, text: f.text.toLowerCase() }));

  let score = 0;
  for (const term of terms) {
    let best = 0;
    for (const f of fields) if (f.text.includes(term)) best = Math.max(best, f.weight);
    if (best === 0) return 0;
    score += best;
  }
  return score;
}

export function applyFilters(products: Product[], f: Filters): Product[] {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const scores = new Map<string, number>();

  const result = products.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.compatibility.length && !p.compatibility.some((c) => f.compatibility.includes(c))) return false;
    if (p.price < f.minPrice || p.price > f.maxPrice) return false;
    if (p.rating < f.minRating) return false;
    if (f.inStockOnly && p.stock <= 0) return false;
    if (f.onSaleOnly && p.badge !== "Sale") return false; // explicit merchandising flag

    if (terms.length) {
      const score = relevance(p, terms);
      if (score === 0) return false;
      scores.set(p.id, score);
    }
    return true;
  });

  const badgeWeight = (p: Product) => (p.badge === "Bestseller" ? 2 : p.badge === "New" ? 1 : 0);

  return [...result].sort((a, b) => {
    switch (f.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating || b.reviews - a.reviews;
      case "newest":
        return b.addedOn.localeCompare(a.addedOn);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        if (terms.length) {
          return (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || b.rating - a.rating;
        }
        return badgeWeight(b) - badgeWeight(a) || b.rating - a.rating;
    }
  });
}
