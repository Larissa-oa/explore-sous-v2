import { cn } from "@/lib/utils";
import { pageShellContentClass } from "@/lib/site-layout";

import { HomeCategoryCards } from "./home-category-cards";
import { HomeCta } from "./home-cta";
import { HomeListingRail } from "./home-listing-rail";
import { HomeVendorSpotlight } from "./home-vendor-spotlight";

/** Main homepage column below the hero. */
export async function HomePageShell() {
  return (
    <div className={cn(pageShellContentClass, "flex flex-1 flex-col")}>
      <HomeCategoryCards />
      <HomeVendorSpotlight />
      <HomeListingRail kind="partners" />
      <HomeListingRail kind="delivery" />
      <HomeListingRail kind="pickup" />
      <HomeCta />
    </div>
  );
}
