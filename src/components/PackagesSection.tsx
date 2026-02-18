import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Star, MapPin, Utensils, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import packageMakkah from "@/assets/package-makkah.jpg";

const PackagesSection = () => {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("packages")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPackages(data || []);
    };
    fetchData();
  }, []);

  if (packages.length === 0) {
    return (
      <section className="py-20 px-4" id="packages">
        <div className="container mx-auto text-center">
          <span className="text-accent text-sm font-medium tracking-wider uppercase">Our Packages</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Curated <span className="text-gradient-gold">Umrah Packages</span>
          </h2>
          <p className="text-muted-foreground mb-8">Packages coming soon. Check back for premium offerings.</p>
          <Link to="/packages">
            <Button className="bg-accent text-accent-foreground hover:bg-gold-light">View All Packages →</Button>
          </Link>
        </div>
      </section>
    );
  }

  const getPackageUrl = (pkg: any) => (pkg.slug ? `/packages/${pkg.slug}` : `/packages/${pkg.id}`);

  return (
    <section className="py-20 px-4" id="packages">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-accent text-sm font-medium tracking-wider uppercase">Our Packages</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            Curated <span className="text-gradient-gold">Umrah Packages</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => {
            const seatsLeft = (pkg.total_seats || 50) - (pkg.seats_booked || 0);
            return (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/30 hover:shadow-lg" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="relative h-52 overflow-hidden">
                  <img src={pkg.cover_image || packageMakkah} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  {pkg.show_scarcity && seatsLeft <= 10 && <Badge className="absolute top-3 left-3 bg-destructive/90 text-destructive-foreground border-none text-xs">{seatsLeft} seats left</Badge>}
                  {pkg.featured && <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground border-none text-xs">Featured</Badge>}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl font-semibold text-foreground">{pkg.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {pkg.duration}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-accent" /> {pkg.rating}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pkg.direct_flight && <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"><Plane className="h-3 w-3" /> Direct</span>}
                    {pkg.five_star && <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"><Star className="h-3 w-3" /> 5-Star</span>}
                    {pkg.meals_included && <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"><Utensils className="h-3 w-3" /> Meals</span>}
                    {pkg.distance_makkah && <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {pkg.distance_makkah}</span>}
                  </div>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      {pkg.original_price && <span className="text-xs text-muted-foreground line-through">₹{Number(pkg.original_price).toLocaleString()}</span>}
                      <p className="text-2xl font-bold text-accent">₹{Number(pkg.price).toLocaleString()}</p>
                      <span className="text-xs text-muted-foreground">starting price</span>
                    </div>
                    <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-gold-light gap-1">
                      <Link to={getPackageUrl(pkg)}>
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link to="/packages">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">View All Packages →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
