import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminQuotes = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    const { data } = await supabase.from("islamic_quotes").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, ...payload } = editing;
    if (id) { await supabase.from("islamic_quotes").update(payload).eq("id", id); }
    else { await supabase.from("islamic_quotes").insert(payload); }
    toast({ title: "Saved!" }); setDialogOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("islamic_quotes").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Islamic Quotes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ text: "", source: "", published: true })} className="bg-accent text-accent-foreground hover:bg-gold-light"><Plus className="h-4 w-4 mr-2" /> Add</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader><DialogTitle className="font-heading text-foreground">{editing?.id ? "Edit" : "New"} Quote</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3 mt-4">
                <div><Label className="text-foreground">Quote Text</Label><Input value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Source</Label><Input value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div className="flex items-center gap-2"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /><Label className="text-foreground">Published</Label></div>
                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {items.map((q) => (
          <div key={q.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div><p className="text-sm text-foreground italic">"{q.text}"</p><p className="text-xs text-muted-foreground mt-1">— {q.source}</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(q); setDialogOpen(true); }} className="text-muted-foreground hover:text-accent"><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(q.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuotes;
