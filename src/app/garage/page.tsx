import type { Metadata } from "next";
import { Suspense } from "react";
import { GarageView } from "@/components/garage-view";

export const metadata: Metadata = {
  title: "My Garage",
  description: "Choose your bike to see modifications and spare parts that fit it.",
};

export default function GaragePage() {
  return (
    <Suspense fallback={<div className="container-page py-16" aria-busy="true" />}>
      <GarageView />
    </Suspense>
  );
}
