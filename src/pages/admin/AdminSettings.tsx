import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    const map: Record<string, string> = {};
    (data || []).forEach((s) => { map[s.key] = s.value || ""; });
    setSettings(map);
    setLoading(false);
  };

  const updateSetting = async (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    await supabase.from("site_settings").update({ value }).eq("key", key);
  };

  const handleSave = () => {
    toast({ title: "Settings saved!" });
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Site Settings</h1>
      <div className="max-w-lg space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">Contact</h2>
          <div>
            <Label className="text-foreground">Phone Number</Label>
            <Input
              value={settings.phone_number || ""}
              onChange={(e) => updateSetting("phone_number", e.target.value)}
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.phone_enabled === "true"}
              onCheckedChange={(v) => updateSetting("phone_enabled", v.toString())}
            />
            <Label className="text-foreground">Show Phone Number</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.whatsapp_enabled === "true"}
              onCheckedChange={(v) => updateSetting("whatsapp_enabled", v.toString())}
            />
            <Label className="text-foreground">Enable WhatsApp Link</Label>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">Branding</h2>
          <div>
            <Label className="text-foreground">Logo URL</Label>
            <Input
              value={settings.logo_url || ""}
              onChange={(e) => updateSetting("logo_url", e.target.value)}
              placeholder="Leave empty for default"
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.gold_accent === "true"}
              onCheckedChange={(v) => updateSetting("gold_accent", v.toString())}
            />
            <Label className="text-foreground">Gold Accent Theme</Label>
          </div>
        </div>

        <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-gold-light">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
