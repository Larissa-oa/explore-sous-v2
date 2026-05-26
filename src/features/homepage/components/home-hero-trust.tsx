import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { HERO_TRUST_AVATAR_URLS } from "@/lib/data/hero-trust-avatars";
import { cn } from "@/lib/utils";

const AVATAR_ALT_KEYS = ["trustAvatar1Alt", "trustAvatar2Alt", "trustAvatar3Alt"] as const;

export async function HomeHeroTrust() {
  const t = await getTranslations("HomePage.hero");

  return (
    <div
      className={cn(
        "mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5 md:mt-10",
        "text-center sm:text-left",
      )}
    >
      <div className="flex shrink-0 -space-x-2.5">
        {HERO_TRUST_AVATAR_URLS.map((src, i) => (
          <span
            key={src}
            className="relative size-8 overflow-hidden rounded-full border-2 border-ds-clay-50 bg-muted ring-1 ring-border/60 sm:size-9"
          >
            <Image
              src={src}
              alt={t(AVATAR_ALT_KEYS[i] ?? "trustAvatar1Alt")}
              fill
              className="object-cover"
              sizes="36px"
            />
          </span>
        ))}
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium leading-normal text-foreground">{t("trustTitle")}</p>
        <p className="text-sm font-normal leading-normal text-muted-foreground">{t("trustSubtitle")}</p>
      </div>
    </div>
  );
}
