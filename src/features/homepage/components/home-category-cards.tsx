import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { HOME_MAIN_CONTENT_ID } from "@/features/homepage/lib/home-section-ids";
import { Link } from "@/i18n/navigation";
import { discoveryCategoryHref } from "@/lib/discovery/discovery-query";
import { getHomeCategoryCardItems } from "@/lib/data/search-categories";
import { pageSectionPaddingYClass } from "@/lib/site-layout";
import { cn } from "@/lib/utils";

export async function HomeCategoryCards() {
  const t = await getTranslations("HomePage.search");
  const cards = getHomeCategoryCardItems();

  return (
    <section id={HOME_MAIN_CONTENT_ID} className={cn("w-full", pageSectionPaddingYClass)}>
      <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3">
        {cards.map((card, index) => (
          <Link
            key={card.id}
            href={discoveryCategoryHref(card.id)}
            className="group relative block aspect-[18/7] overflow-hidden rounded-ds-12 sm:aspect-[16/7]"
          >
            <Image
              src={card.image}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 33vw"
              priority={index === 0}
            />
            <div
              className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 bg-gradient-to-t from-black/14 via-black/[0.05] to-transparent"
              aria-hidden
            />
            <div className="absolute inset-0 z-[2] flex flex-col justify-start items-start p-4 md:p-5">
              <div className="flex items-center gap-2">
                <h3 className="type-h6-sb text-black">{t(`categories.${card.id}`)}</h3>
                <ArrowUpRight className="size-5 shrink-0 text-black" aria-hidden />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
