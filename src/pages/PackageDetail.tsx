import { useParams, Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, Star, MapPin, Utensils, Clock, CheckCircle, XCircle, Building } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import packageMakkah from "@/assets/package-makkah.jpg";

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState<any>(null);
  useDocumentTitle(pkg?.title);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("917006016700");

  useEffect(() => {
    const fetch = async () => {
      // Try by slug first, then by id
      let { data } = await supabase.from("packages").select("*").eq("slug", id).maybeSingle();
      if (!data) {
        const res = await supabase.from("packages").select("*").eq("id", id).maybeSingle();
        data = res.data;
      }
      setPkg(data);

      if (data) {
        const { data: faqData } = await supabase.from("package_faqs").select("*").eq("package_id", data.id).order("sort_order");
        setFaqs(faqData || []);
        const { data: pkgTestimonials } = await supabase.from("testimonials").select("*").eq("published", true).eq("package_id", data.id).order("created_at", { ascending: false }).limit(6);
        const { data: generalTestimonials } = await supabase.from("testimonials").select("*").eq("published", true).is("package_id", null).order("created_at", { ascending: false }).limit(6);
        setTestimonials((pkgTestimonials?.length ?? 0) > 0 ? (pkgTestimonials || []) : (generalTestimonials || []));
      }

      // Fetch WhatsApp number from settings
      const { data: phoneSetting } = await supabase.from("site_settings").select("value").eq("key", "header_phone").maybeSingle();
      if (phoneSetting?.value) {
        setWhatsappNumber(phoneSetting.value.replace(/[^0-9]/g, ""));
      }

      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-accent">Loading...</div>;

  if (!pkg || !pkg.published) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 text-center px-4">
          <h1 className="font-heading text-3xl text-foreground">Package Not Found</h1>
          <p className="text-muted-foreground mt-2">This package may not be available or has been removed.</p>
          <Link to="/packages" className="mt-4 inline-block text-accent hover:underline">← Back to Packages</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const seatsLeft = (pkg.total_seats || 50) - (pkg.seats_booked || 0);
  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const included = Array.isArray(pkg.included) ? pkg.included : [];
  const notIncluded = Array.isArray(pkg.not_included) ? pkg.not_included : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
          <img src={pkg.cover_image || packageMakkah} alt={pkg.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <Link to="/packages" className="text-accent text-sm flex items-center gap-1 mb-3 hover:underline"><ArrowLeft className="h-4 w-4" /> Back</Link>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{pkg.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration}</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-accent" /> {pkg.rating}</span>
                {pkg.show_scarcity && seatsLeft <= 10 && <Badge className="bg-destructive/90 text-destructive-foreground border-none">{seatsLeft} seats left</Badge>}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Plane, label: pkg.direct_flight ? "Direct Flight" : "Connecting", active: pkg.direct_flight },
                  { icon: Star, label: pkg.five_star ? "5-Star Hotel" : "4-Star Hotel", active: pkg.five_star },
                  { icon: Utensils, label: pkg.meals_included ? "Meals Included" : "No Meals", active: pkg.meals_included },
                  { icon: MapPin, label: pkg.visa_included ? "Visa Included" : "Visa Extra", active: pkg.visa_included },
                ].map((f) => (
                  <div key={f.label} className={`rounded-xl border p-3 text-center text-xs ${f.active ? "border-accent/30 bg-accent/5 text-accent" : "border-border bg-card text-muted-foreground"}`}>
                    <f.icon className="h-5 w-5 mx-auto mb-1" />{f.label}
                  </div>
                ))}
              </div>

              {/* Hotels */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-2"><Building className="h-5 w-5 text-accent" /><h3 className="font-heading font-semibold text-foreground">Makkah Hotel</h3></div>
                  <p className="text-sm text-foreground font-medium">{pkg.hotel_makkah || "TBD"}</p>
                  {pkg.distance_makkah && <p className="text-xs text-muted-foreground mt-1">{pkg.distance_makkah}</p>}
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-2"><Building className="h-5 w-5 text-accent" /><h3 className="font-heading font-semibold text-foreground">Madinah Hotel</h3></div>
                  <p className="text-sm text-foreground font-medium">{pkg.hotel_madinah || "TBD"}</p>
                  {pkg.distance_madinah && <p className="text-xs text-muted-foreground mt-1">{pkg.distance_madinah}</p>}
                </div>
              </div>

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Day-by-Day Itinerary</h2>
                  <div className="space-y-3">
                    {itinerary.map((day: any, i: number) => (
                      <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">D{day.day || i + 1}</div>
                        <div><h4 className="text-sm font-semibold text-foreground">{day.title}</h4><p className="text-xs text-muted-foreground mt-1">{day.description}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included / Not */}
              {(included.length > 0 || notIncluded.length > 0) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {included.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading font-semibold text-foreground mb-3">What's Included</h3>
                      <ul className="space-y-2">{included.map((item: string, i: number) => (<li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-emerald" /> {item}</li>))}</ul>
                    </div>
                  )}
                  {notIncluded.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading font-semibold text-foreground mb-3">Not Included</h3>
                      <ul className="space-y-2">{notIncluded.map((item: string, i: number) => (<li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><XCircle className="h-4 w-4 text-destructive" /> {item}</li>))}</ul>
                    </div>
                  )}
                </div>
              )}

              {/* Policies */}
              {(pkg.cancellation_policy || pkg.refund_policy) && (
                <div className="space-y-3">
                  {pkg.cancellation_policy && <div className="rounded-xl border border-border bg-card p-5"><h3 className="font-heading font-semibold text-foreground mb-2">Cancellation Policy</h3><p className="text-sm text-muted-foreground">{pkg.cancellation_policy}</p></div>}
                  {pkg.refund_policy && <div className="rounded-xl border border-border bg-card p-5"><h3 className="font-heading font-semibold text-foreground mb-2">Refund Policy</h3><p className="text-sm text-muted-foreground">{pkg.refund_policy}</p></div>}
                </div>
              )}

              {/* Testimonials */}
              {testimonials.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">What Others Say</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {testimonials.map((t) => (
                      <div key={t.id} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2 mb-2">
                          {t.rating && <div className="flex gap-0.5 text-accent"><Star className="h-4 w-4 fill-current" /></div>}
                          <span className="text-sm font-medium text-foreground">{t.name}</span>
                          {t.location && <span className="text-xs text-muted-foreground">• {t.location}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">{t.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Package FAQs</h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqs.map((faq, i) => (
                      <AccordionItem key={faq.id} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-5">
                        <AccordionTrigger className="text-sm font-medium text-foreground hover:text-accent py-4">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-accent/20 bg-card p-6" style={{ boxShadow: "var(--shadow-gold)" }}>
                <div className="mb-4">
                  {pkg.original_price && <span className="text-xs text-muted-foreground line-through">₹{Number(pkg.original_price).toLocaleString()}</span>}
                  <p className="text-3xl font-bold text-accent">₹{Number(pkg.price).toLocaleString()}</p>
                  <span className="text-xs text-muted-foreground">per person</span>
                  {pkg.original_price && (
                    <Badge className="ml-2 bg-emerald/20 text-emerald-light border-none text-xs">
                      Save ₹{(Number(pkg.original_price) - Number(pkg.price)).toLocaleString()}
                    </Badge>
                  )}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration</span><span className="text-foreground font-medium">{pkg.duration}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Hotel</span><span className="text-foreground font-medium">{pkg.five_star ? "5-Star" : "4-Star"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Flight</span><span className="text-foreground font-medium">{pkg.direct_flight ? "Direct" : "Connecting"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Meals</span><span className="text-foreground font-medium">{pkg.meals_included ? "Included" : "Not included"}</span></div>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Assalamualaikum,\n\nI am interested in the ${pkg.title}.\n\nPlease share complete details and availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-gold-light text-base py-6 font-semibold gap-2">
                    <MessageCircle className="h-5 w-5" /> Book on WhatsApp
                  </Button>
                </a>
                <p className="mt-4 text-center text-xs text-muted-foreground">No payment required now. Our team will contact you.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PackageDetail;
