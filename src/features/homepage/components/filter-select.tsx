"use client";

import { useEffect, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  placeholder: string;
  options: FilterOption[];
  value: string | null;
  onValueChange: (value: string) => void;
  className?: string;
}

function OptionsList({
  options,
  value,
  onSelect,
}: {
  options: FilterOption[];
  value: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <ul className="max-h-[min(60vh,320px)] overflow-y-auto py-1" role="listbox">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <li key={opt.value} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              className={cn(
                "flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors",
                selected
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted hover:text-foreground",
              )}
              onClick={() => onSelect(opt.value)}
            >
              {opt.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  className,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<"pending" | "desktop" | "mobile">("pending");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setLayout(mq.matches ? "desktop" : "mobile");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const onSelect = (v: string) => {
    onValueChange(v);
    setOpen(false);
  };

  const display = options.find((o) => o.value === value)?.label ?? placeholder;

  const triggerClass = cn(
    "flex h-11 w-full min-w-[8rem] items-center justify-between gap-2 rounded-ds-8 border border-input bg-background px-3 text-left text-sm font-medium shadow-sm",
    className,
  );

  if (layout === "pending") {
    return (
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-xs font-medium">{label}</Label>
        <button type="button" className={cn(triggerClass, "opacity-60")} disabled aria-busy>
          <span className="truncate">{display}</span>
          <CaretDownIcon className="size-4 shrink-0 opacity-60" aria-hidden />
        </button>
      </div>
    );
  }

  if (layout === "desktop") {
    return (
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-xs font-medium">{label}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button type="button" className={triggerClass}>
              <span className="truncate">{display}</span>
              <CaretDownIcon className="size-4 shrink-0 opacity-60" aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <OptionsList options={options} value={value} onSelect={onSelect} />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-muted-foreground text-xs font-medium">{label}</Label>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button type="button" className={triggerClass}>
            <span className="truncate">{display}</span>
            <CaretDownIcon className="size-4 shrink-0 opacity-60" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          showCloseButton
          className="h-auto max-h-[90vh] w-full rounded-t-ds-16 border-x-0 border-b-0 p-0"
        >
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle className="type-h6-sb">{label}</SheetTitle>
          </SheetHeader>
          <div className="px-0 pb-6">
            <OptionsList options={options} value={value} onSelect={onSelect} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
