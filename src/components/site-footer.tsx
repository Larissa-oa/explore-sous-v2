import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  TiktokLogoIcon,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import logoWhite from "@/assets/logo_white_430x.avif";
import { FooterLanguageSwitcher } from "@/components/footer-language-switcher";
import { pageShellContentClass } from "@/lib/site-layout";
import { cn } from "@/lib/utils";

const FOOTER_VIEWPORT =
  "w-[100vw] max-w-[100vw] box-border [margin-inline:calc(50%-50vw)]";

const POWERED_BY_HREF = "https://poweredbysous.com/";

/** Hover: underline draws left → right via scale-x on a full-width ::after bar. */
const footerMenuLinkClass = cn(
  "relative inline-block max-w-full text-inherit",
  "transition-[color,opacity] duration-200 hover:opacity-90",
  "after:pointer-events-none after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out",
  "hover:after:scale-x-100",
);

export async function SiteFooter({ className }: { className?: string }) {
  const t = await getTranslations("SiteFooter");

  return (
    <footer
      className={cn(
        FOOTER_VIEWPORT,
        "shrink-0 bg-ds-blue-900 text-white",
        className,
      )}
    >
      <div
        className={cn(
          pageShellContentClass,
          "pt-12 md:pt-14 lg:pt-16 pb-0",
        )}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10">
          <div className="max-w-md space-y-5">
            <Image
              src={logoWhite}
              alt={t("logoAlt")}
              className="h-5 w-auto md:h-6"
              sizes="80px"
              priority={false}
            />
            <p className="text-sm leading-relaxed text-white/85 md:text-base">
              {t("description")}
            </p>
          </div>

          <div className="inline-grid min-w-0 grid-cols-2 items-start justify-items-start gap-x-4 gap-y-0 sm:gap-x-8 lg:max-w-xl lg:gap-x-10 lg:justify-self-end">
            <div className="min-w-0 space-y-3">
              <p className="text-sm font-semibold text-white">{t("columns.explore.title")}</p>
              <ul className="space-y-2.5 text-sm text-white/85">
                {(
                  ["newOnSous", "bookTonight", "trending", "featuredPartners"] as const
                ).map((key) => (
                  <li key={key}>
                    <span className={cn(footerMenuLinkClass, "cursor-default")}>
                      {t(`columns.explore.links.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 space-y-3">
              <p className="text-sm font-semibold text-white">{t("columns.more.title")}</p>
              <ul className="space-y-2.5 text-sm text-white/85">
                {(["search", "termsOfService"] as const).map((key) => (
                  <li key={key}>
                    <span className={cn(footerMenuLinkClass, "cursor-default")}>
                      {t(`columns.more.links.${key}`)}
                    </span>
                  </li>
                ))}
                <li>
                  <a
                    href={POWERED_BY_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      footerMenuLinkClass,
                      "inline-flex max-w-full items-center gap-1.5 rounded-sm text-white/85 hover:text-white hover:opacity-95",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-blue-900",
                      "focus-visible:after:scale-x-100",
                    )}
                  >
                    <span className="min-w-0">{t("columns.more.links.getPoweredBy")}</span>
                    <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3" aria-label={t("socialAria")}>
            <span className="inline-flex text-white hover:text-white/90">
              <FacebookLogoIcon className="size-6" weight="regular" aria-hidden />
            </span>
            <span className="inline-flex text-white hover:text-white/90">
              <InstagramLogoIcon className="size-6" weight="regular" aria-hidden />
            </span>
            <span className="inline-flex text-white hover:text-white/90">
              <LinkedinLogoIcon className="size-6" weight="regular" aria-hidden />
            </span>
            <span className="inline-flex text-white hover:text-white/90">
              <TiktokLogoIcon className="size-6" weight="regular" aria-hidden />
            </span>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 pb-6 md:mt-12 md:pt-8 md:pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-2">
              <p className="shrink-0 whitespace-nowrap text-sm text-white/80">
                {t("copyright", { year: new Date().getFullYear() })}
              </p>
              <FooterLanguageSwitcher />
            </div>
            <nav
              className="flex max-w-2xl flex-wrap gap-x-1 gap-y-2 text-sm text-white/80 md:justify-end"
              aria-label={t("legalNavAria")}
            >
              {(["privacyPolicy", "termsOfService", "contactInformation", "legalNotice"] as const).map(
                (key, index) => (
                  <span key={key} className="inline-flex items-center">
                    {index > 0 ? (
                      <span className="mx-2 text-white/40" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <span className={cn(footerMenuLinkClass, "cursor-default whitespace-nowrap")}>
                      {t(`legal.${key}`)}
                    </span>
                  </span>
                ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
