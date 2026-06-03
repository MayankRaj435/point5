// src/components/admin/PortfolioCrudPanel.tsx

import { useEffect, useState } from "react";

import {useNavigate} from "react-router-dom"

import { deletePortfolioCard, getPortfolioCards } from "../../api/portfolio";

import type { PortfolioCard } from "../../types/portfolio";

export const PortfolioCrudPanel = () => {
  const SERVICE_TYPES = [
    "ALL",
    "BRANDING",
    "SOCIAL_MEDIA_MANAGEMENT",
    "DIGITAL_MARKETING",
    "BRAND_PRODUCT_SHOOTS",
    "WEDDING",
    "EVENT_PHOTOGRAPHY_VIDEOGRAPHY",
    "WEBSITE_DEVELOPMENT_MANAGEMENT",
  ];

  const navigate = useNavigate();

  const [activeService, setActiveService] = useState("ALL");

  const [portfolioCards, setPortfolioCards] = useState<PortfolioCard[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredCards =
    activeService === "ALL"
      ? portfolioCards
      : portfolioCards.filter((card) => card.serviceType === activeService);

  const fetchPortfolioCards = async () => {
    try {
      setLoading(true);

      const data = await getPortfolioCards();

      setPortfolioCards(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to fetch portfolio cards",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioCards();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this portfolio card?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deletePortfolioCard(id);

      setPortfolioCards((prev) => prev.filter((card) => card.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete portfolio card");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-white/60">
        Loading portfolio cards...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/20 bg-red-500/10 text-red-300 rounded-2xl px-4 py-3">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Portfolio Cards</h3>

          <p className="text-white/50 text-sm mt-1">
            Manage all portfolio showcase entries.
          </p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition">
          Create Portfolio Card
        </button>
      </div>

      {/* SERVICE FILTERS */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {SERVICE_TYPES.map((service) => {
            const count =
              service === "ALL"
                ? portfolioCards.length
                : portfolioCards.filter((card) => card.serviceType === service)
                    .length;

            return (
              <button
                key={service}
                onClick={() => setActiveService(service)}
                className={`px-5 py-3 rounded-2xl border text-sm whitespace-nowrap transition-all ${
                  activeService === service
                    ? "bg-white text-black border-white"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10"
                }`}
              >
                {service.replaceAll("_", " ")} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredCards.length === 0 && (
        <div className="border border-dashed border-white/10 rounded-2xl py-16 text-center text-white/50">
          No portfolio cards found.
        </div>
      )}

      {/* CARDS */}
      <div className="grid gap-5">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="border border-white/10 bg-white/[0.03] rounded-3xl overflow-hidden"
          >
            <div className="grid md:grid-cols-[220px_1fr]">
              {/* IMAGE */}
              <div className="bg-black min-h-[220px]">
                {card.logo ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${card.logo}`}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                    No Logo
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col justify-between gap-6">
                <div>
                  {/* TOP META */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {card.serviceType && (
                      <span className="px-3 py-1 rounded-full border border-white/10 text-xs text-white/60">
                        {card.serviceType.replaceAll("_", " ")}
                      </span>
                    )}

                    {card.category && (
                      <span className="px-3 py-1 rounded-full border border-white/10 text-xs text-white/60">
                        {card.category}
                      </span>
                    )}

                    {card.featured && (
                      <span className="px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-300 text-xs">
                        Featured
                      </span>
                    )}

                    <span className="text-white/30 text-sm">#{card.id}</span>
                  </div>

                  {/* NAME */}
                  <h4 className="text-2xl font-semibold mb-2">{card.name}</h4>

                  {/* TAGLINE */}
                  {card.tagline && (
                    <p className="text-white/40 text-sm mb-4">{card.tagline}</p>
                  )}

                  {/* DESCRIPTION */}
                  <p className="text-white/50 leading-relaxed line-clamp-4">
                    {card.description}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
                    onClick={() => navigate(`/admin/portfolio/edit/${card.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(card.id)}
                    disabled={deletingId === card.id}
                    className="px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition disabled:opacity-50"
                  >
                    {deletingId === card.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
