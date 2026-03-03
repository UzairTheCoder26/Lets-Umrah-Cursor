import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  created_at: string;
};

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentTitle("Blog");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      setPosts((data as BlogPost[]) || []);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-muted-foreground mb-10 max-w-2xl text-sm">
            Insights, tips, and guides to help you plan a smooth and spiritually fulfilling Umrah journey.
          </p>

          {loading ? (
            <div className="text-accent">Loading articles...</div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No blog posts have been published yet. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-accent/60 hover:shadow-lg transition-all"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {post.category || "General"} ·{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-3 inline-block text-xs font-medium text-accent">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;

