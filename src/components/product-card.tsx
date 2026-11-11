"use client";

import Link from "next/link";
import { discountPercent, getCategory, type Product } from "@/data/catalog";
import { formatLKR } from "@/lib/format";
import { useI18n } from "@/i18n/i18n-context";
import { ProductArt, Stars } from "@/components/product-art";
import { AddToCartButton } from "@/components/add-to-cart-button";

const BADGE_STYLES = {
  New: "bg-sky-600 text-white",
  Bestseller: "bg-amber-400 text-slate-900",
  Sale: "bg-rose-600 text-white",
} as const;

export function ProductCard({ product }: { product: Product }) {
  const { t, text } = useI18n();
  const category = getCategory(product.category);
  const copy = text(product);
  const off = discountPercent(product);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <article className="group card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/5">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={t("card.view", { name: copy.name })}
      >
        <ProductArt
          category={product.category}
          image={product.image}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}>
              {t(`badge.${product.badge}`)}
            </span>
          )}
          {off > 0 && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-rose-600 shadow-sm">
              {t("card.off", { n: off })}
            </span>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/60 backdrop-blur-[1px]">
            <span className="rounded-full bg-night px-4 py-1.5 text-xs font-semibold text-white">{t("card.outOfStock")}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">{product.brand}</span>
          {category && <span className="truncate text-ink-500">{t(`cat.${category.slug}`)}</span>}
        </div>

        <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-ink-900">
          <Link href={`/products/${product.slug}`} className="hover:text-brand-700 dark:hover:text-brand-300">
            {copy.name}
          </Link>
        </h3>

        <Stars rating={product.rating} reviews={product.reviews} />

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-base font-bold text-ink-900 sm:text-lg">{formatLKR(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-ink-500 line-through">{formatLKR(product.mrp)}</span>
              )}
            </div>
            {lowStock && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{t("card.lowStock", { n: product.stock })}</p>
            )}
          </div>
          <AddToCartButton productId={product.id} size="sm" disabled={outOfStock} className="w-full" />
        </div>
      </div>
    </article>
  );
}
