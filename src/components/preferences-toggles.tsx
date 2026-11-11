"use client";

import { Moon, Sun, Languages } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { useTheme } from "@/components/theme-context";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? t("theme.toLight") : t("theme.toDark");

  return (
    <button
      type="button"
      data-theme-toggle
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-700 transition hover:bg-ink-100 hover:text-ink-900 ${className}`}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const target = lang === "en" ? "si" : "en";
  const targetName = t(target === "si" ? "lang.si" : "lang.en");
  const label = t("lang.switch", { lang: targetName });

  return (
    <button
      type="button"
      data-lang-toggle
      onClick={() => setLang(target)}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-ink-300 px-3 text-xs font-bold text-ink-700 transition hover:border-ink-500 hover:text-ink-900 ${className}`}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{targetName}</span>
      <span className="sm:hidden" lang={target}>{t(target === "si" ? "lang.shortSi" : "lang.shortEn")}</span>
    </button>
  );
}
