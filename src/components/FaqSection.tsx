import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { faqs as fallbackFaqs } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FaqSection = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("general_faqs").select("*").eq("published", true).order("sort_order");
      setItems(data && data.length > 0 ? data : fallbackFaqs.map((f, i) => ({ ...f, id: i })));
    };
    fetch();
  }, []);

  return (
    <section className="py-20 px-4" id="faq">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-accent text-sm font-medium tracking-wider uppercase">FAQ</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">Frequently Asked <span className="text-gradient-gold">Questions</span></h2>
        </motion.div>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((faq, i) => (
            <AccordionItem key={faq.id || i} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-accent/30">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:text-accent py-4">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
