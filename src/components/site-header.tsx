"use client";

import Link from "next/link";
import { useState } from "react";
import { Bike, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useI18n } from "@/i18n/i18n-context";
import { LanguageToggle, ThemeToggle } from "@/components/preferences-toggles";
import { CATEGORIES } from "@/data/catalog";

export function SiteHeader() {
  const { count, ready } = useCart();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/garage", label: t("nav.garage") },
    { href: "/products", label: t("nav.allParts") },
    { href: "/products?sale=1", label: t("nav.deals") },
    { href: "/products?sort=rating", label: t("nav.topRated") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-surface/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-night focus:px-4 focus:py-2 focus:text-white"
      >
        {t("nav.skip")}
      </a>

      <div className="container-page flex h-16 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-700 hover:bg-ink-100 lg:hidden"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
            <Bike className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-extrabold tracking-tight text-ink-900">RadeeshBike</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">Accesorios</span>
          </span>
        </Link>

        <nav aria-label={t("nav.primary")} className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/products" role="search" className="ml-auto hidden flex-1 md:flex md:max-w-md lg:ml-4">
          <label htmlFor="header-search" className="sr-only">
            {t("nav.searchLabel")}
          </label>
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder={t("nav.searchDesktop")}
              className="input h-11 rounded-full bg-ink-100 pl-10 focus:bg-surface"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:ml-0">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-sm font-semibold text-ink-900 transition hover:bg-ink-100 sm:px-3"
            aria-label={t("nav.cartAria", { n: ready ? count : 0 })}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">{t("nav.cart")}</span>
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white ring-2 ring-surface">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <form action="/products" role="search" className="container-page pb-3 md:hidden">
        <label htmlFor="mobile-search" className="sr-only">
          {t("nav.searchLabel")}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          <input
            id="mobile-search"
            name="q"
            type="search"
            placeholder={t("nav.searchMobile")}
            className="input h-11 rounded-full bg-ink-100 pl-10 focus:bg-surface"
          />
        </div>
      </form>

      {open && (
        <div id="mobile-menu" className="border-t border-ink-100 bg-surface lg:hidden">
          <nav aria-label={t("nav.mobile")} className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-ink-500">{t("nav.categories")}</p>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/products?cat=${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-ink-700 hover:bg-ink-100"
              >
                {t(`cat.${c.slug}`)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
