"use client";

import type { KeyboardEvent, Ref } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NavbarSearchField({
  id,
  value,
  onChange,
  onKeyDown,
  placeholder,
  ariaLabel,
  closeLabel,
  onClose,
  inputRef,
  size = "sm",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  ariaLabel: string;
  closeLabel: string;
  onClose: () => void;
  inputRef?: Ref<HTMLInputElement>;
  size?: "sm" | "md";
}) {
  const fieldClass = size === "md" ? "h-11 pl-9 pr-11 text-base" : "h-10 pl-9 pr-10 text-sm";

  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        weight="bold"
        aria-hidden
      />
      <Input
        ref={inputRef}
        id={id}
        type="search"
        name="site-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={cn(
          "w-full rounded-ds-12 border border-border bg-background shadow-none",
          fieldClass,
          "focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <XIcon className="size-4" weight="bold" aria-hidden />
      </Button>
    </div>
  );
}
