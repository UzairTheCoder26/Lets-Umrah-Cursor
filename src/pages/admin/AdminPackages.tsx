import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
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
  };

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
    setPackages(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, updated_at, seats_booked, rating, early_bird_price, early_bird_end_date, hotel_makkah_details, hotel_madinah_details, ...payload } = editing;

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
                    <Label className="text-foreground">Title</Label>
                    <Input value={editing.title} onChange={(e) => updateField("title", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Slug</Label>
                    <Input value={editing.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="auto-generated" className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Duration</Label>
                    <Input value={editing.duration} onChange={(e) => updateField("duration", e.target.value)} placeholder="e.g. 14 Days / 13 Nights" className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Cover Image URL</Label>
                    <Input value={editing.cover_image} onChange={(e) => updateField("cover_image", e.target.value)} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Price (₹)</Label>
                    <Input type="number" value={editing.price} onChange={(e) => updateField("price", Number(e.target.value))} className="bg-muted border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Original Price (₹)</Label>
                    <Input type="number" value={editing.original_price} onChange={(e) => updateField("original_price", Number(e.target.value))} className="bg-muted border-border text-foreground" />
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
                  onClick={() => { setEditing(pkg); setDialogOpen(true); }}
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
