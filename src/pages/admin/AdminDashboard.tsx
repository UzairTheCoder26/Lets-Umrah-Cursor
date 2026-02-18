import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Users, CreditCard, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ packages: 0, bookings: 0, revenue: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchStats = async () => {
    const [pkgs, bookings] = await Promise.all([
      supabase.from("packages").select("id", { count: "exact" }),
      supabase.from("bookings").select("total_price, payment_status"),
    ]);

    const totalRevenue = (bookings.data || []).reduce((sum, b) => sum + Number(b.total_price || 0), 0);
    const pendingCount = (bookings.data || []).filter((b) => b.payment_status === "pending").length;

    setStats({
      packages: pkgs.count || 0,
      bookings: bookings.data?.length || 0,
      revenue: totalRevenue,
      pending: pendingCount,
    });
  };

  const fetchRecentBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, packages(title)")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentBookings(data || []);
  };

  const statCards = [
    { label: "Total Packages", value: stats.packages, icon: Package, color: "text-accent" },
    { label: "Total Bookings", value: stats.bookings, icon: Users, color: "text-emerald-light" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-gold" },
    { label: "Pending Payments", value: stats.pending, icon: CreditCard, color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 text-muted-foreground font-medium">Customer</th>
                  <th className="pb-2 text-muted-foreground font-medium">Package</th>
                  <th className="pb-2 text-muted-foreground font-medium">Amount</th>
                  <th className="pb-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/50">
                    <td className="py-3 text-foreground">{b.customer_name}</td>
                    <td className="py-3 text-muted-foreground">{b.packages?.title || "N/A"}</td>
                    <td className="py-3 text-foreground">₹{Number(b.total_price).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        b.payment_status === "completed" ? "bg-emerald/20 text-emerald-light" :
                        b.payment_status === "partial" ? "bg-accent/20 text-accent" :
                        "bg-gold/20 text-gold"
                      }`}>
                        {b.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
