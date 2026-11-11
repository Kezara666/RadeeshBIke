"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Tag, Wrench } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { useI18n } from "@/i18n/i18n-context";
import { CategoryIcon } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const { t } = useI18n();

  const featured = PRODUCTS.filter((p) => p.badge === "Bestseller" || p.rating >= 4.6)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const deals = PRODUCTS.filter((p) => p.mrp > p.price)
    .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
    .slice(0, 4);
  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, PRODUCTS.filter((p) => p.category === c.slug).length]),
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,rgba(249,115,22,0.35),transparent),radial-gradient(40%_60%_at_0%_100%,rgba(234,88,12,0.25),transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]"
        />

        <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t("home.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {t("home.titleA")}{" "}
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">{t("home.titleB")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{t("home.body")}</p>

            <Link
              href="/garage"
              className="btn-primary mt-8 h-14 px-7 text-base"
            >
              <Wrench className="h-5 w-5" aria-hidden="true" />
              {t("home.garageCta")}
              <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </Link>

          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: `${PRODUCTS.length}+`, label: t("home.statParts") },
              { value: `${CATEGORIES.length}`, label: t("home.statCats") },
              { value: "4.6★", label: t("home.statRating") },
              { value: "24h", label: t("home.statDispatch") },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-20" aria-labelledby="categories-heading">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{t("home.browse")}</p>
            <h2 id="categories-heading" className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">
              {t("home.categories")}
            </h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-300">
            {t("home.viewAllParts")} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/products?cat=${c.slug}`}
                className="group card flex h-full flex-col gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5 dark:hover:border-brand-900"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950/60 dark:text-brand-300">
                  <CategoryIcon category={c.slug} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-ink-900">{t(`cat.${c.slug}`)}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500">{t(`catdesc.${c.slug}`)}</p>
                </div>
                <p className="mt-auto text-xs font-semibold text-ink-500">{t("home.productCount", { n: categoryCounts[c.slug] })}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Deals */}
      <section className="bg-brand-50/60 py-20 dark:bg-brand-950/30" aria-labelledby="deals-heading">
        <div className="container-page">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" /> {t("home.limited")}
              </p>
              <h2 id="deals-heading" className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">
                {t("home.deals")}
              </h2>
            </div>
            <Link href="/products?sale=1" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-300">
              {t("home.allDeals")} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
            {deals.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-20" aria-labelledby="featured-heading">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{t("home.favEyebrow")}</p>
          <h2 id="featured-heading" className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">
            {t("home.topRated")}
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          {featured.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center text-white shadow-2xl shadow-brand-900/20 sm:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("home.ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">{t("home.ctaBody")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {(["Sport", "Commuter", "Scooter", "Off-road"] as const).map((b) => (
              <Link
                key={b}
                href={`/products?bike=${encodeURIComponent(b)}`}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                {t("bike.suffix", { type: t(`bike.${b}`) })}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
