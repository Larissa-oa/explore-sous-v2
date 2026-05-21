"use client";

import type { ReactNode } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { MdLayout } from "@/hooks/use-md-layout";
import { cn } from "@/lib/utils";

/** Shared popover shell for home + discovery search pickers. */
export const SEARCH_PICKER_POPOVER_CLASS =
  "rounded-ds-12 border-[0.5px] border-border bg-popover text-popover-foreground shadow-[0_1px_3px_var(--ds-alpha-black-8)] ring-0";

const sheetHeaderClass = "border-b-[0.5px] border-border p-4 text-left";
const sheetTitleClass = "text-base font-semibold text-foreground";

const sheetOuterClass = {
  /** Homepage hero search bar — taller sheet on mobile. */
  home: "h-auto max-h-[85vh] rounded-t-ds-16 border-t-[0.5px] border-border bg-popover p-0 text-popover-foreground shadow-lg",
  /** Discovery sticky bar — compact sheet. */
  discovery:
    "flex h-auto max-h-[min(88dvh,40rem)] flex-col !gap-0 rounded-t-ds-16 border-t-[0.5px] border-border bg-popover p-0 text-popover-foreground shadow-lg",
} as const;

const sheetPanelClass = {
  home: "min-h-0 px-0 pb-4",
  discovery: "min-h-0 flex-1 overflow-y-auto",
} as const;

export type SearchPickerWrapVariant = keyof typeof sheetOuterClass;

export interface SearchPickerWrapProps {
  variant: SearchPickerWrapVariant;
  layout: MdLayout;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  panel: ReactNode;
  sheetTitle: string;
  popoverWidthClass: string;
  /** Merged into the mobile sheet outer (e.g. min-height on home). */
  sheetContentClassName?: string;
}

/**
 * Desktop: anchored popover. Mobile: bottom sheet.
 * Same behaviour for homepage search and discovery filters.
 */
export function SearchPickerWrap({
  variant,
  layout,
  open,
  onOpenChange,
  trigger,
  panel,
  sheetTitle,
  popoverWidthClass,
  sheetContentClassName,
}: SearchPickerWrapProps) {
  if (layout === "desktop") {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          className={cn(SEARCH_PICKER_POPOVER_CLASS, "flex flex-col overflow-hidden p-0", popoverWidthClass)}
          align="start"
          sideOffset={8}
        >
          {panel}
        </PopoverContent>
      </Popover>
    );
  }

  if (layout === "mobile") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side="bottom"
          className={cn(sheetOuterClass[variant], sheetContentClassName)}
          data-search-dropdown="sheet"
        >
          <SheetHeader className={sheetHeaderClass}>
            <SheetTitle className={sheetTitleClass}>{sheetTitle}</SheetTitle>
          </SheetHeader>
          <div className={sheetPanelClass[variant]}>{panel}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return trigger;
}
