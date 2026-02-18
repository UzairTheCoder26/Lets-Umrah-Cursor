import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Packages", path: "/packages" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <span className="font-heading text-lg font-bold text-accent-foreground">LU</span>
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold leading-none text-foreground">
              Let's <span className="text-accent">Umrah</span>
            </h1>
          </div>
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
