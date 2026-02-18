import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CustomerBookingDetail from "./pages/CustomerBookingDetail";
import DynamicPage from "./pages/DynamicPage";
import FaqPage from "./pages/FaqPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminFaqs from "./pages/admin/AdminFaqs";
import AdminPages from "./pages/admin/AdminPages";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminTrustBadges from "./pages/admin/AdminTrustBadges";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/booking/:bookingId" element={<CustomerBookingDetail />} />
            <Route path="/page/:slug" element={<DynamicPage />} />
            <Route path="/about" element={<DynamicPage />} />
            <Route path="/contact" element={<DynamicPage />} />
            <Route path="/privacy" element={<DynamicPage />} />
            <Route path="/terms" element={<DynamicPage />} />
            <Route path="/refund-policy" element={<DynamicPage />} />
            <Route path="/cancellation-policy" element={<DynamicPage />} />
            <Route path="/faq" element={<FaqPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="faqs" element={<AdminFaqs />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="trust-badges" element={<AdminTrustBadges />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
