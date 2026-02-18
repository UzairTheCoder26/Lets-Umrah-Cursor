import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { islamicQuotes as fallbackQuotes } from "@/lib/data";

const IslamicQuotes = () => {
  const [quotes, setQuotes] = useState(fallbackQuotes);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("islamic_quotes").select("*").eq("published", true);
      if (data && data.length > 0) setQuotes(data);
    };
    fetch();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <section className="py-16 px-4 bg-primary/50 islamic-pattern">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="min-h-[100px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
              <p className="font-heading text-xl md:text-2xl text-foreground italic leading-relaxed">"{quotes[current].text}"</p>
              <p className="mt-3 text-sm text-accent font-medium">— {quotes[current].source}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default IslamicQuotes;
