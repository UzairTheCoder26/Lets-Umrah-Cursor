import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["phone_number"]);

      const map: Record<string, string> = {};
      (data || []).forEach((s: any) => {
        if (s.value) {
          map[s.key] = s.value as string;
        }
      });

      if (map.phone_number) {
        setPhoneNumber(map.phone_number);
      }
    };

    fetchSettings();
  }, []);

  const displayPhone = phoneNumber || "+91 7006016700";
  const telHref = `tel:${displayPhone.replace(/[^0-9+]/g, "")}`;

  return (
    <footer className="islamic-pattern border-t border-border bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="font-heading text-lg font-bold text-accent-foreground">LU</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Let's <span className="text-accent">Umrah</span>
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for a blessed and seamless Umrah experience. We ensure every step of your spiritual journey is taken care of.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Packages", path: "/packages" },
                { label: "About Us", path: "/about" },
                { label: "Contact Us", path: "/contact" },
                { label: "FAQ", path: "/faq" },
                { label: "Blog", path: "/blog" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Policies</h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms & Conditions", path: "/terms" },
                { label: "Refund Policy", path: "/refund-policy" },
                { label: "Cancellation Policy", path: "/cancellation-policy" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {displayPhone && (
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-accent" />
                  <a href={telHref} className="hover:text-accent">
                    {displayPhone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:hafizuxair26@gmail.com" className="hover:text-accent">hafizuxair26@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-accent" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Let's Umrah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
