import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
