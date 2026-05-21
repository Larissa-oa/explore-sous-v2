"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SITE_HOME_HERO_ELEMENT_ID } from "@/lib/site-layout";
import { cn } from "@/lib/utils";

/** Replay tile animation when user returns near the top after scrolling the hero away. */
const REPLAY_SCROLL_TOP_PX = 420;
const REPLAY_COOLDOWN_MS = 1400;
const REPLAY_HERO_TOP_EDGE_MAX_PX = 120;

type Cycle = 0 | 1;

const HeroFloatingCycleContext = createContext<Cycle>(0);

/**
 * Toggles `data-hero-tile-cycle` so CSS keyframes in `globals.css` replay; initial load runs cycle `0` automatically.
 */
export function HomeHeroFloatingMotionProvider({ children }: { children: ReactNode }) {
  const [cycle, setCycle] = useState<Cycle>(0);
  const heroWasOffscreenRef = useRef(false);
  const lastReplayAtRef = useRef(0);

  const tryReplay = useCallback(() => {
    const now = Date.now();
    if (now - lastReplayAtRef.current < REPLAY_COOLDOWN_MS) return;
    lastReplayAtRef.current = now;
    setCycle((c) => (c === 0 ? 1 : 0));
  }, []);

  useEffect(() => {
    const hero = document.getElementById(SITE_HOME_HERO_ELEMENT_ID);
    if (!hero) return;

    const markOffscreen = () => {
      const rect = hero.getBoundingClientRect();
      const pastBelow = rect.top > window.innerHeight + 80;
      const pastAbove = rect.bottom < -120;
      if (pastBelow || pastAbove) {
        heroWasOffscreenRef.current = true;
      }
    };

    const onScroll = () => {
      markOffscreen();
      if (!heroWasOffscreenRef.current) return;

      const rect = hero.getBoundingClientRect();
      const nearPageTop = window.scrollY < REPLAY_SCROLL_TOP_PX;
      const heroBackNearViewportTop =
        rect.top > -REPLAY_HERO_TOP_EDGE_MAX_PX && rect.top < window.innerHeight * 0.55;

      if (nearPageTop && heroBackNearViewportTop) {
        tryReplay();
        heroWasOffscreenRef.current = false;
      }
    };

    markOffscreen();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tryReplay]);

  return <HeroFloatingCycleContext.Provider value={cycle}>{children}</HeroFloatingCycleContext.Provider>;
}

/** `display: contents` — keeps flex order; `data-hero-tile-cycle` restarts CSS animation on replay. */
export function HomeHeroFloatingMosaic({ children, className }: { children: ReactNode; className?: string }) {
  const cycle = useContext(HeroFloatingCycleContext);

  return (
    <div className={cn("hero-floating-mosaic contents", className)} data-hero-tile-cycle={cycle}>
      {children}
    </div>
  );
}
