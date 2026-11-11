"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Wrench, Sparkles } from "lucide-react";
import { BIKE_BRANDS, BIKE_MODELS, getBike, type BikeModel } from "@/data/bikes";
import { CATEGORIES, PRODUCTS, type GarageGroup, type Product } from "@/data/catalog";
import { useI18n } from "@/i18n/i18n-context";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { BikePhoto } from "@/components/bike-photo";

/** A product fits a bike when it is listed for that bike, or listed for all bikes. */
function fits(p: Product, bike: BikeModel): boolean {
  return !p.models || p.models.includes(bike.id);
}

export function GarageView() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bike = getBike(searchParams.get("bike"));
  const groupParam = searchParams.get("group");
  const group: GarageGroup | null = groupParam === "spare" || groupParam === "modification" ? groupParam : null;
  const subParam = searchParams.get("sub");
  const sub = CATEGORIES.find((c) => c.slug === subParam)?.slug ?? null;

  const go = (params: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
  };

  // Step 1 brand tab (local UI state only; the chosen bike goes in the URL).
  const [brandTab, setBrandTab] = useState<string>(BIKE_BRANDS[0]);

  const modifications = useMemo(
    () => (bike ? PRODUCTS.filter((p) => p.group === "modification" && fits(p, bike)) : []),
    [bike],
  );
  const spares = useMemo(
    () => (bike ? PRODUCTS.filter((p) => p.group === "spare" && fits(p, bike)) : []),
    [bike],
  );
  const items = group === "spare" ? spares : group === "modification" ? modifications : [];
  const visible = sub ? items.filter((p) => p.category === sub) : items;
  const subOptions = CATEGORIES.filter((c) => items.some((p) => p.category === c.slug));

  const bikeLabel = bike ? `${bike.brand} ${bike.name}` : "";

  /* ───────── Step 1: choose bike ───────── */
  if (!bike) {
    const models = BIKE_MODELS.filter((m) => m.brand === brandTab);
    return (
      <div className="container-page py-10 sm:py-14">
        <Header />
        <section aria-labelledby="pick-bike" className="mt-8">
          <h2 id="pick-bike" className="text-sm font-semibold uppercase tracking-wider text-ink-500">
            {t("garage.step1")}
          </h2>

          <div role="tablist" aria-label={t("filter.brand")} className="mt-4 flex flex-wrap gap-2">
            {BIKE_BRANDS.map((b) => {
              const on = b === brandTab;
              return (
                <button
                  key={b}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => setBrandTab(b)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                    on ? "border-night bg-night text-white" : "border-ink-300 bg-surface text-ink-700 hover:border-ink-500"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {models.map((m) => (
              <li key={m.id}>
                <div className="card flex h-full flex-col gap-4 overflow-hidden p-0">
                  <BikePhoto src={m.image} alt={`${m.brand} ${m.name}`} className="aspect-[4/3] w-full" />
                  <div className="flex flex-col gap-4 px-6 pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{m.brand}</p>
                    <h3 className="text-lg font-bold text-ink-900">{m.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => go({ bike: m.id })}
                    className="btn-primary mt-auto w-full"
                    aria-label={`${t("garage.select")} ${m.brand} ${m.name}`}
                  >
                    {t("garage.select")} <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  /* ───────── Step 2: choose group ───────── */
  if (!group) {
    return (
      <div className="container-page py-10 sm:py-14">
        <Header />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <BikePhoto src={bike.image} alt={bikeLabel} className="h-20 w-28 shrink-0 rounded-xl" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t("garage.yourBike")}</p>
              <p className="text-lg font-bold text-ink-900">{bikeLabel}</p>
            </div>
          </div>
          <Link href="/garage" className="btn-secondary !py-2.5">
            {t("garage.change")}
          </Link>
        </div>

        <h2 id="pick-group" className="mt-10 text-sm font-semibold uppercase tracking-wider text-ink-500">
          {t("garage.step2")}
        </h2>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <GroupCard
            title={t("garage.modsTitle")}
            body={t("garage.modsBody")}
            count={t("garage.count", { n: modifications.length })}
            icon={<Sparkles className="h-7 w-7" aria-hidden="true" />}
            products={modifications}
            onClick={() => go({ bike: bike.id, group: "modification" })}
          />
          <GroupCard
            title={t("garage.sparesTitle")}
            body={t("garage.sparesBody")}
            count={t("garage.count", { n: spares.length })}
            icon={<Wrench className="h-7 w-7" aria-hidden="true" />}
            products={spares}
            onClick={() => go({ bike: bike.id, group: "spare" })}
          />
        </div>
      </div>
    );
  }

  /* ───────── Step 3: browse products ───────── */
  const groupTitle = group === "spare" ? t("garage.sparesTitle") : t("garage.modsTitle");

  return (
    <div className="container-page py-10 sm:py-14">
      <Header />

      <nav aria-label={t("common.breadcrumb")} className="mt-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
        <Link href="/garage" className="hover:text-ink-900">{t("garage.crumb")}</Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        <button type="button" onClick={() => go({ bike: bike.id })} className="hover:text-ink-900">{bikeLabel}</button>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        <span aria-current="page" className="font-medium text-ink-900">{groupTitle}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{bikeLabel}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">{groupTitle}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("garage.count", { n: visible.length })}</p>
        </div>
        <button type="button" onClick={() => go({ bike: bike.id })} className="btn-secondary !py-2.5">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /> {t("garage.back")}
        </button>
      </div>

      {subOptions.length > 0 && (
        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <button
            type="button"
            aria-pressed={!sub}
            onClick={() => go({ bike: bike.id, group, sub: null })}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              !sub ? "border-night bg-night text-white" : "border-ink-300 text-ink-700 hover:border-ink-500"
            }`}
          >
            {t("catalog.allChip")}
          </button>
          {subOptions.map((c) => {
            const on = sub === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={on}
                onClick={() => go({ bike: bike.id, group, sub: c.slug })}
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
      )}

      {visible.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
          {visible.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-ink-300 bg-ink-100/40 px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-ink-900">{t("garage.noneTitle")}</h2>
          <p className="mt-1 max-w-md text-sm text-ink-500">
            {t("garage.noneBody", { bike: bikeLabel, group: groupTitle.toLowerCase() })}
          </p>
          <Link href="/products" className="btn-primary mt-6">{t("garage.browseAll")}</Link>
        </div>
      )}
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{t("garage.eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{t("garage.heading")}</h1>
      <p className="mt-3 text-ink-500">{t("garage.subtitle")}</p>
    </div>
  );
}

function GroupCard({
  title,
  body,
  count,
  icon,
  products,
  onClick,
}: {
  title: string;
  body: string;
  count: string;
  icon: ReactNode;
  products: Product[];
  onClick: () => void;
}) {
  const preview = products.slice(0, 3);
  return (
    <button
      type="button"
      onClick={onClick}
      className="card group flex flex-col gap-5 p-6 text-start transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5 dark:hover:border-brand-900"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950/60 dark:text-brand-300">
          {icon}
        </span>
        <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700">{count}</span>
      </div>
      <div>
        <h3 className="text-xl font-bold text-ink-900">{title}</h3>
        <p className="mt-1 text-sm text-ink-500">{body}</p>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2">
        {preview.length > 0
          ? preview.map((p) => (
              <div key={p.id} className="aspect-[4/3] overflow-hidden rounded-xl">
                <ProductArt category={p.category} image={p.image} className="h-full w-full" />
              </div>
            ))
          : [0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] rounded-xl bg-ink-100" />)}
      </div>
    </button>
  );
}
