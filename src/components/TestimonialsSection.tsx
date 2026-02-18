import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { testimonials as fallbackTestimonials } from "@/lib/data";

const TestimonialsSection = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("testimonials").select("*").eq("published", true).order("created_at", { ascending: false }).limit(4);
      setItems(data && data.length > 0 ? data : fallbackTestimonials);
    };
    fetch();
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-accent text-sm font-medium tracking-wider uppercase">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">What Our <span className="text-gradient-gold">Pilgrims Say</span></h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => (
            <motion.div key={t.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <Quote className="h-6 w-6 text-accent/30 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating || 5 }).map((_, j) => (
                  <Star key={j} className="h-3 w-3 fill-accent text-accent" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {t.avatar || t.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
