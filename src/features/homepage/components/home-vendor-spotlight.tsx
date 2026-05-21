import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";

import { VendorSpotlightRowItem } from "@/features/homepage/components/home-vendor-spotlight-row";
import { sectionCardGridGapClass } from "@/components/carousel/gap-classes";
import { Button } from "@/components/ui/button";
import { getHomeVendorSpotlightBlocks } from "@/lib/data/home";
import { pageSectionPaddingYClass } from "@/lib/site-layout";
import type { VendorSpotlightBlock, VendorSpotlightBlockKey } from "@/types/home";
import { cn } from "@/lib/utils";

const SCROLLBAR_HIDE =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

const RAIL_TRACK = cn(
  "flex min-w-0 snap-x snap-mandatory flex-nowrap overflow-x-auto scroll-smooth pb-1 md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:pb-0",
  SCROLLBAR_HIDE,
  sectionCardGridGapClass,
);

const SLIDE_ARTICLE = cn(
  "relative flex h-full min-h-0 w-[min(100%,min(22rem,calc(100vw-2.5rem)))] shrink-0 snap-center flex-col pt-6 md:pt-7",
  "md:w-auto md:min-w-0 md:snap-align-none",
);

const CARD_SHELL = cn(
  "relative z-10 flex min-h-0 flex-1 flex-col overflow-visible rounded-ds-20",
  "border-[0.5px] border-border bg-card text-card-foreground",
  "shadow-[0_1px_2px_var(--ds-alpha-black-4),0_1px_1px_var(--ds-alpha-black-4)]",
);

const TITLE_PILL = cn(
  "absolute left-1/2 top-0 z-30 w-[calc(100%-1.5rem)] max-w-[17.25rem] -translate-x-1/2 -translate-y-[48%]",
  "rounded-ds-12 bg-background px-4 pt-2.5 pb-4 text-center md:max-w-[min(17.5rem,90%)] md:px-5 md:pt-2.5 md:pb-5",
);

const LIST_REGION = "flex min-h-0 flex-1 flex-col px-4 pb-2 pt-12 md:px-5 md:pb-2 md:pt-14";

const FOOTER_REGION = "relative min-h-[4.5rem] px-4 pb-4 pt-7 md:px-5 md:pb-5 md:pt-9";

/** Full literal for Tailwind content scan — subtle blue wash on card footer. */
const FOOTER_TINT =
  "pointer-events-none absolute inset-0 rounded-b-ds-20 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--ds-blue-600)_1.5%,var(--card))_18%,color-mix(in_srgb,var(--ds-blue-600)_3.5%,var(--card))_42%,color-mix(in_srgb,var(--ds-blue-600)_6%,var(--card))_68%,color-mix(in_srgb,var(--ds-blue-600)_8%,var(--card))_100%)]";

const SEE_ALL_BUTTON = cn(
  "group/button relative z-[1] h-auto w-full rounded-ds-10 py-3 text-base font-semibold text-ds-blue-600",
  "hover:bg-transparent hover:text-ds-blue-600 dark:hover:bg-transparent",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

function blockTitleKey(blockKey: VendorSpotlightBlockKey): `blocks.${VendorSpotlightBlockKey}` {
  return `blocks.${blockKey}`;
}

function VendorSpotlightBlockCard({
  block,
  blockTitle,
  seeAllLabel,
  favoriteLabel,
}: {
  block: VendorSpotlightBlock;
  blockTitle: string;
  seeAllLabel: string;
  favoriteLabel: string;
}) {
  return (
    <article className={SLIDE_ARTICLE}>
      <div className={CARD_SHELL}>
        <div className={TITLE_PILL}>
          <h2 className="type-h5-sb text-foreground">{blockTitle}</h2>
        </div>

        <div className={LIST_REGION}>
          <ul className="min-h-0 flex-1 divide-y divide-border">
            {block.rows.map((row) => (
              <VendorSpotlightRowItem key={row.id} row={row} favoriteLabel={favoriteLabel} />
            ))}
          </ul>
        </div>

        <div className={FOOTER_REGION}>
          <div className={FOOTER_TINT} aria-hidden />
          <Button type="button" variant="ghost" size="lg" className={SEE_ALL_BUTTON}>
            <span className="inline-flex items-center justify-center gap-0 transition-[gap] duration-200 ease-out group-hover/button:gap-1">
              {seeAllLabel}
              <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity] duration-200 ease-out group-hover/button:max-w-4 group-hover/button:opacity-100">
                <ChevronRight aria-hidden className="size-4 shrink-0" />
              </span>
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
}

export async function HomeVendorSpotlight() {
  const t = await getTranslations("HomePage.vendorSpotlight");
  const blocks = getHomeVendorSpotlightBlocks();
  if (blocks.length === 0) return null;

  const seeAllLabel = t("seeAll");
  const favoriteLabel = t("favorite");

  return (
    <section aria-label={t("regionAria")} className={cn("w-full min-w-0", pageSectionPaddingYClass)}>
      <div className={RAIL_TRACK}>
        {blocks.map((block) => (
          <VendorSpotlightBlockCard
            key={block.blockKey}
            block={block}
            blockTitle={t(blockTitleKey(block.blockKey))}
            seeAllLabel={seeAllLabel}
            favoriteLabel={favoriteLabel}
          />
        ))}
      </div>
    </section>
  );
}
