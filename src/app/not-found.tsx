"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/i18n-context";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900">{t("notfound.title")}</h1>
      <p className="mt-3 max-w-md text-ink-500">{t("notfound.body")}</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-secondary">{t("notfound.home")}</Link>
        <Link href="/products" className="btn-primary">{t("notfound.browse")}</Link>
      </div>
    </div>
  );
}
