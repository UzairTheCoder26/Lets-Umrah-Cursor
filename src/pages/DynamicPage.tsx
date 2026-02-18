import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const routeToSlug: Record<string, string> = {
  "/about": "about",
  "/contact": "contact",
  "/privacy": "privacy",
  "/terms": "terms",
  "/refund-policy": "refund-policy",
  "/cancellation-policy": "cancellation-policy",
  "/faq": "faq",
};

const DynamicPage = () => {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const slug = paramSlug || routeToSlug[location.pathname] || "";
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
      setPage(data);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-accent">Loading...</div>;
  if (!page) return <div className="min-h-screen bg-background"><Header /><main className="pt-32 text-center"><h1 className="font-heading text-3xl text-foreground">Page Not Found</h1></main><Footer /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">{page.title}</h1>
          <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {page.content}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DynamicPage;
