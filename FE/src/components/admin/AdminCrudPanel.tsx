// src/components/admin/AdminCrudPanel.tsx

import { useEffect, useState } from "react";
import {
    deleteAdmin as deleteAdminAPI,
    getAllAdmins,
    signupAdmin,
} from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import type { Admin } from "../../types/admin";

export const AdminCrudPanel = () => {
  const { user: currentUser } = useAuth();

  // LIST STATE
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [listError, setListError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationKey: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch admins on mount
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setListError("");
      const response = await getAllAdmins();
      setAdmins(response.admins || []);
    } catch (err: any) {
      const status = err?.response?.status;
      let errorMsg = "Failed to fetch admins";

      if (status === 401) {
        errorMsg = "Unauthorized: Session expired";
      } else if (status === 403) {
        errorMsg = "Forbidden: You do not have permission";
      } else if (status === 404) {
        errorMsg = "Not found";
      } else if (status === 500) {
        errorMsg = "Server error: Please try again later";
      } else {
        errorMsg = err?.response?.data?.message || errorMsg;
      }

      setListError(errorMsg);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // FORM HANDLERS
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    setFormError("");

    if (!formData.email.trim()) {
      setFormError("Email is required");
      return false;
    }

    if (!formData.name.trim()) {
      setFormError("Name is required");
      return false;
    }

    if (!formData.password.trim()) {
      setFormError("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError("");

      await signupAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        registrationKey: formData.registrationKey,
      });

      // Reset form and refresh list
      setFormData({ name: "", email: "", password: "", registrationKey: "" });
      setSuccessMessage("Admin created successfully!");

      // Refresh the admin list
      await fetchAdmins();
    } catch (err: any) {
      const status = err?.response?.status;
      let errorMsg = "Failed to create admin";

      if (status === 401) {
        errorMsg = "Unauthorized: Session expired";
      } else if (status === 403) {
        errorMsg = "Forbidden: You do not have permission";
      } else if (status === 404) {
        errorMsg = "Not found";
      } else if (status === 500) {
        errorMsg = "Server error: Please try again later";
      } else {
        errorMsg = err?.response?.data?.message || errorMsg;
      }

      setFormError(errorMsg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // DELETE HANDLER
  const handleDelete = async (id: number, adminName: string) => {
    const confirmed = window.confirm(
      `Delete admin "${adminName}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setListError("");

      await deleteAdminAPI(id);

      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      setSuccessMessage("Admin deleted successfully!");
    } catch (err: any) {
      const status = err?.response?.status;
      let errorMsg = "Failed to delete admin";

      if (status === 401) {
        errorMsg = "Unauthorized: Session expired";
      } else if (status === 403) {
        errorMsg = "Forbidden: You do not have permission";
      } else if (status === 404) {
        errorMsg = "Admin not found";
      } else if (status === 500) {
        errorMsg = "Server error: Please try again later";
      } else {
        errorMsg = err?.response?.data?.message || errorMsg;
      }

      setListError(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="border border-green-500/30 bg-green-500/10 text-green-300 text-sm rounded-2xl px-4 py-3">
          {successMessage}
        </div>
      )}

      {/* CREATE FORM */}
      <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-6">
        <h3 className="text-xl font-semibold mb-6">Create Admin</h3>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Admin name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 focus:border-white/30 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 focus:border-white/30 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 focus:border-white/30 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">
                Registration Key
              </label>
              <input
                type="text"
                name="registrationKey"
                placeholder="ADMIN_REGISTRATION_KEY"
                value={formData.registrationKey}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 focus:border-white/30 outline-none transition"
              />
            </div>
          </div>

          {formError && (
            <div className="border border-red-500/20 bg-red-500/10 text-red-300 text-sm rounded-2xl px-4 py-3">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={formSubmitting}
            className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {formSubmitting ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      {/* ADMINS LIST */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">All Admins</h3>
          <p className="text-white/50 text-sm mt-1">Manage admin accounts.</p>
        </div>

        {listError && (
          <div className="border border-red-500/20 bg-red-500/10 text-red-300 rounded-2xl px-4 py-3">
            {listError}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-white/60">
            Loading admins...
          </div>
        ) : admins.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl py-12 text-center text-white/50">
            No admins found.
          </div>
        ) : (
          <div className="border border-white/10 rounded-3xl overflow-hidden">
            {/* TABLE HEADER */}
            <div className="bg-white/[0.02] border-b border-white/10 grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-6 py-4 text-sm font-semibold text-white/70">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Actions</div>
            </div>

            {/* TABLE ROWS */}
            <div>
              {admins.map((admin, index) => (
                <div
                  key={admin.id}
                  className={`grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-6 py-5 text-sm items-center ${
                    index !== admins.length - 1 ? "border-b border-white/5" : ""
                  } hover:bg-white/[0.02] transition`}
                >
                  {/* NAME */}
                  <div>
                    <p className="font-medium">{admin.name || "N/A"}</p>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <p className="text-white/70">{admin.email}</p>
                  </div>

                  {/* ROLE */}
                  <div>
                    <span className="text-xs px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
                      {admin.role || "user"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">
                    {currentUser?.id === admin.id ? (
                      <span className="text-xs px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300">
                        Current User
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleDelete(admin.id, admin.name || "Unknown")
                        }
                        disabled={deletingId === admin.id}
                        className="px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition disabled:opacity-50 text-xs font-medium"
                      >
                        {deletingId === admin.id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
