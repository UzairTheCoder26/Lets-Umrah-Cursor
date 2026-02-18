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

const AdminBlog = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  const handleSave = async () => {
    const { id, created_at, updated_at, ...payload } = editing;
    if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (id) {
      await supabase.from("blog_posts").update(payload).eq("id", id);
      toast({ title: "Updated!" });
    } else {
      await supabase.from("blog_posts").insert(payload);
      toast({ title: "Created!" });
    }
    setDialogOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Blog Posts</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ title: "", slug: "", content: "", excerpt: "", category: "", published: false, meta_title: "", meta_description: "" })} className="bg-accent text-accent-foreground hover:bg-gold-light">
              <Plus className="h-4 w-4 mr-2" /> Add Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
            <DialogHeader><DialogTitle className="font-heading text-foreground">{editing?.id ? "Edit" : "New"} Post</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3 mt-4">
                <div><Label className="text-foreground">Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Excerpt</Label><Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Content</Label><Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={10} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">Category</Label><Input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">SEO Title</Label><Input value={editing.meta_title || ""} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} className="bg-muted border-border text-foreground" /></div>
                <div><Label className="text-foreground">SEO Description</Label><Textarea value={editing.meta_description || ""} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} rows={2} className="bg-muted border-border text-foreground" /></div>
                <div className="flex items-center gap-2"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /><Label className="text-foreground">Published</Label></div>
                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light">{editing.id ? "Update" : "Create"}</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div><h3 className="text-sm font-semibold text-foreground">{p.title} {!p.published && <span className="text-muted-foreground">· Draft</span>}</h3><p className="text-xs text-muted-foreground">{p.category || "Uncategorized"}</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setDialogOpen(true); }} className="text-muted-foreground hover:text-accent"><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;
