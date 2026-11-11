"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { PRODUCT_SI, type ProductTranslation } from "@/data/catalog-si";
import type { Product } from "@/data/catalog";
import { en, si, type MessageKey } from "@/i18n/messages";

export type Lang = "en" | "si";

const STORAGE_KEY = "radeeshbike-lang";
let cache: Lang | null = null;
const listeners = new Set<() => void>();

function readLang(): Lang {
  if (cache === null) {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      cache = v === "si" ? "si" : "en";
    } catch {
      cache = "en";
    }
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function writeLang(lang: Lang) {
  cache = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  listeners.forEach((l) => l());
}

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a UI string, filling {placeholders} from `vars`. */
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  /** Localised product copy (falls back to English). */
  text: (product: Product) => ProductTranslation;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);

  const value = useMemo<I18nValue>(() => {
    const dict = lang === "si" ? si : en;
    return {
      lang,
      setLang,
      t: (key, vars) => {
        let s: string = dict[key] ?? en[key];
        if (vars) {
          for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
        }
        return s;
      },
      text: (product) => {
        if (lang === "si" && PRODUCT_SI[product.id]) return PRODUCT_SI[product.id];
        return { name: product.name, description: product.description, features: product.features };
      },
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
