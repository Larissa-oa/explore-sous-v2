"use client";

import { useTranslations } from "next-intl";

export default function LocaleNotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
    </div>
  );
}
