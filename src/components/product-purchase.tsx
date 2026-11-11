"use client";

import { useState } from "react";
import { Minus, Plus, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { useI18n } from "@/i18n/i18n-context";

const MAX = 10;

export function ProductPurchase({ productId, stock }: { productId: string; stock: number }) {
  const { t } = useI18n();
  const [qty, setQty] = useState(1);
  const outOfStock = stock <= 0;
  const maxQty = Math.min(MAX, stock);

  return (
    <div className="space-y-5">
      {!outOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-ink-700">{t("product.quantity")}</span>
          <div className="inline-flex items-center rounded-xl border border-ink-300">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-s-xl text-ink-700 hover:bg-ink-100 disabled:opacity-40"
              aria-label={t("product.decrease")}
            >
              <Minus className="h-4 w-4" />
            </button>
            <output className="w-12 text-center text-sm font-semibold tabular-nums text-ink-900" aria-live="polite">
              {qty}
            </output>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              disabled={qty >= maxQty}
              className="flex h-11 w-11 items-center justify-center rounded-e-xl text-ink-700 hover:bg-ink-100 disabled:opacity-40"
              aria-label={t("product.increase")}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <AddToCartButton productId={productId} qty={qty} disabled={outOfStock} className="flex-1 !py-3.5" />
      </div>

      <ul className="grid gap-3 rounded-2xl bg-ink-100/60 p-4 text-sm text-ink-700 sm:grid-cols-3">
        <li className="flex items-center gap-2.5"><Truck className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{t("product.dispatch")}</li>
        <li className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{t("product.genuine")}</li>
        <li className="flex items-center gap-2.5"><RotateCcw className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{t("product.returns")}</li>
      </ul>
    </div>
  );
}
