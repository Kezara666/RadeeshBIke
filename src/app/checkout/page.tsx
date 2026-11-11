"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { CheckCircle2, Banknote, Landmark, ArrowLeft, Lock, Upload, X } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { formatLKR } from "@/lib/format";
import { codFeeFor, shippingFor } from "@/lib/order";
import { useI18n } from "@/i18n/i18n-context";
import type { MessageKey } from "@/i18n/messages";

type Payment = "cod" | "bank";

type Form = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  payment: Payment;
};

type FieldKey = keyof Form | "receipt";
type Errors = Partial<Record<FieldKey, MessageKey>>;

const EMPTY: Form = { name: "", email: "", phone: "", address: "", city: "", postal: "", payment: "cod" };

/** Sri Lankan mobile: 07X XXX XXXX, optionally with +94 / 0094 / 94 prefix. */
const SL_MOBILE = /^(\+?94|0)7\d{8}$/;

const RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const RECEIPT_MAX_BYTES = 5 * 1024 * 1024;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "err.name";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "err.email";
  if (!SL_MOBILE.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "err.phone";
  if (f.address.trim().length < 8) e.address = "err.address";
  if (f.city.trim().length < 2) e.city = "err.city";
  if (!/^\d{5}$/.test(f.postal.trim())) e.postal = "err.postal";
  return e;
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const ORDER_KEY = "radeeshbike-last-order-v1";

function makeOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `RB-${stamp}-${rand}`;
}

type Placed = {
  orderId: string;
  total: number;
  itemCount: number;
  email: string;
  payment: Payment;
  fee: number;
  receiptName: string | null;
};

