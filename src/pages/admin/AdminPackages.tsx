import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminPackages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const emptyPackage = {
    title: "", slug: "", duration: "", price: 0, original_price: 0,
    cover_image: "", hotel_makkah: "", hotel_madinah: "",
    distance_makkah: "", distance_madinah: "",
    direct_flight: false, five_star: false, meals_included: false, visa_included: false,
    featured: false, published: true, total_seats: 50,
    show_scarcity: true, cancellation_policy: "", refund_policy: "",
    itinerary: [], included: [], not_included: [],
    overview: "", departure_note: "Final departure date will be discussed and confirmed on WhatsApp.",
    departure_dates: [] as { tentative_date: string; note: string }[],
  };

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
    setPackages(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, updated_at, seats_booked, rating, early_bird_price, early_bird_end_date, hotel_makkah_details, hotel_madinah_details, ...payload } = editing;
    payload.departure_dates = (payload.departure_dates || []).filter((d: any) => d?.tentative_date?.trim()).map((d: any) => ({ tentative_date: d.tentative_date, note: d.note || "" }));
    if (payload.departure_dates.length < 1) {
      toast({ title: "Add at least one departure date", variant: "destructive" });
      return;
    }

    // Auto-generate slug
    if (!payload.slug) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    if (id) {
      const { error } = await supabase.from("packages").update(payload).eq("id", id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Package updated!" });
    } else {
      const { error } = await supabase.from("packages").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Package created!" });
    }
    setDialogOpen(false);
    setEditing(null);
    fetchPackages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    await supabase.from("packages").delete().eq("id", id);
    toast({ title: "Package deleted" });
    fetchPackages();
  };

  const updateField = (field: string, value: any) => {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Packages</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...emptyPackage })} className="bg-accent text-accent-foreground hover:bg-gold-light">
              <Plus className="h-4 w-4 mr-2" /> Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">{editing?.id ? "Edit Package" : "New Package"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-foreground">Package Name</Label>
                    <Input value={editing.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Premium Umrah Experience" className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Slug</Label>
                    <Input value={editing.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="auto-generated" className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Duration</Label>
                    <Input value={editing.duration} onChange={(e) => updateField("duration", e.target.value)} placeholder="e.g. 20 Days" className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Starting Price (₹)</Label>
                    <Input type="number" value={editing.price} onChange={(e) => updateField("price", Number(e.target.value))} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Original Price (₹)</Label>
                    <Input type="number" value={editing.original_price} onChange={(e) => updateField("original_price", Number(e.target.value))} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Cover Image URL</Label>
                    <Input value={editing.cover_image} onChange={(e) => updateField("cover_image", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Makkah Hotel</Label>
                    <Input value={editing.hotel_makkah} onChange={(e) => updateField("hotel_makkah", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Madinah Hotel</Label>
                    <Input value={editing.hotel_madinah} onChange={(e) => updateField("hotel_madinah", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Distance from Haram (Makkah)</Label>
                    <Input value={editing.distance_makkah} onChange={(e) => updateField("distance_makkah", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Distance from Masjid Nabawi</Label>
                    <Input value={editing.distance_madinah} onChange={(e) => updateField("distance_madinah", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Total Seats</Label>
                    <Input type="number" value={editing.total_seats} onChange={(e) => updateField("total_seats", Number(e.target.value))} className="bg-muted border-border text-foreground" />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "direct_flight", label: "Direct Flight" },
                    { key: "five_star", label: "5-Star Hotel" },
                    { key: "meals_included", label: "Meals Included" },
                    { key: "visa_included", label: "Visa Included" },
                    { key: "featured", label: "Featured" },
                    { key: "published", label: "Published" },
                    { key: "show_scarcity", label: "Show Seats Left" },
                  ].map((toggle) => (
                    <div key={toggle.key} className="flex items-center gap-2">
                      <Switch
                        checked={editing[toggle.key]}
                        onCheckedChange={(v) => updateField(toggle.key, v)}
                      />
                      <Label className="text-sm text-foreground">{toggle.label}</Label>
                    </div>
                  ))}
                </div>

                {/* Departure Dates */}
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                  <Label className="text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    Departure Dates (minimum 1)
                  </Label>
                  <p className="text-xs text-muted-foreground">Add tentative dates. These are informational only, not clickable.</p>
                  {(editing.departure_dates || []).length === 0 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => updateField("departure_dates", [{ tentative_date: "", note: "" }])} className="border-accent text-accent">
                      <Plus className="h-3 w-3 mr-1" /> Add Departure Date
                    </Button>
                  )}
                  {(editing.departure_dates || []).map((d: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <Input value={d.tentative_date || ""} onChange={(e) => {
                          const arr = [...(editing.departure_dates || [])];
                          arr[idx] = { ...arr[idx], tentative_date: e.target.value };
                          updateField("departure_dates", arr);
                        }} placeholder="e.g. Around 10 March 2026" className="bg-muted border-border text-foreground" />
                        <Input value={d.note || ""} onChange={(e) => {
                          const arr = [...(editing.departure_dates || [])];
                          arr[idx] = { ...arr[idx], note: e.target.value };
                          updateField("departure_dates", arr);
                        }} placeholder="Optional note (e.g. Subject to airline confirmation)" className="bg-muted border-border text-foreground text-sm" />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => {
                        const arr = (editing.departure_dates || []).filter((_: any, i: number) => i !== idx);
                        updateField("departure_dates", arr);
                      }} className="text-destructive hover:text-destructive shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(editing.departure_dates || []).length > 0 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => updateField("departure_dates", [...(editing.departure_dates || []), { tentative_date: "", note: "" }])} className="border-accent text-accent">
                      <Plus className="h-3 w-3 mr-1" /> Add Another
                    </Button>
                  )}
                </div>

                {/* Departure Note (editable) */}
                <div>
                  <Label className="text-foreground">Departure Confirmation Note</Label>
                  <Textarea value={editing.departure_note || ""} onChange={(e) => updateField("departure_note", e.target.value)} placeholder="Final departure date will be discussed and confirmed on WhatsApp." className="bg-muted border-border text-foreground" rows={2} />
                  <p className="text-xs text-muted-foreground mt-1">Shown on package detail page below departure dates.</p>
                </div>

                {/* Package Overview */}
                <div>
                  <Label className="text-foreground">Package Overview / Details</Label>
                  <Textarea value={editing.overview || ""} onChange={(e) => updateField("overview", e.target.value)} placeholder="Describe spiritual experience, hotel comfort, location, group type, overall offering. Supports paragraphs and basic formatting." className="bg-muted border-border text-foreground min-h-[120px]" />
                </div>

                <div>
                  <Label className="text-foreground">Cancellation Policy</Label>
                  <Textarea value={editing.cancellation_policy || ""} onChange={(e) => updateField("cancellation_policy", e.target.value)} className="bg-muted border-border text-foreground" />
                </div>
                <div>
                  <Label className="text-foreground">Refund Policy</Label>
                  <Textarea value={editing.refund_policy || ""} onChange={(e) => updateField("refund_policy", e.target.value)} className="bg-muted border-border text-foreground" />
                </div>

                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">
                  {editing.id ? "Update Package" : "Create Package"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Package list */}
      <div className="space-y-3">
        {packages.length === 0 ? (
          <p className="text-muted-foreground text-sm">No packages yet. Create your first package.</p>
        ) : (
          packages.map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{pkg.title}</h3>
                <p className="text-xs text-muted-foreground">{pkg.duration} · ₹{Number(pkg.price).toLocaleString()} {!pkg.published && "· Unpublished"}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setEditing({ ...emptyPackage, ...pkg, departure_dates: pkg.departure_dates || [] }); setDialogOpen(true); }}
                  className="text-muted-foreground hover:text-accent"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(pkg.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPackages;
