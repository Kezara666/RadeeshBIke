import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog-view";

export const metadata: Metadata = {
  title: "All Spare Parts",
  description: "Browse and filter bike spare parts by category, brand, bike type, price and rating.",
};

function CatalogFallback() {
  return (
    <div className="container-page py-10" aria-busy="true" aria-label="Loading products">
      <div className="mb-6 h-9 w-64 animate-pulse rounded-xl bg-ink-100" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-80 animate-pulse bg-ink-100/60" />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogView />
    </Suspense>
  );
}
