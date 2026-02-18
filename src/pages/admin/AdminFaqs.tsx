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

const AdminFaqs = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("general_faqs").select("*").order("sort_order");
    setItems(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, ...payload } = editing;
    if (id) {
      await supabase.from("general_faqs").update(payload).eq("id", id);
      toast({ title: "Updated!" });
    } else {
      await supabase.from("general_faqs").insert(payload);
      toast({ title: "Created!" });
    }
    setDialogOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("general_faqs").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">FAQs</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ question: "", answer: "", sort_order: 0, published: true })} className="bg-accent text-accent-foreground hover:bg-gold-light">
              <Plus className="h-4 w-4 mr-2" /> Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader><DialogTitle className="font-heading text-foreground">{editing?.id ? "Edit" : "New"} FAQ</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3 mt-4">
                <div><Label className="text-foreground">Question</Label><Input value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Answer</Label><Textarea value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="bg-muted border-border text-foreground" /></div>
                <div className="flex items-center gap-2"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /><Label className="text-foreground">Published</Label></div>
                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">{editing.id ? "Update" : "Create"}</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div><h3 className="text-sm font-semibold text-foreground">{f.question}</h3><p className="text-xs text-muted-foreground">{f.answer?.substring(0, 80)}...</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(f); setDialogOpen(true); }} className="text-muted-foreground hover:text-accent"><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(f.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFaqs;
