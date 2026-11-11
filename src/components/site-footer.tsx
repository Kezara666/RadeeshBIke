"use client";

import Link from "next/link";
import { Bike, Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";
import { useI18n } from "@/i18n/i18n-context";

export function SiteFooter() {
  const { t } = useI18n();

  const promises = [
    { icon: Truck, title: t("footer.p1Title"), text: t("footer.p1Text") },
    { icon: ShieldCheck, title: t("footer.p2Title"), text: t("footer.p2Text") },
    { icon: RotateCcw, title: t("footer.p3Title"), text: t("footer.p3Text") },
  ];

  return (
    <footer className="mt-24 bg-night text-slate-300">
      <div className="border-b border-white/10">
        <div className="container-page grid gap-6 py-10 sm:grid-cols-3">
          {promises.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Bike className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="block font-extrabold tracking-tight text-white">RadeeshBike</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">Accesorios</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">{t("footer.tagline")}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{t("footer.shop")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/products?cat=${c.slug}`} className="transition hover:text-white">
                  {t(`cat.${c.slug}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{t("footer.help")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/cart" className="hover:text-white">{t("footer.cart")}</Link></li>
            <li><Link href="/checkout" className="hover:text-white">{t("footer.checkout")}</Link></li>
            <li><Link href="/products?sale=1" className="hover:text-white">{t("footer.deals")}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{t("footer.contact")}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />+94 00 000 0000</li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />support@radeeshbike.example</li>
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />{t("footer.location")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights")}</p>
          <p>{t("footer.tax")}</p>
        </div>
      </div>
    </footer>
  );
}
