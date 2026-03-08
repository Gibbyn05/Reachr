import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Comparison } from "@/components/landing/comparison";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { OmOss } from "@/components/landing/om-oss";
import { Kontakt } from "@/components/landing/kontakt";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f2efe3]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Comparison />
      <Pricing />
      <Testimonials />
      <OmOss />
      <Kontakt />
      <CtaBanner />
      <Footer />
    </div>
  );
}
