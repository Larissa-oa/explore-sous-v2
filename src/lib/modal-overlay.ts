import { cn } from "@/lib/utils";

/**
 * Modal scrim tokens and helpers for `Dialog` / `Sheet` primitives.
 * Prefer `DialogContent` / `SheetContent` (default full scrim) over custom overlay markup.
 */

export interface ModalScrimProps {
  /**
   * When `false`, overlay stays below the sticky navbar (`--z-site-navbar`).
   * Only the explore mega menu sheet should opt out.
   */
  scrimAboveNavbar?: boolean;
}

export const MODAL_OVERLAY_BASE_CLASS =
  "fixed inset-0 duration-100 supports-backdrop-filter:backdrop-blur-xs";

export const MODAL_DIALOG_OVERLAY_MOTION_CLASS =
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0";

export const MODAL_SHEET_OVERLAY_MOTION_CLASS =
  "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0";

/** Full-viewport scrim above the sticky navbar (site default). */
export const MODAL_FULL_SCRIM_CLASS =
  "z-[var(--z-modal-scrim)] bg-[var(--ds-alpha-black-55)]";

export const MODAL_FULL_SCRIM_PANEL_CLASS = "z-[var(--z-modal-panel)]";

/** Dialog overlay when {@link ModalScrimProps.scrimAboveNavbar} is false. */
export const MODAL_DIALOG_OPT_OUT_SCRIM_CLASS =
  "z-50 bg-[var(--ds-alpha-black-50)]";

/** Sheet overlay when {@link ModalScrimProps.scrimAboveNavbar} is false (mega menu). */
export const MODAL_SHEET_OPT_OUT_SCRIM_CLASS = "z-50 bg-[var(--ds-alpha-black-10)]";

const MODAL_PANEL_OPT_OUT_CLASS = "z-50";

export function modalOverlayScrimClass(
  scrimAboveNavbar: boolean,
  variant: "dialog" | "sheet",
  className?: string,
): string {
  const scrim = scrimAboveNavbar
    ? MODAL_FULL_SCRIM_CLASS
    : variant === "dialog"
      ? MODAL_DIALOG_OPT_OUT_SCRIM_CLASS
      : MODAL_SHEET_OPT_OUT_SCRIM_CLASS;

  const motion =
    variant === "dialog"
      ? MODAL_DIALOG_OVERLAY_MOTION_CLASS
      : MODAL_SHEET_OVERLAY_MOTION_CLASS;

  return cn(MODAL_OVERLAY_BASE_CLASS, scrim, motion, className);
}

export function modalPanelScrimClass(
  scrimAboveNavbar: boolean,
  className?: string,
): string {
  return cn(
    scrimAboveNavbar ? MODAL_FULL_SCRIM_PANEL_CLASS : MODAL_PANEL_OPT_OUT_CLASS,
    className,
  );
}
