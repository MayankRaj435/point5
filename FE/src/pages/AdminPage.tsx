// src/pages/AdminPage.tsx

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { AdminCrudPanel } from "../components/admin/AdminCrudPanel";

import { ContactEntriesPanel } from "../components/admin/ContactEntriesPanel";

import { BlogCrudPanel } from "../components/admin/BlogCrudPanel";

import { PortfolioCrudPanel } from "../components/admin/PortfolioCrudPanel";

export const AdminPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <section className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40 mb-2">
              Point5 Dashboard
            </p>

            <h1 className="text-4xl font-bold">Admin Panel</h1>

            <p className="text-white/50 mt-2">
              Manage contacts, blogs, and portfolio cards.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* ADMIN MANAGEMENT */}
        <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-semibold">Admin Management</h2>

            <p className="text-white/50 mt-1">
              Create and manage admin accounts.
            </p>
          </div>

          <div className="p-6">
            <AdminCrudPanel />
          </div>
        </div>

        {/* BLOG CRUD */}
        <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-semibold">Blogs Management</h2>

            <p className="text-white/50 mt-1">
              Create, edit, publish, and delete blogs.
            </p>
          </div>

          <div className="p-6">
            <BlogCrudPanel />
          </div>
        </div>

        {/* PORTFOLIO CRUD */}
        <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-semibold">Portfolio Cards</h2>

            <p className="text-white/50 mt-1">
              Manage portfolio showcase cards and projects.
            </p>
          </div>

          <div className="p-6">
            <PortfolioCrudPanel />
          </div>
        </div>

        {/* CONTACT ENTRIES */}
        <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-semibold">Contact Entries</h2>

            <p className="text-white/50 mt-1">
              View all contact form submissions.
            </p>
          </div>

          <div className="p-6">
            <ContactEntriesPanel />
          </div>
        </div>
      </section>
    </main>
  );
};
