"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  BicycleIcon,
  CaretDownIcon,
  ForkKnifeIcon,
  MagnifyingGlassIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MdLayout } from "@/hooks/use-md-layout";
import type { DiscoveryCategoryId } from "@/types/search";
import { cn } from "@/lib/utils";

/** Filter modals (cuisine / more) — bottom sheet on mobile, dialog on desktop. */
export const discoveryFilterModalSheetClass =
  "flex h-auto max-h-[min(88dvh,40rem)] flex-col !gap-0 rounded-t-ds-16 border-t-[0.5px] border-border bg-popover p-0 text-popover-foreground shadow-lg";
export const discoveryFilterModalSheetHeader = "border-b-[0.5px] border-border p-4 text-left";
export const discoveryFilterModalTitleClass = "text-base font-semibold text-foreground";

export const discoverySearchOptionList = "max-h-[min(50vh,320px)] overflow-y-auto p-2";
export const discoverySearchOptionRow =
  "flex w-full items-center gap-3 rounded-search-inner px-4 py-2.5 text-left text-sm font-normal leading-snug text-foreground transition-colors";
export const discoverySearchOptionSelected = "bg-ds-blue-600/15 font-medium text-foreground";
export const discoverySearchOptionIdle = "hover:bg-interactive-hover";

export const discoveryPillBaseClass =
  "inline-flex min-h-10 max-w-full shrink-0 items-center gap-2 rounded-ds-full bg-background px-4 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
export const discoveryPillActiveClass = "bg-ds-blue-600/15 text-ds-blue-600";

export function DiscoveryHeaderFieldTrigger({
  label,
  value,
  valueTitle,
  icon,
  className,
  disabled,
  showCaret = true,
  "aria-label": ariaLabelProp,
  ...props
}: ComponentProps<"button"> & {
  label: string;
  value: string;
  /** Full string for tooltip / screen readers when `value` is visually truncated. */
  valueTitle?: string;
  icon?: ReactNode;
  showCaret?: boolean;
}) {
  const title = valueTitle?.trim() || value;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(discoveryPillBaseClass, className)}
      aria-label={ariaLabelProp ?? `${label}, ${title}`}
      {...props}
    >
      {icon != null ? <span className="shrink-0 text-inherit">{icon}</span> : null}
      <span
        title={title.length > value.length ? title : undefined}
        className="min-w-0 flex-1 truncate text-left text-sm font-semibold leading-tight text-inherit"
      >
        {value}
      </span>
      {showCaret ? (
        <CaretDownIcon className="size-4 shrink-0 text-inherit" aria-hidden weight="bold" />
      ) : null}
    </button>
  );
}

export function DiscoveryHeaderCategoryIcon({ id }: { id: DiscoveryCategoryId }) {
  const cls = "size-5 shrink-0 text-foreground";
  switch (id) {
    case "all":
      return <MagnifyingGlassIcon className={cls} weight="regular" aria-hidden />;
    case "delivery":
      return <BicycleIcon className={cls} weight="regular" aria-hidden />;
    case "reservations":
      return <ForkKnifeIcon className={cls} weight="regular" aria-hidden />;
    case "pickup":
      return <StorefrontIcon className={cls} weight="regular" aria-hidden />;
    default: {
      const _e: never = id;
      return _e;
    }
  }
}

export function DiscoveryHeaderCheckboxRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-search-inner px-2 py-2 text-sm text-foreground transition-colors hover:bg-interactive-hover"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="size-4 shrink-0 rounded border-input text-ds-blue-600 focus-visible:ring-2 focus-visible:ring-ring"
      />
      <span className="min-w-0 leading-snug">{label}</span>
    </label>
  );
}

export function DiscoveryHeaderModalFooter({
  clearLabel,
  applyLabel,
  onClear,
  onApply,
}: {
  clearLabel: string;
  applyLabel: string;
  onClear: () => void;
  onApply: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-between">
      <Button type="button" variant="ghost" className="rounded-ds-10 sm:min-w-0" onClick={onClear}>
        {clearLabel}
      </Button>
      <Button type="button" variant="default" className="rounded-ds-10" onClick={onApply}>
        {applyLabel}
      </Button>
    </div>
  );
}

export function DiscoveryHeaderFilterModalShell({
  layout,
  open,
  onOpenChange,
  title,
  children,
  footer,
}: {
  layout: MdLayout;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  if (layout === "pending") return null;

  if (layout === "mobile") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={discoveryFilterModalSheetClass}
          data-search-dropdown="sheet"
        >
          <SheetHeader className={discoveryFilterModalSheetHeader}>
            <SheetTitle className={discoveryFilterModalTitleClass}>{title}</SheetTitle>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">{children}</div>
            {footer}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(90vh,720px)] w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogHeader className="border-b border-border p-4 text-left">
          <DialogTitle className={discoveryFilterModalTitleClass}>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
        {footer}
      </DialogContent>
    </Dialog>
  );
}
