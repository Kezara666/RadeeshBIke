"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Search, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { CATEGORIES, PRICE_BOUNDS, PRODUCTS, type CategorySlug } from "@/data/catalog";
import { SORT_VALUES, activeFilterCount, applyFilters, parseFilters, toQueryString, type Filters } from "@/lib/filters";
import { formatLKR } from "@/lib/format";
import { useI18n } from "@/i18n/i18n-context";
import { FilterPanel } from "@/components/filter-panel";
import { ProductCard } from "@/components/product-card";

export function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  // The URL is the single source of truth, so filtered views are shareable and back-button friendly.
  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString())), [searchParams]);

  const update = (patch: Partial<Filters>) => {
    const qs = toQueryString({ ...filters, ...patch });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const reset = () => router.replace(pathname, { scroll: false });

  // Search box: local draft, committed to the URL after a short pause.
  const [qDraft, setQDraft] = useState(filters.q);
  const [syncedQ, setSyncedQ] = useState(filters.q);
  if (filters.q !== syncedQ) {
    // URL changed from outside (e.g. header search): resync the draft during render.
    setSyncedQ(filters.q);
    setQDraft(filters.q);
  }
  useEffect(() => {
    if (qDraft.trim() === filters.q) return;
    const timer = window.setTimeout(() => update({ q: qDraft.trim() }), 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDraft]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => applyFilters(PRODUCTS, filters), [filters]);
  const activeCount = activeFilterCount(filters);

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.q) {
    chips.push({
      key: "q",
      label: t("catalog.queryChip", { q: filters.q }),
      onRemove: () => {
        setQDraft("");
        update({ q: "" });
      },
    });
  }
  for (const c of filters.categories) {
    chips.push({
      key: `cat-${c}`,
      label: t(`cat.${c}`),
      onRemove: () => update({ categories: filters.categories.filter((x) => x !== c) }),
    });
  }
  for (const b of filters.brands) {
    chips.push({ key: `brand-${b}`, label: b, onRemove: () => update({ brands: filters.brands.filter((x) => x !== b) }) });
  }
  for (const b of filters.compatibility) {
    chips.push({
      key: `bike-${b}`,
      label: t("bike.suffix", { type: t(`bike.${b}`) }),
      onRemove: () => update({ compatibility: filters.compatibility.filter((x) => x !== b) }),
    });
  }
  if (filters.minPrice > PRICE_BOUNDS.min || filters.maxPrice < PRICE_BOUNDS.max) {
    chips.push({
      key: "price",
      label: `${formatLKR(filters.minPrice)} – ${formatLKR(filters.maxPrice)}`,
      onRemove: () => update({ minPrice: PRICE_BOUNDS.min, maxPrice: PRICE_BOUNDS.max }),
    });
  }
  if (filters.minRating > 0) {
    chips.push({ key: "rating", label: t("catalog.ratingChip", { r: filters.minRating }), onRemove: () => update({ minRating: 0 }) });
  }
  if (filters.inStockOnly) chips.push({ key: "stock", label: t("catalog.inStockChip"), onRemove: () => update({ inStockOnly: false }) });
  if (filters.onSaleOnly) chips.push({ key: "sale", label: t("catalog.onSaleChip"), onRemove: () => update({ onSaleOnly: false }) });

  const heading =
    filters.categories.length === 1 ? t(`cat.${filters.categories[0] as CategorySlug}`) : t("catalog.allTitle");

  const panelProps = { filters, onChange: update, onReset: reset, activeCount };

  return (
    <div className="container-page py-8 sm:py-10">
      {/* Heading + search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{t("catalog.eyebrow")}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{heading}</h1>
          <p className="mt-1 text-sm text-ink-500" aria-live="polite">
            {t("catalog.showing", { n: results.length, total: PRODUCTS.length })}
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="catalog-search" className="sr-only">{t("catalog.searchLabel")}</label>
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") update({ q: qDraft.trim() });
            }}
            placeholder={t("catalog.searchPlaceholder")}
            className="input h-11 rounded-full ps-10"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block" aria-label={t("catalog.filters")}>
          <div className="sticky top-40 max-h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-ink-100 bg-surface p-5 shadow-sm">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn-secondary !py-2.5 lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              {t("catalog.filters")}
              {activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-xs text-white">{activeCount}</span>}
            </button>

            <label className="ms-auto flex items-center gap-2 text-sm text-ink-700">
              <ArrowUpDown className="h-4 w-4 text-ink-500" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{t("catalog.sort")}</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
                className="input h-10 w-auto rounded-full py-0 ps-3 pe-8 text-sm font-medium"
              >
                {SORT_VALUES.map((value) => (
                  <option key={value} value={value}>{t(`sort.${value}`)}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Quick category pills */}
          <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => update({ categories: [] })}
              aria-pressed={filters.categories.length === 0}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filters.categories.length === 0
                  ? "border-night bg-night text-white"
                  : "border-ink-300 text-ink-700 hover:border-ink-500"
              }`}
            >
              {t("catalog.allChip")}
            </button>
            {CATEGORIES.map((c) => {
              const on = filters.categories.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    update({ categories: on ? filters.categories.filter((x) => x !== c.slug) : [...filters.categories, c.slug] })
                  }
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    on
                      ? "border-brand-600 bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                      : "border-ink-300 text-ink-700 hover:border-ink-500"
                  }`}
                >
                  {t(`cat.${c.slug}`)}
                </button>
              );
            })}
          </div>

          {/* Active chips */}
          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-ink-100 py-1 ps-3 pe-2 text-xs font-medium text-ink-900 transition hover:bg-ink-300/60"
                  aria-label={t("catalog.removeChip", { label: chip.label })}
                >
                  {chip.label}
                  <X className="h-3.5 w-3.5 text-ink-500 group-hover:text-ink-900" aria-hidden="true" />
                </button>
              ))}
              <button type="button" onClick={reset} className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">
                {t("catalog.clearAll")}
              </button>
            </div>
          )}

          {/* Results */}
          {results.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
              {results.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-300 bg-ink-100/40 px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-ink-500 shadow-sm">
                <PackageSearch className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-ink-900">{t("catalog.noResults")}</h2>
              <p className="mt-1 max-w-sm text-sm text-ink-500">{t("catalog.noResultsBody")}</p>
              <button type="button" onClick={reset} className="btn-primary mt-6">
                {t("catalog.reset")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("catalog.filters")}>
          <button
            type="button"
            className="absolute inset-0 bg-night/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label={t("catalog.closeFilters")}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <span className="text-base font-bold text-ink-900">{t("catalog.filters")}</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-2 text-ink-700 hover:bg-ink-100"
                aria-label={t("catalog.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <FilterPanel {...panelProps} />
            </div>
            <div className="border-t border-ink-100 p-4">
              <button type="button" onClick={() => setDrawerOpen(false)} className="btn-primary w-full">
                {t("catalog.showResults", { n: results.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
