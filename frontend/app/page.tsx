import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import LiveAnalytics from "@/components/landing/LiveAnalytics";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-packiq-dark selection:bg-packiq-blue/30 selection:text-white">
      <Hero />
      <Features />
      <LiveAnalytics />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  );
}
