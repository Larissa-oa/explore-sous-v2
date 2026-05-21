import { HomeHero } from "@/features/homepage/components/home-hero";
import { HomePageShell } from "@/features/homepage/components/home-page-shell";

export async function HomePage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <HomeHero />
      <HomePageShell />
    </div>
  );
}
