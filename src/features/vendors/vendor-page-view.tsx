import { getTranslations } from "next-intl/server";

import { pageShellContentClass } from "@/lib/site-layout";
import type { VendorPageDetail } from "@/types/vendor-page";

import { VendorImageGallery } from "@/features/vendors/components/vendor-image-gallery";
import { VendorInfoCard } from "@/features/vendors/components/vendor-info-card";
import { VendorLocationSection } from "@/features/vendors/components/vendor-location-section";

interface VendorPageViewProps {
  vendor: VendorPageDetail;
}

export async function VendorPageView({ vendor }: VendorPageViewProps) {
  const t = await getTranslations("VendorPage");

  const galleryImages = vendor.images
    .filter(Boolean)
    .map((src, index) => ({
      src,
      alt: t("gallery.imageAlt", { name: vendor.name, index: index + 1 }),
    }));

  return (
    <div className="flex flex-1 flex-col bg-background pb-16 md:pb-20">
      <div className={pageShellContentClass}>
        <VendorImageGallery
          className="pb-8 md:pb-10"
          images={galleryImages}
          galleryRegionLabel={t("gallery.regionAria")}
          galleryOverviewTitle={vendor.name}
          viewAllPhotosLabel={t("gallery.viewAll")}
        />

        <VendorInfoCard
          className="pb-14 md:pb-16"
          name={vendor.name}
          addressLine={vendor.addressLine}
          cuisineTags={vendor.cuisineTags}
          description={vendor.description}
          supportsReservations={vendor.supportsReservations}
          supportsPickup={vendor.supportsPickup}
          bookUrl={vendor.sousCollectionUrl ?? vendor.websiteUrl}
          labels={{
            readMore: t("info.readMore"),
            readLess: t("info.readLess"),
            share: t("info.share"),
            shareCopied: t("info.shareCopied"),
            bookNow: t("info.bookNow"),
            bookNowNewWindow: t("info.bookNowNewWindow"),
            pickup: t("info.pickup"),
            cuisineAria: t("info.cuisineAria"),
          }}
        />

        <VendorLocationSection
          className="pt-8 pb-4 md:pt-10 md:pb-8"
          locationCardTitle={vendor.locationCardTitle}
          addressLine={vendor.addressLine}
          phone={vendor.phone}
          lat={vendor.lat}
          lng={vendor.lng}
          labels={{
            sectionAria: t("location.regionAria"),
            mapTitle: t("location.mapTitle", { name: vendor.name }),
            locationColumn: t("location.locationColumn"),
            getDirections: t("location.getDirections"),
            contactColumn: t("location.contactColumn"),
          }}
        />
      </div>
    </div>
  );
}
