import { motion } from "framer-motion";
import { FileText, Plane, Building, Moon } from "lucide-react";

const steps = [
  { icon: FileText, title: "Choose Your Package", description: "Browse and select from our curated Umrah packages." },
  { icon: Plane, title: "Book & Prepare", description: "Complete your booking and we'll handle visa and documentation." },
  { icon: Building, title: "Travel & Stay", description: "Enjoy premium flights, hotels, and guided Ziyarat tours." },
  { icon: Moon, title: "Spiritual Fulfillment", description: "Complete your Umrah with peace of mind and a blessed heart." },
];

const JourneySteps = () => {
  return (
    <section className="py-20 px-4 bg-primary/30 islamic-pattern">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent text-sm font-medium tracking-wider uppercase">Your Journey</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative mx-auto mb-4">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySteps;
