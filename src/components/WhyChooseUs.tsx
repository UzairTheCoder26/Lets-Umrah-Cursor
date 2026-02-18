import { motion } from "framer-motion";
import { Shield, CreditCard, Headphones, CheckCircle, Users, Globe } from "lucide-react";

const features = [
  { icon: Shield, title: "Verified Partners", description: "All our travel partners are thoroughly vetted and certified for quality service." },
  { icon: CreditCard, title: "Transparent Pricing", description: "No hidden charges. What you see is what you pay. Complete price breakdown." },
  { icon: Headphones, title: "24/7 Support", description: "Round-the-clock assistance before, during, and after your journey." },
  { icon: CheckCircle, title: "Secure Payments", description: "Your payments are protected with industry-leading security standards." },
  { icon: Users, title: "Guided Assistance", description: "Experienced guides accompany you through every step of your Umrah." },
  { icon: Globe, title: "End-to-End Service", description: "From visa processing to return flight, we handle everything for you." },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-4 islamic-pattern bg-primary/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent text-sm font-medium tracking-wider uppercase">Why Us</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            Why Choose <span className="text-gradient-gold">Let's Umrah</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/30"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
