import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Packages", path: "/packages" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "logo_url")
        .maybeSingle();

      const value = data?.value || "https://i.postimg.cc/sx9tHXwG/LOGO.png";
      setLogoUrl(value);
    };

    fetchLogo();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Let's Umrah logo"
              className="h-12 w-auto object-contain"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center">
              <span className="font-heading text-lg font-bold text-accent">LU</span>
            </div>
          )}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname === link.path ? "text-accent" : "text-muted-foreground"}`}>
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-accent text-xs">Admin</Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-muted-foreground hover:text-accent">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">Login</Button>
              </Link>
              <Link to="/packages">
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light">Book Now</Button>
              </Link>
            </div>
          )}
        </nav>

        <button className="text-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`text-sm font-medium ${location.pathname === link.path ? "text-accent" : "text-muted-foreground"}`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-accent">Admin Panel</Link>}
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Dashboard</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); navigate("/"); }} className="text-left text-sm text-muted-foreground">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Login</Link>
                <Link to="/packages" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-gold-light">Book Now</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