export default function CheckoutPage() {
  const { lines, subtotal, clear, ready } = useCart();
  const { t, text } = useI18n();
  const [form, setForm] = useState<Form>(EMPTY);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const receiptInput = useRef<HTMLInputElement>(null);

  const shipping = shippingFor(subtotal);
  const fee = codFeeFor(subtotal, form.payment === "cod");
  const total = subtotal + shipping + fee;
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const chooseReceipt = (file: File | null) => {
    if (!file) {
      setReceipt(null);
      return;
    }
    if (!RECEIPT_TYPES.includes(file.type)) {
      setReceipt(null);
      setErrors((prev) => ({ ...prev, receipt: "err.receiptType" }));
      return;
    }
    if (file.size > RECEIPT_MAX_BYTES) {
      setReceipt(null);
      setErrors((prev) => ({ ...prev, receipt: "err.receiptSize" }));
      return;
    }
    setReceipt(file);
    setErrors((prev) => ({ ...prev, receipt: undefined }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found: Errors = validate(form);
    if (form.payment === "bank" && !receipt) found.receipt = errors.receipt ?? "err.receipt";
    setErrors(found);
    const firstInvalid = Object.keys(found)[0] as FieldKey | undefined;
    if (firstInvalid) {
      const target = firstInvalid === "receipt" ? "receipt-input" : firstInvalid;
      document.getElementById(target)?.focus();
      return;
    }

    setSubmitting(true);
    const orderId = makeOrderId();
    const order: Placed = {
      orderId,
      total,
      itemCount,
      email: form.email.trim(),
      payment: form.payment,
      fee,
      receiptName: receipt?.name ?? null,
    };

    try {
      window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      // Storage unavailable; the confirmation still shows.
    }

    clear();
    setPlaced(order);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <div className="container-page flex flex-col items-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-900">{t("checkout.thanks")}</h1>
        <p className="mt-2 max-w-md text-ink-500">
          {t("checkout.placedBody", { id: placed.orderId, email: placed.email })}
        </p>
        <div className="card mt-8 w-full max-w-sm divide-y divide-ink-100 text-start text-sm">
          <div className="flex justify-between p-4"><span className="text-ink-500">{t("checkout.items")}</span><span className="font-medium">{placed.itemCount}</span></div>
          {placed.fee > 0 && (
            <div className="flex justify-between p-4"><span className="text-ink-500">{t("checkout.codFee")}</span><span className="font-medium">{formatLKR(placed.fee)}</span></div>
          )}
          <div className="flex justify-between p-4"><span className="text-ink-500">{t("cart.total")}</span><span className="font-semibold">{formatLKR(placed.total)}</span></div>
          <div className="flex justify-between p-4"><span className="text-ink-500">{t("checkout.paymentLabel")}</span><span className="font-medium">{t(placed.payment === "cod" ? "checkout.cod" : "checkout.bank")}</span></div>
          {placed.receiptName && (
            <div className="flex justify-between gap-4 p-4"><span className="text-ink-500">{t("checkout.receiptTitle")}</span><span className="truncate font-medium">{placed.receiptName}</span></div>
          )}
        </div>
        <Link href="/products" className="btn-primary mt-8">{t("cart.continue")}</Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="container-page py-12" aria-busy="true">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-ink-100" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t("checkout.emptyTitle")}</h1>
        <p className="mt-2 text-ink-500">{t("checkout.emptyBody")}</p>
        <Link href="/products" className="btn-primary mt-8">{t("checkout.browse")}</Link>
      </div>
    );
  }

  const field = (id: keyof Form, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        name={id}
        value={form[id] as string}
        onChange={(e) => set(id, e.target.value as Form[typeof id])}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        className={`input ${errors[id] ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100" : ""}`}
        {...props}
      />
      {errors[id] && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{t(errors[id]!)}</p>
      )}
    </div>
  );

  const PAYMENTS: { value: Payment; label: string; hint: string; icon: typeof Banknote }[] = [
    { value: "cod", label: t("checkout.cod"), hint: t("checkout.codHint"), icon: Banknote },
    { value: "bank", label: t("checkout.bank"), hint: t("checkout.bankHint"), icon: Landmark },
  ];

  return (
    <div className="container-page py-8 sm:py-12">
      <Link href="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /> {t("checkout.back")}
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{t("checkout.title")}</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="card p-6 sm:p-8" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-lg font-bold text-ink-900">{t("checkout.contact")}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {field("name", t("checkout.name"), { autoComplete: "name" })}
              {field("phone", t("checkout.phone"), { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: t("checkout.phoneHint") })}
              <div className="sm:col-span-2">
                {field("email", t("checkout.email"), { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
              </div>
            </div>
          </section>

          <section className="card p-6 sm:p-8" aria-labelledby="address-heading">
            <h2 id="address-heading" className="text-lg font-bold text-ink-900">{t("checkout.address")}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">{t("checkout.street")}</label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "address-error" : undefined}
                  autoComplete="street-address"
                  className={`input resize-none ${errors.address ? "border-rose-500" : ""}`}
                />
                {errors.address && <p id="address-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{t(errors.address)}</p>}
              </div>
              {field("city", t("checkout.city"), { autoComplete: "address-level2" })}
              {field("postal", t("checkout.postal"), { inputMode: "numeric", autoComplete: "postal-code", maxLength: 5 })}
            </div>
          </section>

          <section className="card p-6 sm:p-8" aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="text-lg font-bold text-ink-900">{t("checkout.payment")}</h2>
            <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
              <legend className="sr-only">{t("checkout.paymentLegend")}</legend>
              {PAYMENTS.map(({ value, label, hint, icon: Icon }) => {
                const checked = form.payment === value;
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                      checked
                        ? "border-brand-600 bg-brand-50 ring-4 ring-brand-100 dark:bg-brand-950/50 dark:ring-brand-950"
                        : "border-ink-300 hover:border-ink-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={checked}
                      onChange={() => set("payment", value)}
                      className="mt-1 h-4 w-4 accent-brand-600"
                    />
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-semibold text-ink-900">
                        <Icon className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" /> {label}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-500">{hint}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            {form.payment === "bank" && (
              <div className="mt-6 rounded-xl border border-dashed border-ink-300 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-ink-900">
                  <Upload className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" /> {t("checkout.receiptTitle")}
                </h3>
                <p className="mt-1 text-xs text-ink-500">{t("checkout.receiptNote")}</p>
                <p className="mt-1 text-xs text-ink-500">{t("checkout.receiptHint")}</p>

                <input
                  id="receipt-input"
                  ref={receiptInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="sr-only"
                  onChange={(e) => chooseReceipt(e.target.files?.[0] ?? null)}
                  aria-describedby={errors.receipt ? "receipt-error" : undefined}
                  aria-invalid={!!errors.receipt}
                />

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {receipt ? (
                    <>
                      <span className="text-sm text-ink-700">
                        {t("checkout.receiptSelected", { name: receipt.name, size: formatSize(receipt.size) })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          chooseReceipt(null);
                          if (receiptInput.current) receiptInput.current.value = "";
                        }}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:underline dark:text-rose-400"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" /> {t("checkout.receiptRemove")}
                      </button>
                    </>
                  ) : (
                    <label htmlFor="receipt-input" className="btn-secondary cursor-pointer !py-2.5">
                      <Upload className="h-4 w-4" aria-hidden="true" /> {t("checkout.receiptChoose")}
                    </label>
                  )}
                </div>
                {errors.receipt && (
                  <p id="receipt-error" className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">{t(errors.receipt)}</p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900">{t("checkout.orderTitle", { n: itemCount })}</h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pe-1 text-sm">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <span className="min-w-0 text-ink-700">
                    <span className="line-clamp-1">{text(product).name}</span>
                    <span className="text-xs text-ink-500">× {qty}</span>
                  </span>
                  <span className="shrink-0 font-medium text-ink-900">{formatLKR(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-ink-100 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-ink-700">{t("cart.subtotal")}</dt><dd className="text-ink-900">{formatLKR(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-700">{t("cart.shipping")}</dt><dd className="text-ink-900">{shipping === 0 ? t("cart.free") : formatLKR(shipping)}</dd></div>
              {fee > 0 && (
                <div className="flex justify-between"><dt className="text-ink-700">{t("checkout.codFee")}</dt><dd className="text-ink-900">{formatLKR(fee)}</dd></div>
              )}
            </dl>
            <div className="mt-4 flex justify-between border-t border-ink-100 pt-4">
              <span className="font-semibold text-ink-900">{t("cart.total")}</span>
              <span className="text-xl font-extrabold text-ink-900">{formatLKR(total)}</span>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full !py-3.5">
              <Lock className="h-4 w-4" aria-hidden="true" /> {submitting ? t("checkout.placing") : t("checkout.place")}
            </button>
            <p className="mt-3 text-center text-xs text-ink-500">{t("checkout.privacy")}</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
