"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { ListingCardSurface } from "@/types/listing-card";

const Ctx = createContext<ListingCardSurface | undefined>(undefined);

export function ListingRailCardSurfaceProvider({
  surface,
  children,
}: {
  surface: ListingCardSurface;
  children: ReactNode;
}) {
  return <Ctx.Provider value={surface}>{children}</Ctx.Provider>;
}

export function useOptionalListingRailCardSurface(): ListingCardSurface | undefined {
  return useContext(Ctx);
}
