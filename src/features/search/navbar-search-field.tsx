"use client";

import type { KeyboardEvent, Ref } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const hideNativeSearchClearClass =
  "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden";

interface NavbarSearchFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  ariaLabel: string;
  clearLabel: string;
  clearAriaLabel: string;
  onClear: () => void;
  /** When set, an empty field shows an X that calls this (desktop closes the overlay). */
  onCloseOverlay?: () => void;
  closeAriaLabel?: string;
  inputRef?: Ref<HTMLInputElement>;
  size?: "sm" | "md";
}

export function NavbarSearchField({
  id,
  value,
  onChange,
  onKeyDown,
  placeholder,
  ariaLabel,
  clearLabel,
  clearAriaLabel,
  onClear,
  onCloseOverlay,
  closeAriaLabel,
  inputRef,
  size = "sm",
}: NavbarSearchFieldProps) {
  const hasText = value.length > 0;
  const showClear = hasText;
  const showClose = !hasText && onCloseOverlay != null;

  const fieldClass = cn(
    size === "md" ? "h-11 pl-9 text-base" : "h-10 pl-9 text-sm",
    showClear ? "pr-20" : showClose ? (size === "md" ? "pr-11" : "pr-10") : "pr-4",
  );

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
          hideNativeSearchClearClass,
          "w-full rounded-ds-12 border border-border bg-background shadow-none",
          fieldClass,
          "focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
        )}
      />
      {showClear ? (
        <button
          type="button"
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 font-medium text-ds-blue-600 transition-colors hover:text-ds-blue-900",
            size === "md" ? "text-sm" : "text-xs",
          )}
          aria-label={clearAriaLabel}
          onClick={onClear}
        >
          {clearLabel}
        </button>
      ) : null}
      {showClose ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={closeAriaLabel}
          onClick={onCloseOverlay}
        >
          <XIcon className="size-4" weight="bold" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
