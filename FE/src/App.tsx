// src/App.tsx

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import { EditBlogPage } from "./pages/EditBlogPage";

import { EditPortfolioCardPage } from "./pages/EditPortfolioCardPage";

import { AnimatePresence } from "motion/react";

import { useEffect } from "react";

import { Header } from "./components/Header";

import { Footer } from "./components/Footer";

import { CustomCursor } from "./components/CustomCursor";

import { ScrollProgress } from "./components/ScrollProgress";

import { ProtectedRoute } from "./components/ProtectedRoute";

import { ensureGsap } from "./motion/gsap";

import { useLenis } from "./motion/useLenis";

/* ================= WEBSITE PAGES ================= */

import { HomePage } from "./pages/HomePage";

import { AboutPage } from "./pages/AboutPage";

import { ServicesPage } from "./pages/ServicesPage";

import { ServiceDetailPage } from "./pages/ServiceDetailPage";

import { ContactPage } from "./pages/ContactPage";

import { BlogPage } from "./pages/BlogPage";

import { BlogDetailsPage } from "./pages/BlogDetailsPage";

/* ================= ADMIN PAGES ================= */

import { AdminPage } from "./pages/AdminPage";

import { AdminLoginPage } from "./pages/AdminLoginPage";

/* =========================================================
   SCROLL TO TOP
========================================================= */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 550);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

/* =========================================================
   WEBSITE LAYOUT
========================================================= */

const WebsiteLayout = () => {
  return (
    <>
      <ScrollProgress />

      <CustomCursor />

      <Header />

      <Outlet />

      <Footer />
    </>
  );
};

/* =========================================================
   APP ROUTES
========================================================= */

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* WEBSITE ROUTES */}
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />

          <Route path="/services" element={<ServicesPage />} />

          <Route path="/services/:slug" element={<ServiceDetailPage />} />

          <Route path="/blog" element={<BlogPage />} />

          <Route path="/blog/:id" element={<BlogDetailsPage />} />

          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/blogs/edit/:id"
          element={
            <ProtectedRoute>
              <EditBlogPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/portfolio/edit/:id"
          element={
            <ProtectedRoute>
              <EditPortfolioCardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/blogs/create"
          element={
            <ProtectedRoute>
              <EditBlogPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

/* =========================================================
   APP
========================================================= */

function App() {
  useLenis();

  useEffect(() => {
    ensureGsap();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
