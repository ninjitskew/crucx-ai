import Hero from "@/components/sections/Hero";
import CreatorPath from "@/components/sections/CreatorPath";
import MarketplacePath from "@/components/sections/MarketplacePath";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import DualCTA from "@/components/sections/DualCTA";
import BackToTop from "@/components/ui/BackToTop";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <CreatorPath />
        <MarketplacePath />
        <Pricing />
        <Testimonials />
        <DualCTA />
      </main>
      <BackToTop />
    </>
  );
}
