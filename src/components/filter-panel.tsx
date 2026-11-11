"use client";

import { useRef, type ReactNode } from "react";
import { Star } from "lucide-react";
import { BIKE_TYPES, BRANDS, CATEGORIES, PRICE_BOUNDS, PRODUCTS, type BikeType, type CategorySlug } from "@/data/catalog";
import { DEFAULT_FILTERS, type Filters } from "@/lib/filters";
import { formatLKR } from "@/lib/format";
import { useI18n } from "@/i18n/i18n-context";

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  activeCount: number;
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-ink-100 py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-semibold text-ink-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-sm text-ink-700 hover:bg-ink-100/70">
      <span className="flex items-center gap-3">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 cursor-pointer rounded border-ink-300 accent-brand-600" />
        <span className={checked ? "font-semibold text-ink-900" : ""}>{label}</span>
      </span>
      {count !== undefined && <span className="text-xs text-ink-500">{count}</span>}
    </label>
  );
}

export function FilterPanel({ filters, onChange, onReset, activeCount }: Props) {
  const { t } = useI18n();
  const priceMinRef = useRef<HTMLInputElement>(null);
  const priceMaxRef = useRef<HTMLInputElement>(null);

  // Price boxes are uncontrolled and remount (via key) whenever the URL value changes,
  // so typing never thrashes the URL and external resets still show.
  const commitPrice = (minRaw: string, maxRaw: string) => {
    let min = Number(minRaw);
    let max = Number(maxRaw);
    if (!Number.isFinite(min)) min = PRICE_BOUNDS.min;
    if (!Number.isFinite(max)) max = PRICE_BOUNDS.max;
    min = Math.max(PRICE_BOUNDS.min, Math.min(min, PRICE_BOUNDS.max));
    max = Math.max(PRICE_BOUNDS.min, Math.min(max, PRICE_BOUNDS.max));
    if (min > max) [min, max] = [max, min];
    onChange({ minPrice: min, maxPrice: max });
  };

  const countByCategory = (slug: CategorySlug) => PRODUCTS.filter((p) => p.category === slug).length;
  const countByBrand = (brand: string) => PRODUCTS.filter((p) => p.brand === brand).length;
  const countByBike = (type: BikeType) => PRODUCTS.filter((p) => p.compatibility.includes(type)).length;

  const PRICE_PRESETS = [
    { label: t("price.under", { max: formatLKR(1500) }), min: PRICE_BOUNDS.min, max: 1500 },
    { label: t("price.range", { min: formatLKR(1500), max: formatLKR(3000) }), min: 1500, max: 3000 },
    { label: t("price.range", { min: formatLKR(3000), max: formatLKR(7500) }), min: 3000, max: 7500 },
    { label: t("price.above", { min: formatLKR(7500) }), min: 7500, max: PRICE_BOUNDS.max },
  ];
  const presetActive = (min: number, max: number) => filters.minPrice === min && filters.maxPrice === max;

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-base font-bold text-ink-900">
          {t("filter.title")}{" "}
          {activeCount > 0 && <span className="ms-1 rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">{activeCount}</span>}
        </h2>
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-300">
            {t("catalog.clearAll")}
          </button>
        )}
      </div>

      <Section title={t("filter.category")}>
        <div className="space-y-0.5">
          {CATEGORIES.map((c) => (
            <Checkbox
              key={c.slug}
              label={t(`cat.${c.slug}`)}
              count={countByCategory(c.slug)}
              checked={filters.categories.includes(c.slug)}
              onChange={() => onChange({ categories: toggle(filters.categories, c.slug) })}
            />
          ))}
        </div>
      </Section>

      <Section title={t("filter.compatible")}>
        <div className="space-y-0.5">
          {BIKE_TYPES.map((b) => (
            <Checkbox
              key={b}
              label={t(`bike.${b}`)}
              count={countByBike(b)}
              checked={filters.compatibility.includes(b)}
              onChange={() => onChange({ compatibility: toggle(filters.compatibility, b) })}
            />
          ))}
        </div>
      </Section>

      <Section title={t("filter.brand")}>
        <div className="max-h-48 space-y-0.5 overflow-y-auto pe-1">
          {BRANDS.map((b) => (
            <Checkbox
              key={b}
              label={b}
              count={countByBrand(b)}
              checked={filters.brands.includes(b)}
              onChange={() => onChange({ brands: toggle(filters.brands, b) })}
            />
          ))}
        </div>
      </Section>

      <Section title={t("filter.price")}>
        <div className="mb-3 grid grid-cols-2 gap-2">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={`${preset.min}-${preset.max}`}
              type="button"
              aria-pressed={presetActive(preset.min, preset.max)}
              onClick={() => onChange({ minPrice: preset.min, maxPrice: preset.max })}
              className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition ${
                presetActive(preset.min, preset.max)
                  ? "border-brand-600 bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                  : "border-ink-300 text-ink-700 hover:border-ink-500"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="price-min">{t("filter.minLabel")}</label>
          <input
            id="price-min"
            ref={priceMinRef}
            type="number"
            inputMode="numeric"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            key={`min-${filters.minPrice}`}
            defaultValue={filters.minPrice}
            onBlur={(e) => commitPrice(e.currentTarget.value, priceMaxRef.current?.value ?? "")}
            onKeyDown={(e) => e.key === "Enter" && commitPrice(e.currentTarget.value, priceMaxRef.current?.value ?? "")}
            className="input px-3 py-2"
            aria-label={t("filter.minLabel")}
          />
          <span className="text-ink-500">–</span>
          <label className="sr-only" htmlFor="price-max">{t("filter.maxLabel")}</label>
          <input
            id="price-max"
            ref={priceMaxRef}
            type="number"
            inputMode="numeric"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            key={`max-${filters.maxPrice}`}
            defaultValue={filters.maxPrice}
            onBlur={(e) => commitPrice(priceMinRef.current?.value ?? "", e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && commitPrice(priceMinRef.current?.value ?? "", e.currentTarget.value)}
            className="input px-3 py-2"
            aria-label={t("filter.maxLabel")}
          />
        </div>
        <p className="mt-2 text-xs text-ink-500">
          {formatLKR(filters.minPrice)} – {formatLKR(filters.maxPrice)}
        </p>
      </Section>

      <Section title={t("filter.rating")}>
        <div className="space-y-1">
          {[4.5, 4, 3].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm text-ink-700 hover:bg-ink-100/70">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ minRating: r })}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`h-3.5 w-3.5 ${n <= Math.floor(r) ? "fill-amber-400 text-amber-400" : "text-ink-300"}`} aria-hidden="true" />
                ))}
                <span className="ms-1">{t("filter.andUp")}</span>
              </span>
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm text-ink-700 hover:bg-ink-100/70">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === DEFAULT_FILTERS.minRating}
              onChange={() => onChange({ minRating: DEFAULT_FILTERS.minRating })}
              className="h-4 w-4 accent-brand-600"
            />
            {t("filter.anyRating")}
          </label>
        </div>
      </Section>

      <Section title={t("filter.availability")}>
        <div className="space-y-0.5">
          <Checkbox label={t("filter.inStock")} checked={filters.inStockOnly} onChange={() => onChange({ inStockOnly: !filters.inStockOnly })} />
          <Checkbox label={t("filter.onSale")} checked={filters.onSaleOnly} onChange={() => onChange({ onSaleOnly: !filters.onSaleOnly })} />
        </div>
      </Section>
    </div>
  );
}
