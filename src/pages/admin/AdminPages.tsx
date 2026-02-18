import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminPages = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("pages").select("*").order("title");
    setPages(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, updated_at, ...payload } = editing;
    await supabase.from("pages").update(payload).eq("id", id);
    toast({ title: "Page updated!" });
    setDialogOpen(false); fetchData();
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Pages</h1>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader><DialogTitle className="font-heading text-foreground">Edit Page</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3 mt-4">
              <div><Label className="text-foreground">Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bg-muted border-border text-foreground" /></div>
              <div><Label className="text-foreground">Content</Label><Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={10} className="bg-muted border-border text-foreground" /></div>
              <div><Label className="text-foreground">Meta Title (SEO)</Label><Input value={editing.meta_title || ""} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} className="bg-muted border-border text-foreground" /></div>
              <div><Label className="text-foreground">Meta Description (SEO)</Label><Textarea value={editing.meta_description || ""} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} rows={2} className="bg-muted border-border text-foreground" /></div>
              <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="space-y-3">
        {pages.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div><h3 className="text-sm font-semibold text-foreground">{p.title}</h3><p className="text-xs text-muted-foreground">/{p.slug}</p></div>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setDialogOpen(true); }} className="text-muted-foreground hover:text-accent"><Pencil className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPages;
