import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, Star, MapPin, Utensils, Clock, CheckCircle, XCircle, Building, Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import packageMakkah from "@/assets/package-makkah.jpg";

const CustomerBookingDetail = () => {
  const { bookingId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [pkg, setPkg] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && bookingId) {
      const fetch = async () => {
        const { data: bookingData, error } = await supabase
          .from("bookings")
          .select("*, packages(*)")
          .eq("id", bookingId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error || !bookingData) {
          setLoading(false);
          return;
        }

        setBooking(bookingData);
        const pkgData = bookingData.packages;
        setPkg(pkgData);

        if (pkgData) {
          const { data: faqData } = await supabase.from("package_faqs").select("*").eq("package_id", pkgData.id).order("sort_order");
          setFaqs(faqData || []);
          const { data: pkgTestimonials } = await supabase.from("testimonials").select("*").eq("published", true).eq("package_id", pkgData.id).order("created_at", { ascending: false }).limit(6);
          const { data: generalTestimonials } = await supabase.from("testimonials").select("*").eq("published", true).is("package_id", null).order("created_at", { ascending: false }).limit(6);
          setTestimonials((pkgTestimonials?.length ?? 0) > 0 ? (pkgTestimonials || []) : (generalTestimonials || []));
        }

        setLoading(false);
      };
      fetch();
    } else if (!bookingId) {
      setLoading(false);
    }
  }, [user, bookingId]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-accent">
        Loading...
      </div>
    );
  }

  if (!booking || !pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 text-center px-4">
          <h1 className="font-heading text-3xl text-foreground">Booking Not Found</h1>
          <Link to="/dashboard" className="mt-4 inline-block text-accent hover:underline">← Back to Dashboard</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const included = Array.isArray(pkg.included) ? pkg.included : [];
  const notIncluded = Array.isArray(pkg.not_included) ? pkg.not_included : [];
  const pct = Number(booking.payment_percentage) || 0;
  const amountPaid = Number(booking.total_price) - Number(booking.remaining_balance);

  const getProgressColor = (p: number) => {
    if (p >= 80) return "hsl(160 70% 30%)";
    if (p >= 31) return "hsl(43 45% 56%)";
    return "hsl(0 84% 60%)";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
          <img src={pkg.cover_image || packageMakkah} alt={pkg.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <Link to="/dashboard" className="text-accent text-sm flex items-center gap-1 mb-3 hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{pkg.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration}</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-accent" /> {pkg.rating}</span>
                <Badge className="bg-emerald/20 text-emerald-light border-emerald/30 font-medium px-3 py-1">
                  Booked
                </Badge>
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

              {/* Payment Info */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Your Booking & Payment</h2>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-xs">Departure Date</p>
                      <p className="text-foreground font-medium">{booking.departure_date || "TBD"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-xs">Total Price</p>
                      <p className="text-foreground font-medium">₹{Number(booking.total_price).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-xs">Amount Paid</p>
                      <p className="text-foreground font-medium">₹{amountPaid.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-muted-foreground text-xs">Remaining</p>
                      <p className="text-foreground font-medium">₹{Number(booking.remaining_balance).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Payment Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getProgressColor(pct) }}
                    />
                  </div>
                </div>
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
                      <h3 className="font-heading font-semibold text-foreground mb-3">What&apos;s Included</h3>
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

            {/* Sidebar - Booked badge only, no booking button */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-accent/20 bg-card p-6" style={{ boxShadow: "var(--shadow-gold)" }}>
                <div className="mb-4 flex items-center gap-2">
                  <Badge className="bg-emerald/20 text-emerald-light border-emerald/30 font-medium px-3 py-1.5 text-sm">
                    Booked
                  </Badge>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-accent">₹{Number(booking.total_price).toLocaleString()}</p>
                  <span className="text-xs text-muted-foreground">total booking amount</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Departure</span><span className="text-foreground font-medium">{booking.departure_date || "TBD"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><span className="text-foreground font-medium capitalize">{booking.booking_status}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Payment</span><span className="text-foreground font-medium">{pct}% paid</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerBookingDetail;
