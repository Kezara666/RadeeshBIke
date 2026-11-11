"use client";

import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { discountPercent, getCategory, type Product } from "@/data/catalog";
import { formatLKR } from "@/lib/format";
import { useI18n } from "@/i18n/i18n-context";
import { ProductArt, Stars } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { t, text } = useI18n();
  const copy = text(product);
  const category = getCategory(product.category);
  const off = discountPercent(product);
  const inStock = product.stock > 0;

  const badgeLabel = product.badge ? t(`badge.${product.badge}`) : null;

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label={t("common.breadcrumb")} className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
        <Link href="/" className="hover:text-ink-900">{t("common.home")}</Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        <Link href="/products" className="hover:text-ink-900">{t("common.parts")}</Link>
        {category && (
          <>
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            <Link href={`/products?cat=${category.slug}`} className="hover:text-ink-900">{t(`cat.${category.slug}`)}</Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        <span aria-current="page" className="truncate font-medium text-ink-900">{copy.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Media */}
        <div className="card relative aspect-[4/3] overflow-hidden sm:aspect-square lg:sticky lg:top-40 lg:self-start">
          <ProductArt category={product.category} image={product.image} size="lg" className="h-full w-full" />
          {badgeLabel && (
            <span className="absolute start-4 top-4 rounded-full bg-night px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {badgeLabel}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{copy.name}</h1>
          <div className="mt-3">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-ink-900">{formatLKR(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="pb-1 text-lg text-ink-500 line-through">{formatLKR(product.mrp)}</span>
                <span className="mb-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {t("product.save", { n: off })}
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-500">{t("common.taxes")}</p>

          <p className="mt-4 flex items-center gap-2 text-sm font-medium">
            {inStock ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-emerald-700 dark:text-emerald-400">
                  {product.stock <= 5 ? t("product.lowStock", { n: product.stock }) : t("product.inStock")}
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
                <span className="text-rose-700 dark:text-rose-400">{t("product.outOfStock")}</span>
              </>
            )}
          </p>

          <p className="mt-6 leading-relaxed text-ink-700">{copy.description}</p>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-ink-900">{t("product.compatible")}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.compatibility.map((b) => (
                <span key={b} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                  {t("bike.suffix", { type: t(`bike.${b}`) })}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <ProductPurchase productId={product.id} stock={product.stock} />
          </div>

          <div className="mt-10 border-t border-ink-100 pt-8">
            <h2 className="text-base font-bold text-ink-900">{t("product.features")}</h2>
            <ul className="mt-4 space-y-3">
              {copy.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 border-t border-ink-100 pt-8">
            <h2 className="text-base font-bold text-ink-900">{t("product.specs")}</h2>
            <dl className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-100 text-sm">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 bg-surface px-4 py-3 odd:bg-ink-100/40">
                  <dt className="font-medium text-ink-500">{k}</dt>
                  <dd className="text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-heading">
          <div className="mb-8 flex items-end justify-between">
            <h2 id="related-heading" className="text-2xl font-extrabold tracking-tight text-ink-900">
              {t("product.related")}
            </h2>
            <Link
              href={category ? `/products?cat=${category.slug}` : "/products"}
              className="text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-300"
            >
              {t("product.viewAll")}
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
