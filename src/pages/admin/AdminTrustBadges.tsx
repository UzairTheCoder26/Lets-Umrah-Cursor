import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminTrustBadges = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    const { data } = await supabase.from("trust_badges").select("*").order("sort_order");
    setItems(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, ...payload } = editing;
    if (id) { await supabase.from("trust_badges").update(payload).eq("id", id); }
    else { await supabase.from("trust_badges").insert(payload); }
    toast({ title: "Saved!" }); setDialogOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("trust_badges").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Trust Badges</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ category: "certification", title: "", description: "", image_url: "", sort_order: 0, published: true })} className="bg-accent text-accent-foreground hover:bg-gold-light"><Plus className="h-4 w-4 mr-2" /> Add</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader><DialogTitle className="font-heading text-foreground">{editing?.id ? "Edit" : "New"} Badge</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3 mt-4">
                <div><Label className="text-foreground">Category</Label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="airline">Airline Partner</SelectItem>
                      <SelectItem value="hotel">Hotel Partner</SelectItem>
                      <SelectItem value="endorsement">Endorsement</SelectItem>
                      <SelectItem value="why_choose_us">Why Choose Us</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-foreground">Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Description</Label><Input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Image URL</Label><Input value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="bg-muted border-border text-foreground" /></div>
                <div className="flex items-center gap-2"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /><Label className="text-foreground">Published</Label></div>
                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {items.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div><h3 className="text-sm font-semibold text-foreground">{b.title}</h3><p className="text-xs text-muted-foreground">{b.category}</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(b); setDialogOpen(true); }} className="text-muted-foreground hover:text-accent"><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTrustBadges;
