"use client";

import { Bike as BikeIcon } from "lucide-react";
import { SkeletonImage } from "@/components/skeleton-image";

/** Bike photo with a skeleton while loading and a neutral placeholder if the file is missing. */
export function BikePhoto({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <SkeletonImage
      src={src}
      alt={alt}
      className={className}
      fallback={
        <div
          role="img"
          aria-label={alt}
          className={`flex items-center justify-center bg-gradient-to-br from-ink-100 to-brand-50 text-brand-600 dark:to-brand-950 ${className}`}
        >
          <BikeIcon className="h-1/3 w-1/3 max-h-16 max-w-16" aria-hidden="true" />
        </div>
      }
    />
  );
}
