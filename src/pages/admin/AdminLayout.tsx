import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { Package, Users, FileText, MessageSquare, Settings, BarChart3, BookOpen, Image, Quote, LogOut, Home, CreditCard } from "lucide-react";

const adminNavItems = [
  { label: "Dashboard", path: "/admin", icon: BarChart3 },
  { label: "Packages", path: "/admin/packages", icon: Package },
  { label: "Bookings", path: "/admin/bookings", icon: CreditCard },
  { label: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },
  { label: "FAQs", path: "/admin/faqs", icon: BookOpen },
  { label: "Pages", path: "/admin/pages", icon: FileText },
  { label: "Blog", path: "/admin/blog", icon: FileText },
  { label: "Quotes", path: "/admin/quotes", icon: Quote },
  { label: "Trust Badges", path: "/admin/trust-badges", icon: Image },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-accent">Loading...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} border-r border-border bg-card flex flex-col transition-all duration-200 shrink-0`}>
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shrink-0">
              <span className="font-heading text-sm font-bold text-accent-foreground">LU</span>
            </div>
            {sidebarOpen && <span className="font-heading text-sm font-bold text-foreground">Admin Panel</span>}
          </Link>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                location.pathname === item.path
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t border-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Home className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>View Site</span>}
          </Link>
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
