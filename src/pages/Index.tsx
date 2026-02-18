import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PackagesSection from "@/components/PackagesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import JourneySteps from "@/components/JourneySteps";
import TestimonialsSection from "@/components/TestimonialsSection";
import IslamicQuotes from "@/components/IslamicQuotes";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PackagesSection />
        <WhyChooseUs />
        <JourneySteps />
        <TestimonialsSection />
        <IslamicQuotes />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
