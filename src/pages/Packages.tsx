import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Star, MapPin, Utensils, Clock, Filter, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import packageMakkah from "@/assets/package-makkah.jpg";

const Packages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [flightFilter, setFlightFilter] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("packages")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPackages(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      const price = Number(pkg.price);
      if (priceRange === "under-100k" && price >= 100000) return false;
      if (priceRange === "100k-200k" && (price < 100000 || price > 200000)) return false;
      if (priceRange === "200k-350k" && (price < 200000 || price > 350000)) return false;
      if (priceRange === "350k-plus" && price < 350000) return false;
      if (starFilter === "5star" && !pkg.five_star) return false;
      if (flightFilter === "direct" && !pkg.direct_flight) return false;
      return true;
    });
  }, [packages, priceRange, starFilter, flightFilter]);

  const getPackageUrl = (pkg: any) => (pkg.slug ? `/packages/${pkg.slug}` : `/packages/${pkg.id}`);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground">All <span className="text-gradient-gold">Umrah Packages</span></h1>
            <p className="mt-3 text-muted-foreground">Find the perfect package for your spiritual journey.</p>
          </motion.div>

          <div className="mb-8 rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3 items-center">
            <Filter className="h-4 w-4 text-accent" />
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground outline-none border border-border">
              <option value="">All Budgets</option>
              <option value="under-100k">Under ₹1,00,000</option>
              <option value="100k-200k">₹1L – ₹2L</option>
              <option value="200k-350k">₹2L – ₹3.5L</option>
              <option value="350k-plus">₹3.5L+</option>
            </select>
            <select value={starFilter} onChange={(e) => setStarFilter(e.target.value)} className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground outline-none border border-border">
              <option value="">All Hotels</option>
              <option value="5star">5-Star Only</option>
            </select>
            <select value={flightFilter} onChange={(e) => setFlightFilter(e.target.value)} className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground outline-none border border-border">
              <option value="">All Flights</option>
              <option value="direct">Direct Flights Only</option>
            </select>
            {(priceRange || starFilter || flightFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { setPriceRange(""); setStarFilter(""); setFlightFilter(""); }} className="text-accent text-xs">Clear</Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20 text-accent">Loading packages...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No packages match your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pkg, i) => {
                const seatsLeft = (pkg.total_seats || 50) - (pkg.seats_booked || 0);
                return (
                  <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/30 hover:shadow-lg" style={{ boxShadow: "var(--shadow-card)" }}>
                    <div className="relative h-52 overflow-hidden">
                      <img src={pkg.cover_image || packageMakkah} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      {pkg.show_scarcity && seatsLeft <= 10 && <Badge className="absolute top-3 left-3 bg-destructive/90 text-destructive-foreground border-none text-xs">{seatsLeft} seats left</Badge>}
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
                        <Link to={getPackageUrl(pkg)}>
                          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-gold-light gap-1">
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Packages;
