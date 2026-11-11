"use client";

import { useState, type ReactNode } from "react";

/**
 * Image that shows a pulsing skeleton while it loads, fades in when ready,
 * and renders `fallback` if the file cannot be loaded.
 */
export function SkeletonImage({
  src,
  alt,
  className = "",
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
}) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  if (state === "error") return <>{fallback}</>;

  return (
    <div className={`relative overflow-hidden bg-ink-100 ${className}`}>
      {state === "loading" && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-gradient-to-r from-ink-100 via-surface to-ink-100" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          state === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
