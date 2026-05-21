"use client";

import { useTranslations } from "next-intl";

import { pageShellContentClass } from "@/lib/site-layout";
import { cn } from "@/lib/utils";

export default function LocaleNotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className={cn(pageShellContentClass, "flex min-h-full flex-1 flex-col items-center justify-center gap-4 py-16")}>
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
    </div>
  );
}
