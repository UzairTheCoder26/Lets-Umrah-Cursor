import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type BlogPostType = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useDocumentTitle(post?.meta_title || post?.title || "Blog");

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      setPost((data as BlogPostType) || null);
      setLoading(false);
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {loading ? (
            <div className="text-accent">Loading article...</div>
          ) : !post ? (
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
                Article not found
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                The blog post you are looking for may have been unpublished or removed.
              </p>
              <Link
                to="/blog"
                className="text-accent text-sm font-medium hover:underline"
              >
                ← Back to Blog
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-2">
                {post.category || "General"} ·{" "}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground mb-6">
                  {post.excerpt}
                </p>
              )}
              <div className="prose prose-invert prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                {post.content}
              </div>
              <div className="mt-8">
                <Link
                  to="/blog"
                  className="text-accent text-sm font-medium hover:underline"
                >
                  ← Back to Blog
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

