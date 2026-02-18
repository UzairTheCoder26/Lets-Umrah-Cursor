import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-kaaba.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      {/* Islamic pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      <div className="container relative mx-auto px-4 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
            ✦ Kashmir's First Online Umrah Booking Platform
          </span>

          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            <span className="text-foreground">Your Trusted Path</span>
            <br />
            <span className="text-gradient-gold">to Umrah</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed">
            Experience a seamless, spiritually enriching Umrah journey with premium
            packages, verified partners, and 24/7 dedicated support.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto max-w-2xl"
        >
          {/* Search bar */}
          <div className="rounded-2xl border border-border/50 bg-card/80 p-3 backdrop-blur-sm shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <select className="w-full bg-transparent text-sm text-foreground outline-none">
                  <option value="">Select Month</option>
                  <option>January 2026</option>
                  <option>February 2026</option>
                  <option>March 2026</option>
                  <option>April 2026</option>
                  <option>May 2026</option>
                  <option>June 2026</option>
                </select>
              </div>
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">₹</span>
                <select className="w-full bg-transparent text-sm text-foreground outline-none">
                  <option value="">Budget Range</option>
                  <option>Under ₹1,00,000</option>
                  <option>₹1,00,000 - ₹2,00,000</option>
                  <option>₹2,00,000 - ₹3,50,000</option>
                  <option>₹3,50,000+</option>
                </select>
              </div>
              <Link to="/packages">
                <Button className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-gold-light px-8 py-3 text-sm font-semibold">
                  Explore Packages
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
