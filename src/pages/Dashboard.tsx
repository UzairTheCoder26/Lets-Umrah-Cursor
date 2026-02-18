import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Package, Calendar, CreditCard, Clock, CheckCircle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, packages(title, duration, cover_image, hotel_makkah, hotel_madinah)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-accent">Loading...</div>
      </div>
    );
  }

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return "hsl(160 70% 30%)";
    if (pct >= 31) return "hsl(43 45% 56%)";
    return "hsl(0 84% 60%)";
  };

  const statusColors: Record<string, string> = {
    pending: "bg-destructive/20 text-destructive",
    partial: "bg-accent/20 text-accent",
    completed: "bg-emerald/20 text-emerald-light",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
            <p className="text-muted-foreground mb-8">Welcome back, {user?.email}</p>
          </motion.div>

          {bookings.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading text-xl text-foreground mb-2">No bookings yet</h2>
              <p className="text-muted-foreground text-sm">Your booking details will appear here once confirmed by our team.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const pct = Number(booking.payment_percentage) || 0;
                const amountPaid = Number(booking.total_price) - Number(booking.remaining_balance);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border bg-card p-6"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-foreground">
                          {booking.packages?.title || "Package"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{booking.packages?.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={statusColors[booking.payment_status] || "bg-muted text-muted-foreground"}>
                          {booking.payment_status}
                        </Badge>
                        <Badge className="bg-secondary text-secondary-foreground">
                          {booking.booking_status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-muted-foreground text-xs">Confirmed Departure</p>
                          <p className="text-foreground font-medium">
                            {booking.departure_date ? new Date(booking.departure_date + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "TBD"}
                          </p>
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
                        <Clock className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-muted-foreground text-xs">Remaining</p>
                          <p className="text-foreground font-medium">₹{Number(booking.remaining_balance).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment progress */}
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

                    {/* Hotels */}
                    {booking.packages && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-muted p-3">
                          <p className="text-xs text-muted-foreground">Makkah Hotel</p>
                          <p className="text-sm text-foreground font-medium">{booking.packages.hotel_makkah}</p>
                        </div>
                        <div className="rounded-xl bg-muted p-3">
                          <p className="text-xs text-muted-foreground">Madinah Hotel</p>
                          <p className="text-sm text-foreground font-medium">{booking.packages.hotel_madinah}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-border">
                      <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground gap-2">
                        <Link to={`/dashboard/booking/${booking.id}`}>
                          <Eye className="h-4 w-4" /> View Details
                        </Link>
                      </Button>
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

export default Dashboard;
