import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TrustSection from "@/components/TrustSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import RatesSection from "@/components/RatesSection";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";
import DrivingModeToggle from "@/components/DrivingModeToggle";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TrustSection />
      <TestimonialsSection />
      <RatesSection />
      <BookingCTA />
      <Footer />
      <DrivingModeToggle />
    </main>
  );
}
