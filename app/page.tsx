import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import DayTripsSection from "@/components/DayTripsSection";
import AboutSection from "@/components/AboutSection";
import TrustSection from "@/components/TrustSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import RatesSection from "@/components/RatesSection";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";
import DrivingModeToggle from "@/components/DrivingModeToggle";

export const metadata = {
  title: "Bones — Private Driver & Local Guide in Puerto Vallarta",
  description:
    "15+ years in Puerto Vallarta. Airport transfers, day trips to secret beaches, local connections. Safe. Reliable. Fair prices. Book on WhatsApp.",
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <DayTripsSection />
      <AboutSection />
      <TrustSection />
      <TestimonialsSection />
      <BlogSection />
      <RatesSection />
      <BookingCTA />
      <Footer />
      <DrivingModeToggle />
    </main>
  );
}
