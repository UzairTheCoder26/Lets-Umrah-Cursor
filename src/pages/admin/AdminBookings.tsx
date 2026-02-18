import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [newPayment, setNewPayment] = useState({ amount: 0, payment_mode: "", notes: "" });
  const { toast } = useToast();

  const emptyBooking = {
    customer_name: "", customer_email: "", customer_phone: "",
    package_id: "", departure_date: "", total_price: 0,
    payment_percentage: 0, remaining_balance: 0,
    payment_status: "pending", booking_status: "confirmed", notes: "",
  };

  useEffect(() => {
    fetchBookings();
    fetchPackages();
  }, []);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, packages(title)")
      .order("created_at", { ascending: false });
    setBookings(data || []);
  };

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("id, title").eq("published", true);
    setPackages(data || []);
  };

  const fetchPaymentHistory = async (bookingId: string) => {
    const { data } = await supabase
      .from("payment_history")
      .select("*")
      .eq("booking_id", bookingId)
      .order("payment_date", { ascending: false });
    setPaymentHistory(data || []);
  };

  // Look up user_id from profiles table by email
  const findUserByEmail = async (email: string): Promise<string | null> => {
    if (!email) return null;
    const { data } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();
    return data?.user_id || null;
  };

  const handleSave = async () => {
    const { id, created_at, updated_at, packages: _pkg, user_id: _uid, ...payload } = editing;

    // Calculate remaining
    const paidAmount = (payload.total_price * payload.payment_percentage) / 100;
    payload.remaining_balance = payload.total_price - paidAmount;

    // Auto-link to user by email
    const userId = await findUserByEmail(payload.customer_email);
    if (userId) {
      payload.user_id = userId;
    }

    if (id) {
      const { error } = await supabase.from("bookings").update(payload).eq("id", id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Booking updated!" });
    } else {
      if (userId) payload.user_id = userId;
      const { error } = await supabase.from("bookings").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Booking created!" });
    }
    setDialogOpen(false);
    setEditing(null);
    fetchBookings();
  };

  const handleMarkFullyPaid = async (booking: any) => {
    await supabase.from("bookings").update({
      payment_percentage: 100,
      remaining_balance: 0,
      payment_status: "completed",
    }).eq("id", booking.id);
    toast({ title: "Marked as fully paid!" });
    fetchBookings();
  };

  const handleAddPayment = async () => {
    if (!selectedBooking) return;
    const { error } = await supabase.from("payment_history").insert({
      booking_id: selectedBooking.id,
      amount: newPayment.amount,
      payment_mode: newPayment.payment_mode,
      notes: newPayment.notes,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }

    const totalPaid = paymentHistory.reduce((sum, p) => sum + Number(p.amount), 0) + newPayment.amount;
    const percentage = Math.min(100, Math.round((totalPaid / Number(selectedBooking.total_price)) * 100));
    const remaining = Math.max(0, Number(selectedBooking.total_price) - totalPaid);
    const status = percentage >= 100 ? "completed" : percentage > 0 ? "partial" : "pending";

    await supabase.from("bookings").update({
      payment_percentage: percentage,
      remaining_balance: remaining,
      payment_status: status,
    }).eq("id", selectedBooking.id);

    toast({ title: "Payment recorded!" });
    setNewPayment({ amount: 0, payment_mode: "", notes: "" });
    fetchPaymentHistory(selectedBooking.id);
    fetchBookings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    toast({ title: "Booking deleted" });
    fetchBookings();
  };

  const updateField = (field: string, value: any) => {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return "hsl(160 70% 30%)";
    if (pct >= 31) return "hsl(43 45% 56%)";
    return "hsl(0 84% 60%)";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-destructive/20 text-destructive",
      partial: "bg-accent/20 text-accent",
      completed: "bg-emerald/20 text-emerald-light",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Bookings</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...emptyBooking })} className="bg-accent text-accent-foreground hover:bg-gold-light">
              <Plus className="h-4 w-4 mr-2" /> Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">{editing?.id ? "Edit Booking" : "New Booking"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-foreground">Customer Name</Label>
                  <Input value={editing.customer_name} onChange={(e) => updateField("customer_name", e.target.value)} className="bg-muted border-border text-foreground" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-foreground">Email</Label>
                    <Input value={editing.customer_email || ""} onChange={(e) => updateField("customer_email", e.target.value)} className="bg-muted border-border text-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">Booking auto-links to user account if email matches.</p>
                  </div>
                  <div>
                    <Label className="text-foreground">Phone</Label>
                    <Input value={editing.customer_phone || ""} onChange={(e) => updateField("customer_phone", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">Package</Label>
                  <Select value={editing.package_id || ""} onValueChange={(v) => updateField("package_id", v)}>
                    <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue placeholder="Select package" /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {packages.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-foreground">Confirmed Departure Date</Label>
                    <Input type="date" value={editing.departure_date || ""} onChange={(e) => updateField("departure_date", e.target.value)} className="bg-muted border-border text-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">This overrides tentative dates for this customer. Required when assigning a booking.</p>
                  </div>
                  <div>
                    <Label className="text-foreground">Total Price (₹)</Label>
                    <Input type="number" value={editing.total_price} onChange={(e) => updateField("total_price", Number(e.target.value))} className="bg-muted border-border text-foreground" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-foreground">Payment %</Label>
                    <Input type="number" value={editing.payment_percentage} onChange={(e) => updateField("payment_percentage", Number(e.target.value))} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Payment Status</Label>
                    <Select value={editing.payment_status} onValueChange={(v) => updateField("payment_status", v)}>
                      <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">Booking Status</Label>
                  <Select value={editing.booking_status} onValueChange={(v) => updateField("booking_status", v)}>
                    <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-foreground">Notes</Label>
                  <Textarea value={editing.notes || ""} onChange={(e) => updateField("notes", e.target.value)} className="bg-muted border-border text-foreground" />
                </div>
                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">
                  {editing.id ? "Update" : "Create"} Booking
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment History Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground">Payment History — {selectedBooking?.customer_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {paymentHistory.length > 0 && (
              <div className="space-y-2">
                {paymentHistory.map((p) => (
                  <div key={p.id} className="rounded-lg bg-muted p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">₹{Number(p.amount).toLocaleString()}</span>
                      <span className="text-muted-foreground text-xs">{new Date(p.payment_date).toLocaleDateString()}</span>
                    </div>
                    {p.payment_mode && <p className="text-xs text-muted-foreground mt-1">Mode: {p.payment_mode}</p>}
                    {p.notes && <p className="text-xs text-muted-foreground">{p.notes}</p>}
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Record New Payment</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-foreground text-xs">Amount (₹)</Label>
                  <Input type="number" value={newPayment.amount} onChange={(e) => setNewPayment(p => ({ ...p, amount: Number(e.target.value) }))} className="bg-muted border-border text-foreground" />
                </div>
                <div>
                  <Label className="text-foreground text-xs">Mode</Label>
                  <Input value={newPayment.payment_mode} onChange={(e) => setNewPayment(p => ({ ...p, payment_mode: e.target.value }))} placeholder="Bank / UPI / Cash" className="bg-muted border-border text-foreground" />
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-foreground text-xs">Notes</Label>
                <Input value={newPayment.notes} onChange={(e) => setNewPayment(p => ({ ...p, notes: e.target.value }))} className="bg-muted border-border text-foreground" />
              </div>
              <Button onClick={handleAddPayment} className="w-full mt-3 bg-accent text-accent-foreground hover:bg-gold-light" size="sm">
                Record Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookings list */}
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No bookings yet.</p>
        ) : (
          bookings.map((b) => {
            const pct = Number(b.payment_percentage) || 0;
            return (
              <div key={b.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{b.customer_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {b.packages?.title || "No package"} · ₹{Number(b.total_price).toLocaleString()}
                      {b.departure_date && ` · ${b.departure_date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(b.payment_status)}`}>
                      {b.payment_status}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedBooking(b); fetchPaymentHistory(b.id); setPaymentDialogOpen(true); }} className="text-muted-foreground hover:text-accent text-xs">
                        Payments
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(b); setDialogOpen(true); }} className="text-muted-foreground hover:text-accent">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Payment: ₹{(Number(b.total_price) - Number(b.remaining_balance)).toLocaleString()} / ₹{Number(b.total_price).toLocaleString()}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: getProgressColor(pct) }}
                    />
                  </div>
                  {b.payment_status !== "completed" && (
                    <button
                      onClick={() => handleMarkFullyPaid(b)}
                      className="mt-2 text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      Mark as Fully Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
