"use client";

import Link from "next/link";

import { ForkKnifeIcon } from "@phosphor-icons/react";
import { formatEuroPriceTier } from "@/components/listing-cards/listing-card-price";
import type { DiscoveryVendorRow } from "@/types/discovery";

export function DiscoveryVendorMapPopup({
  vendor,
  href,
}: {
  vendor: DiscoveryVendorRow;
  href: string;
}) {
  const tags = vendor.cuisines.slice(0, 4);

  return (
    <Link href={href} className="discovery-map-popup-card block text-inherit no-underline">
      <div className="h-[9.75rem] overflow-hidden bg-muted">
        {vendor.imageUrl ? (
          <img
            src={vendor.imageUrl}
            alt=""
            width={280}
            height={156}
            loading="lazy"
            className="block size-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 px-3 pt-2.5 pb-2.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="min-w-0 text-[0.9375rem] font-semibold leading-none tracking-tight text-foreground">
              {vendor.name}
            </span>
            <span className="shrink-0 text-[0.9375rem] font-semibold leading-none tracking-wide text-foreground">
              {formatEuroPriceTier(vendor.priceLevel)}
            </span>
          </div>
          <div className="flex items-start gap-1 text-xs font-medium leading-[1.25] text-muted-foreground">
            <span className="min-w-0">{vendor.addressLine.trim()}</span>
          </div>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1 text-xs font-semibold leading-none text-foreground">
            <ForkKnifeIcon
              className="size-3.5 shrink-0 text-ds-blue-600"
              weight="fill"
              aria-hidden
            />
            {tags.map((tag, i) => (
              <span key={tag}>
                {i > 0 ? (
                  <span className="font-medium text-muted-foreground" aria-hidden>
                    {" · "}
                  </span>
                ) : null}
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
