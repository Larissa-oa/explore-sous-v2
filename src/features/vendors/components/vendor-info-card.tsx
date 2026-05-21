"use client";

import { ForkKnifeIcon, MapPinIcon } from "@phosphor-icons/react";
import { Share2 } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { ClampedExpandableText } from "@/components/clamped-expandable-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CUISINE_DOT = "size-1 shrink-0 rounded-full bg-foreground";

/** Icons aligned to 16px (Body line). */
const INLINE_ICON = "size-4 shrink-0";

interface VendorInfoCardProps {
  name: string;
  addressLine: string;
  cuisineTags: string[];
  description: string;
  supportsReservations: boolean;
  supportsPickup: boolean;
  /** External booking / collection URL when reservations are supported. */
  bookUrl: string | null;
  labels: {
    readMore: string;
    readLess: string;
    share: string;
    shareCopied: string;
    bookNow: string;
    bookNowNewWindow: string;
    pickup: string;
    cuisineAria: string;
  };
  className?: string;
}

function isSafeExternalUrl(href: string): boolean {
  try {
    const u = new URL(href);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function VendorInfoCard({
  name,
  addressLine,
  cuisineTags,
  description,
  supportsReservations,
  supportsPickup,
  bookUrl,
  labels,
  className,
}: VendorInfoCardProps) {
  const [copied, setCopied] = useState(false);

  const resolvedBookUrl =
    bookUrl && isSafeExternalUrl(bookUrl) ? bookUrl : null;
  const showBookNow = supportsReservations && resolvedBookUrl != null;

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [name]);

  return (
    <section
      aria-labelledby="vendor-profile-heading"
      className={cn("w-full min-w-0", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 id="vendor-profile-heading" className="type-h4-sb text-foreground">
            {name}
          </h1>

          <div className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-1">
            <p
              className={cn(
                "type-body-sm-sb flex min-w-0 items-start gap-2 text-muted-foreground md:max-w-[min(100%,28rem)]",
              )}
            >
              <MapPinIcon
                weight="fill"
                className={cn(INLINE_ICON, "mt-0.5 text-primary")}
                aria-hidden
              />
              <span className="min-w-0">{addressLine}</span>
            </p>

            {cuisineTags.length > 0 ? (
              <div
                className={cn(
                  "type-body-sm-sb flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-foreground",
                )}
                aria-label={labels.cuisineAria}
              >
                <ForkKnifeIcon
                  className={cn(INLINE_ICON, "text-ds-blue-600")}
                  weight="fill"
                  aria-hidden
                />
                {cuisineTags.map((tag, index) => (
                  <Fragment key={`${tag}-${index}`}>
                    {index > 0 ? <span className={CUISINE_DOT} aria-hidden /> : null}
                    <span className="min-w-0">{tag}</span>
                  </Fragment>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="shrink-0 rounded-ds-full"
          aria-label={labels.share}
          onClick={handleShare}
        >
          <Share2 className={INLINE_ICON} aria-hidden />
        </Button>
      </div>

      {copied ? (
        <p className="type-body-md mt-2 text-muted-foreground" role="status">
          {labels.shareCopied}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 max-w-3xl flex-1">
          <ClampedExpandableText
            text={description}
            readMoreLabel={labels.readMore}
            readLessLabel={labels.readLess}
            textClassName="type-body-md text-foreground"
            toggleClassName="type-body-md"
          />
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
          {showBookNow ? (
            <Button asChild size="lg" className="rounded-ds-10 px-6">
              <a
                href={resolvedBookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {labels.bookNow}
                <span className="sr-only">{labels.bookNowNewWindow}</span>
              </a>
            </Button>
          ) : null}
          {supportsPickup ? (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="rounded-ds-10 px-6"
            >
              {labels.pickup}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
