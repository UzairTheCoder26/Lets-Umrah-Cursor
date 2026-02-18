import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminTestimonials = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const empty = { name: "", location: "", rating: 5, text: "", video_url: "", is_video: false, published: true, package_id: null };

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, ...payload } = editing;
    if (!payload.package_id) payload.package_id = null;
    if (id) {
      await supabase.from("testimonials").update(payload).eq("id", id);
      toast({ title: "Updated!" });
    } else {
      await supabase.from("testimonials").insert(payload);
      toast({ title: "Created!" });
    }
    setDialogOpen(false); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Deleted" }); fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Testimonials</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...empty })} className="bg-accent text-accent-foreground hover:bg-gold-light">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader><DialogTitle className="font-heading text-foreground">{editing?.id ? "Edit" : "New"} Testimonial</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3 mt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label className="text-foreground">Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                  <div><Label className="text-foreground">Location</Label><Input value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                </div>
                <div><Label className="text-foreground">Rating (1-5)</Label><Input type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Text</Label><Textarea value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div className="flex items-center gap-2"><Switch checked={editing.is_video} onCheckedChange={(v) => setEditing({ ...editing, is_video: v })} /><Label className="text-foreground">Video Testimonial</Label></div>
                {editing.is_video && <div><Label className="text-foreground">Video URL</Label><Input value={editing.video_url || ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} className="bg-muted border-border text-foreground" /></div>}
                <div className="flex items-center gap-2"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /><Label className="text-foreground">Published</Label></div>
                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">{editing.id ? "Update" : "Create"}</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t.name} {!t.published && <span className="text-muted-foreground">· Draft</span>}</h3>
              <p className="text-xs text-muted-foreground">{t.text?.substring(0, 80)}...</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(t); setDialogOpen(true); }} className="text-muted-foreground hover:text-accent"><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
