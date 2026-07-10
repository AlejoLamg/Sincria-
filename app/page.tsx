import Navbar from "@/components/layouts/Navbar";
import HeroSection from "@/components/layouts/HeroSection";
import SolutionsSection from "@/components/layouts/SolutionsSection";
import ProcessSection from "@/components/layouts/ProcessSection";
import PricingSection from "@/components/layouts/PricingSection";
import AdditionalModules from "@/components/layouts/AdditionalModules";
import WorkProcess from "@/components/layouts/WorkProcess";
import Footer from "@/components/layouts/Footer";
import ContactForm from "@/components/layouts/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-navy">
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <ProcessSection  />
      <PricingSection />
      <AdditionalModules />
      <WorkProcess />
      <ContactForm/>
      <Footer />

    </main>
  );
}