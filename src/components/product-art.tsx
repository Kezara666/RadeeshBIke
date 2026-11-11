"use client";

import { Star, Disc3, Cog, CircleDot, Wrench, Lightbulb, ArrowUpDown, Gauge, Droplets, Package, type LucideIcon } from "lucide-react";
import type { CategorySlug } from "@/data/catalog";
import { useI18n } from "@/i18n/i18n-context";
import { SkeletonImage } from "@/components/skeleton-image";

const ICONS: Record<CategorySlug, LucideIcon> = {
  brakes: Disc3,
  drivetrain: Cog,
  tyres: CircleDot,
  engine: Wrench,
  electrical: Lightbulb,
  suspension: ArrowUpDown,
  controls: Gauge,
  care: Droplets,
  accessories: Package,
};

const TINTS: Record<CategorySlug, string> = {
  brakes: "from-rose-100 to-orange-50 text-rose-600 dark:from-rose-950 dark:to-orange-950 dark:text-rose-300",
  drivetrain: "from-amber-100 to-yellow-50 text-amber-700 dark:from-amber-950 dark:to-yellow-950 dark:text-amber-300",
  tyres: "from-slate-200 to-slate-50 text-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-slate-300",
  engine: "from-orange-100 to-brand-50 text-brand-700 dark:from-orange-950 dark:to-brand-950 dark:text-brand-300",
  electrical: "from-yellow-100 to-amber-50 text-yellow-700 dark:from-yellow-950 dark:to-amber-950 dark:text-yellow-300",
  suspension: "from-sky-100 to-cyan-50 text-sky-700 dark:from-sky-950 dark:to-cyan-950 dark:text-sky-300",
  controls: "from-violet-100 to-indigo-50 text-violet-700 dark:from-violet-950 dark:to-indigo-950 dark:text-violet-300",
  care: "from-emerald-100 to-teal-50 text-emerald-700 dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-300",
  accessories: "from-lime-100 to-green-50 text-green-700 dark:from-lime-950 dark:to-green-950 dark:text-green-300",
};

/** Branded placeholder artwork until real product photos are added. */
export function ProductArt({
  category,
  image,
  size = "md",
  className = "",
}: {
  category: CategorySlug;
  /** Sample image path. When set, it replaces the category icon artwork. */
  image?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = ICONS[category];
  const iconSize = size === "lg" ? 96 : size === "md" ? 56 : 40;
  const placeholder = (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${TINTS[category]} ${className}`}
    >
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/40 blur-xl dark:bg-white/5" />
      <Icon width={iconSize} height={iconSize} strokeWidth={1.4} className="relative drop-shadow-sm" />
    </div>
  );

  if (image) {
    return <SkeletonImage src={image} alt="" className={className} fallback={placeholder} />;
  }
  return placeholder;
}

export function CategoryIcon({ category, className = "" }: { category: CategorySlug; className?: string }) {
  const Icon = ICONS[category];
  return <Icon className={className} aria-hidden="true" />;
}

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-1.5 text-xs text-ink-500">
      <span className="flex items-center" role="img" aria-label={t("common.stars", { n: rating })}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            width={13}
            height={13}
            className={n <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-ink-300"}
          />
        ))}
      </span>
      <span className="font-medium text-ink-700">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews.toLocaleString("en-US")})</span>}
    </div>
  );
}
