"use client";

import { MapPin } from "@phosphor-icons/react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { ListingCardPrice } from "@/components/listing-cards/listing-card-price";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { DiscoveryVendorRow } from "@/types/discovery";
import { cn } from "@/lib/utils";

const VENDOR_LINK_CLASS =
  "transition-[color] hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

const METADATA_SEPARATOR_CLASS = "size-1 shrink-0 rounded-full bg-muted-foreground";

const ROW_MUTED_CLASS = "text-sm leading-snug text-muted-foreground";

interface DiscoveryVendorRowViewProps {
  row: DiscoveryVendorRow;
  orderCta: string;
  className?: string;
}

export function DiscoveryVendorRowView({ row, orderCta, className }: DiscoveryVendorRowViewProps) {
  const t = useTranslations("Discovery.header");
  const vendorHref = `/vendors/${row.slug}`;
  const primaryCuisine = row.cuisines[0];

  return (
    <article className={cn("flex gap-4 py-4 text-foreground", className)}>
      <div className="relative size-28 shrink-0 overflow-hidden rounded-ds-8 bg-muted md:size-32">
        {row.imageUrl ? (
          <Image
            src={row.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 128px, 112px"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="min-w-0">
          <h2 className="type-body-md-sb truncate text-foreground">
            <Link href={vendorHref} className={VENDOR_LINK_CLASS}>
              {row.name}
            </Link>
          </h2>

          <div className={cn("mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5", ROW_MUTED_CLASS)}>
            {primaryCuisine ? (
              <>
                <span>{primaryCuisine}</span>
                <span className={METADATA_SEPARATOR_CLASS} aria-hidden />
              </>
            ) : null}
            <ListingCardPrice
              price={row.priceLevel}
              tierAriaLabel={t("priceTierAria", { level: row.priceLevel })}
              inline
              className="inline shrink-0 font-normal tracking-normal text-inherit"
            />
          </div>

          {row.addressLine ? (
            <p className={cn("mt-1 flex min-w-0 items-start gap-1.5", ROW_MUTED_CLASS)}>
              <MapPin weight="fill" className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="min-w-0 line-clamp-2">{row.addressLine}</span>
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button variant="secondary" size="sm" className="rounded-ds-10" asChild>
            <Link href={vendorHref}>{orderCta}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
