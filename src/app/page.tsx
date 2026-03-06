import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import Waitlist from "@/components/sections/Waitlist";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
