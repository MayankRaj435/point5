import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { signinAdmin, getMe } from "../api/auth";

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMe();

        navigate("/admin");
      } catch (error) {
        // not authenticated
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await signinAdmin({
        email: formData.email,
        password: formData.password,
      });

      navigate("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40 mb-3">
            Point5
          </p>

          <h1 className="text-4xl font-bold mb-2">Admin Login</h1>

          <p className="text-white/50">Sign in to access the admin panel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/60 mb-2">Email</label>

            <input
              type="email"
              name="email"
              placeholder="admin@point5.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 focus:border-white/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Password</label>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 focus:border-white/30 outline-none transition"
            />
          </div>

          {error && (
            <div className="border border-red-500/20 bg-red-500/10 text-red-300 text-sm rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full border border-white/10 text-white font-semibold py-3 rounded-2xl hover:bg-white/5 transition"
          >
            Back to Home
          </button>
        </form>
      </div>
    </main>
  );
};
