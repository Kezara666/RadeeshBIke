"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useI18n } from "@/i18n/i18n-context";

export function AddToCartButton({
  productId,
  qty = 1,
  disabled = false,
  size = "md",
  className = "",
}: {
  productId: string;
  qty?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const { add } = useCart();
  const { t } = useI18n();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = () => {
    add(productId, qty);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  const sizing = size === "sm" ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-live="polite"
      className={`btn-primary ${sizing} ${justAdded ? "!bg-emerald-600 hover:!bg-emerald-700" : ""} ${className}`}
    >
      {justAdded ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
      {disabled ? t("card.outOfStock") : justAdded ? t("cart.added") : t("cart.add")}
    </button>
  );
}
