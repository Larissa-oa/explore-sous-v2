"use client";

import { useEffect, useState } from "react";

/** `md` breakpoint (768px): popover vs bottom sheet for search-style pickers. */
export type MdLayout = "pending" | "desktop" | "mobile";

export function useMdLayout(): MdLayout {
  const [layout, setLayout] = useState<MdLayout>("pending");
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setLayout(mq.matches ? "desktop" : "mobile");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return layout;
}
