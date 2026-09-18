import Navbar from "@/components/layouts/Navbar";
import HeroSection from "@/components/layouts/HeroSection";
import SolutionsSection from "@/components/layouts/SolutionsSection";
import AIDemoSection from "@/components/layouts/AIDemoSection";
import ROICalculator from "@/components/layouts/ROICalculator";
import PricingSection from "@/components/layouts/PricingSection";
import AdditionalModules from "@/components/layouts/AdditionalModules";
import WorkProcess from "@/components/layouts/WorkProcess";
import Footer from "@/components/layouts/Footer";
import ContactForm from "@/components/layouts/ContactForm";
import TechStack from "@/components/layouts/TechStack";
import WhatsAppButton from "@/components/layouts/WhatsAppButton";
import FaqSection from "@/components/layouts/FaqSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-navy">
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <AIDemoSection />
      <ROICalculator />
      <WorkProcess />
      <PricingSection />
      <AdditionalModules />
      <ContactForm/>
      <FaqSection/>
      <TechStack/>
      <Footer />
      <WhatsAppButton/>
    </main>
  );
}