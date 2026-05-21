import Image from "next/image";

import { cn } from "@/lib/utils";

import type { ListingCardSurface } from "@/types/listing-card";

const standardMediaFrame =
  "relative aspect-square w-full max-w-none overflow-hidden bg-ds-clay-100";

const cardMediaFrame = "relative aspect-[4/3] w-full overflow-hidden bg-ds-clay-100";

export function ListingCardMedia({
  surface,
  alt,
  primarySrc,
  hoverSrc,
  sizes,
  className,
}: {
  surface: ListingCardSurface;
  alt: string;
  primarySrc?: string;
  hoverSrc?: string;
  sizes: string;
  className?: string;
}) {
  const frame = surface === "standard" ? standardMediaFrame : cardMediaFrame;

  if (!primarySrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground text-sm",
          frame,
          className,
        )}
        aria-hidden
      />
    );
  }

  const hasHover = Boolean(hoverSrc && hoverSrc !== primarySrc);

  return (
    <div
      data-slot="listing-card-media"
      className={cn("group/listing-media", frame, className)}
    >
      <Image
        src={primarySrc}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300 ease-out",
          hasHover && "group-hover/listing-media:opacity-0",
        )}
        sizes={sizes}
      />
      {hasHover && hoverSrc ? (
        <Image
          src={hoverSrc}
          alt=""
          fill
          className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 ease-out group-hover/listing-media:opacity-100"
          sizes={sizes}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
