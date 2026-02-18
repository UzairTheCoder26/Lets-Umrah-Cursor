
-- =============================================
-- ROLE SYSTEM
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PACKAGES
-- =============================================
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  duration TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  cover_image TEXT,
  hotel_makkah TEXT,
  hotel_madinah TEXT,
  hotel_makkah_details JSONB DEFAULT '{}',
  hotel_madinah_details JSONB DEFAULT '{}',
  distance_makkah TEXT,
  distance_madinah TEXT,
  direct_flight BOOLEAN DEFAULT false,
  five_star BOOLEAN DEFAULT false,
  meals_included BOOLEAN DEFAULT false,
  visa_included BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  total_seats INTEGER DEFAULT 50,
  seats_booked INTEGER DEFAULT 0,
  show_scarcity BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 4.5,
  early_bird_price NUMERIC,
  early_bird_end_date TIMESTAMPTZ,
  itinerary JSONB DEFAULT '[]',
  included JSONB DEFAULT '[]',
  not_included JSONB DEFAULT '[]',
  cancellation_policy TEXT,
  refund_policy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published packages" ON public.packages
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can do everything with packages" ON public.packages
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PACKAGE FAQS
-- =============================================
CREATE TABLE public.package_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.package_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view package FAQs" ON public.package_faqs
  FOR SELECT USING (true);
CREATE POLICY "Admins manage package FAQs" ON public.package_faqs
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TESTIMONIALS
-- =============================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  video_url TEXT,
  is_video BOOLEAN DEFAULT false,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published testimonials" ON public.testimonials
  FOR SELECT USING (published = true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- BOOKINGS
-- =============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  departure_date DATE,
  total_price NUMERIC NOT NULL DEFAULT 0,
  payment_percentage NUMERIC DEFAULT 0,
  remaining_balance NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed')),
  booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all bookings" ON public.bookings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PAYMENT HISTORY
-- =============================================
CREATE TABLE public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  payment_mode TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  proof_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payment history" ON public.payment_history
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()));
CREATE POLICY "Admins manage payment history" ON public.payment_history
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('phone_number', '+91 7006016700'),
  ('phone_enabled', 'true'),
  ('whatsapp_enabled', 'true'),
  ('logo_url', ''),
  ('primary_color', '#0B3D2E'),
  ('gold_accent', 'true');

-- =============================================
-- PAGES (About, Contact, Privacy, etc.)
-- =============================================
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published pages" ON public.pages
  FOR SELECT USING (published = true);
CREATE POLICY "Admins manage pages" ON public.pages
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert default pages
INSERT INTO public.pages (slug, title, content) VALUES
  ('about', 'About Us', 'Let''s Umrah is your trusted partner for premium Umrah experiences. We are dedicated to providing seamless, spiritually enriching journeys with verified partners and transparent pricing.'),
  ('contact', 'Contact Us', 'Get in touch with us for any queries about our Umrah packages.'),
  ('privacy', 'Privacy Policy', 'Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.'),
  ('terms', 'Terms & Conditions', 'By using Let''s Umrah services, you agree to the following terms and conditions.'),
  ('refund-policy', 'Refund Policy', 'Our refund policy ensures fair treatment for all our customers.'),
  ('cancellation-policy', 'Cancellation Policy', 'Cancellation terms vary by package. Please review your specific package terms.');

-- =============================================
-- GENERAL FAQS
-- =============================================
CREATE TABLE public.general_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.general_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published FAQs" ON public.general_faqs
  FOR SELECT USING (published = true);
CREATE POLICY "Admins manage FAQs" ON public.general_faqs
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert default FAQs
INSERT INTO public.general_faqs (question, answer, sort_order) VALUES
  ('How do I book an Umrah package?', 'Simply browse our packages, select one that suits your needs, and click Book Now. Our team will guide you through the entire process.', 1),
  ('What documents do I need?', 'You will need a valid passport (with at least 6 months validity), passport-size photographs, vaccination certificates, and any additional documents as per visa requirements.', 2),
  ('Is visa processing included?', 'Yes, most of our packages include Umrah visa processing. Please check the specific package details for confirmation.', 3),
  ('Can I customize my package?', 'Yes, we offer customization options. Contact our team to discuss your specific requirements and preferences.', 4),
  ('What is your cancellation policy?', 'Cancellation policies vary by package. Generally, free cancellation is available up to 30 days before departure.', 5),
  ('Do you provide travel insurance?', 'Premium and luxury packages include comprehensive travel insurance. For economy packages, insurance can be added as an optional extra.', 6);

-- =============================================
-- BLOG POSTS
-- =============================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs" ON public.blog_posts
  FOR SELECT USING (published = true);
CREATE POLICY "Admins manage blogs" ON public.blog_posts
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TRUST BADGES (Logos, certifications, etc.)
-- =============================================
CREATE TABLE public.trust_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('certification', 'airline', 'hotel', 'endorsement', 'why_choose_us')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trust_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published badges" ON public.trust_badges
  FOR SELECT USING (published = true);
CREATE POLICY "Admins manage badges" ON public.trust_badges
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- ISLAMIC QUOTES
-- =============================================
CREATE TABLE public.islamic_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  source TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.islamic_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published quotes" ON public.islamic_quotes
  FOR SELECT USING (published = true);
CREATE POLICY "Admins manage quotes" ON public.islamic_quotes
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert default quotes
INSERT INTO public.islamic_quotes (text, source) VALUES
  ('And complete the Hajj and Umrah for Allah.', 'Quran 2:196'),
  ('The performers of Hajj and Umrah are guests of Allah.', 'Ibn Majah'),
  ('One Umrah to the next is an expiation for what comes in between them.', 'Sahih Muslim'),
  ('O Allah, make it an accepted Hajj and forgive sins.', 'Dua of Ibrahim (AS)');

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
