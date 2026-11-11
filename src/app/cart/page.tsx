"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { ProductArt } from "@/components/product-art";
import { formatLKR } from "@/lib/format";
import { FREE_SHIPPING_OVER, shippingFor } from "@/lib/order";
import { getCategory } from "@/data/catalog";
import { useI18n } from "@/i18n/i18n-context";

export default function CartPage() {
  const { lines, subtotal, setQty, remove, ready } = useCart();
  const { t, text } = useI18n();

  if (!ready) {
    return (
      <div className="container-page py-12" aria-busy="true">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-ink-100" />
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-ink-100/60" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950">
          <ShoppingBag className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink-900">{t("cart.emptyTitle")}</h1>
        <p className="mt-2 max-w-sm text-ink-500">{t("cart.emptyBody")}</p>
        <Link href="/products" className="btn-primary mt-8">
          {t("cart.startShopping")} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_OVER - subtotal;
  const savings = lines.reduce((sum, l) => sum + (l.product.mrp - l.product.price) * l.qty, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100);

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{t("cart.title")}</h1>
      <p className="mt-1 text-sm text-ink-500">{t("cart.items", { n: itemCount })}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <ul className="space-y-4 lg:col-span-2">
          {lines.map(({ product, qty }) => {
            const category = getCategory(product.category);
            const copy = text(product);
            const atMax = qty >= Math.min(10, product.stock);
            return (
              <li key={product.id} className="card flex gap-4 p-4 sm:gap-6 sm:p-5">
                <Link href={`/products/${product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                  <ProductArt category={product.category} image={product.image} size="sm" className="h-full w-full" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">{product.brand}</p>
                      <Link href={`/products/${product.slug}`} className="line-clamp-2 font-semibold text-ink-900 hover:text-brand-700 dark:hover:text-brand-300">
                        {copy.name}
                      </Link>
                      {category && <p className="mt-0.5 text-xs text-ink-500">{t(`cat.${category.slug}`)}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="shrink-0 rounded-lg p-2 text-ink-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      aria-label={t("cart.remove", { name: copy.name })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                    <div className="inline-flex items-center rounded-xl border border-ink-300">
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty - 1)}
                        disabled={qty <= 1}
                        className="flex h-9 w-9 items-center justify-center rounded-s-xl text-ink-700 hover:bg-ink-100 disabled:opacity-40"
                        aria-label={t("product.decrease")}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <output className="w-10 text-center text-sm font-semibold tabular-nums text-ink-900" aria-live="polite">{qty}</output>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty + 1)}
                        disabled={atMax}
                        className="flex h-9 w-9 items-center justify-center rounded-e-xl text-ink-700 hover:bg-ink-100 disabled:opacity-40"
                        aria-label={t("product.increase")}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-end">
                      <p className="text-lg font-bold text-ink-900">{formatLKR(product.price * qty)}</p>
                      {qty > 1 && <p className="text-xs text-ink-500">{t("common.each", { price: formatLKR(product.price) })}</p>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900">{t("cart.summary")}</h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-ink-700">
                <dt>{t("cart.subtotal")}</dt>
                <dd className="font-medium text-ink-900">{formatLKR(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <dt>{t("cart.youSave")}</dt>
                  <dd className="font-medium">− {formatLKR(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-700">
                <dt>{t("cart.shipping")}</dt>
                <dd className="font-medium text-ink-900">{shipping === 0 ? t("cart.free") : formatLKR(shipping)}</dd>
              </div>
            </dl>

            {remaining > 0 ? (
              <div className="mt-5 rounded-xl bg-brand-50 p-3 text-xs text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                <div className="flex items-center gap-2 font-semibold">
                  <Truck className="h-4 w-4 shrink-0" aria-hidden="true" /> {t("cart.freeRemaining", { amount: formatLKR(remaining) })}
                </div>
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t("cart.freeProgressLabel")}
                >
                  <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Truck className="h-4 w-4 shrink-0" aria-hidden="true" /> {t("cart.freeUnlocked")}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-5">
              <span className="font-semibold text-ink-900">{t("cart.total")}</span>
              <span className="text-2xl font-extrabold text-ink-900">{formatLKR(total)}</span>
            </div>
            <p className="mt-1 text-end text-xs text-ink-500">{t("common.taxes")}</p>

            <Link href="/checkout" className="btn-primary mt-6 w-full !py-3.5">
              {t("cart.checkout")} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link href="/products" className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /> {t("cart.continue")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
