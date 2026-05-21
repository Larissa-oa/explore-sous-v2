import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { VendorPageView } from "@/features/vendors/vendor-page-view";
import { getVendorPageDetailBySlug, listVendorSlugs } from "@/lib/data/vendor-page";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const slugs = listVendorSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const vendor = getVendorPageDetailBySlug(slug);
  if (!vendor) {
    return { title: "SOUS" };
  }
  return {
    title: vendor.name,
    description: vendor.description.slice(0, 160),
  };
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const vendor = getVendorPageDetailBySlug(slug);
  if (!vendor) {
    notFound();
  }

  return <VendorPageView vendor={vendor} />;
}
