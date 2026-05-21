import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { pageSectionPaddingYClass } from "@/lib/site-layout";
import { cn } from "@/lib/utils";

const IMAGE_SRC =
  "https://eatsous.com/cdn/shop/files/9-onno_holidays_2025__285_kopie_6da8ff4d-0b64-47df-8d2e-33906acaae1b.jpg?v=1762161501&width=1500";

const titleRichTags = { br: () => <br /> };

export async function HomeCta() {
  const t = await getTranslations("HomePage.cta");

  return (
    <section className={cn("w-full bg-background", pageSectionPaddingYClass)}>
      <div className="overflow-hidden rounded-ds-20 bg-muted">
        <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-4">
          <div className="flex min-w-0 flex-col justify-center px-4 py-5 md:flex-1 md:px-0 md:py-8 md:pl-10 md:pr-6">
            <div className="flex max-w-[26rem] flex-col gap-5 md:gap-4">
              <h2 className="type-h5-sb text-foreground">{t.rich("title", titleRichTags)}</h2>
              <p className="text-base leading-relaxed text-muted-foreground">{t("body")}</p>
              <Button asChild className="w-fit rounded-ds-10" size="default">
                <Link href="/">{t("button")}</Link>
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-none flex-col justify-center px-4 py-3 md:w-[48%] md:justify-center md:px-0 md:py-1.5 md:pr-1.5 md:pl-0">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-ds-12 md:aspect-auto md:min-h-[min(24rem,46vw)] md:flex-1">
              <Image
                alt={t("imageAlt")}
                className="object-cover"
                fill
                sizes="(max-width: 767px) 100vw, 48vw"
                src={IMAGE_SRC}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
