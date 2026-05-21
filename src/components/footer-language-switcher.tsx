"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const LOCALE_META: Record<
  (typeof routing.locales)[number],
  { flag: string; labelKey: "nl" | "en" }
> = {
  nl: { flag: "🇳🇱", labelKey: "nl" },
  en: { flag: "🇬🇧", labelKey: "en" },
};

export function FooterLanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("SiteFooter.language");
  const locale = useLocale() as (typeof routing.locales)[number];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = LOCALE_META[locale] ?? LOCALE_META.nl;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-ds-full px-1 py-1 text-left text-sm text-white outline-none transition-[color,background-color] hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-blue-900",
          className,
        )}
        aria-label={t("aria")}
      >
        <span
          className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-white/10 text-base leading-none"
          aria-hidden
        >
          {current.flag}
        </span>
        <CaretDownIcon className="size-3 shrink-0 text-white/80" weight="bold" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-44 border border-white/15 bg-ds-blue-900 p-1.5 text-white shadow-lg ring-white/10"
      >
        <p className="px-2 pb-1 text-xs font-medium text-white/60">{t("title")}</p>
        <ul className="flex flex-col gap-0.5">
          {routing.locales.map((loc) => {
            const meta = LOCALE_META[loc];
            return (
              <li key={loc}>
                <Link
                  href={pathname}
                  locale={loc}
                  className={cn(
                    "flex items-center gap-2 rounded-ds-8 px-2 py-2 text-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                    loc === locale && "bg-white/10",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {meta.flag}
                  </span>
                  <span>{t(`options.${meta.labelKey}`)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
