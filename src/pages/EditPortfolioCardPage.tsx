// src/pages/EditPortfolioCardPage.tsx

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import * as ColorThief from "colorthief";
const SERVICE_TYPES = [
  "BRANDING",
  "SOCIAL_MEDIA_MANAGEMENT",
  "DIGITAL_MARKETING",
  "BRAND_PRODUCT_SHOOTS",
  "WEDDING",
  "EVENT_PHOTOGRAPHY_VIDEOGRAPHY",
  "WEBSITE_DEVELOPMENT_MANAGEMENT",
];

import {
  createPortfolioCard,
  updatePortfolioCard,
  getPortfolioCardById,
} from "../api/portfolio";

export const EditPortfolioCardPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  /* =========================================================
     BASIC FIELDS
  ========================================================= */

  const [name, setName] = useState("");

  const [slug, setSlug] = useState("");

  const [category, setCategory] = useState("");

  const [tagline, setTagline] = useState("");

  const [description, setDescription] = useState("");

  const [serviceType, setServiceType] = useState("BRANDING");

  const [displayOrder, setDisplayOrder] = useState(0);

  const [featured, setFeatured] = useState(false);

  const [published, setPublished] = useState(true);

  /* =========================================================
     MEDIA
  ========================================================= */

  const [logo, setLogo] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");

  /* =========================================================
     COLORS
  ========================================================= */

  const [accent, setAccent] = useState("#ffffff");

  const [bgFrom, setBgFrom] = useState("#111111");

  const [bgTo, setBgTo] = useState("#000000");

  const [palette, setPalette] = useState<string[]>([]);

  /* =========================================================
     ARRAYS
  ========================================================= */

  const [deliverables, setDeliverables] = useState<string[]>([]);

  const [deliverableInput, setDeliverableInput] = useState("");

  const [tags, setTags] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState("");

  /* =========================================================
     AUTO SLUG
  ========================================================= */

  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    setSlug(generatedSlug);
  }, [name]);

  /* =========================================================
   LOAD EXISTING CARD
========================================================= */

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    const loadPortfolioCard = async () => {
      try {
        setLoading(true);

        const card = await getPortfolioCardById(id);

        if (!card) {
          return;
        }

        setName(card.name || "");

        setSlug(card.slug || "");

        setCategory(card.category || "");

        setTagline(card.tagline || "");

        setDescription(card.description || "");

        setServiceType(card.serviceType || "BRANDING");

        setFeatured(Boolean(card.featured));

        setPublished(Boolean(card.published));

        setDisplayOrder(card.displayOrder || 0);

        setAccent(card.accent || "#ffffff");

        /* =====================
           GRADIENT PARSING
        ===================== */

        const bg = card.bg || "";

        const fromMatch = bg.match(/from-\[(.*?)\]/);

        const toMatch = bg.match(/to-\[(.*?)\]/);

        setBgFrom(fromMatch?.[1] || "#111111");

        setBgTo(toMatch?.[1] || "#000000");

        setDeliverables(card.deliverables || []);

        setTags(card.tags || []);

        /* =====================
           EXISTING LOGO
        ===================== */

        if (card.logo) {
          setLogoPreview(`${import.meta.env.VITE_BACKEND_URL}${card.logo}`);
        }
      } catch (err) {
        console.error("Failed to load portfolio card:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioCard();
  }, [id, isEditMode]);

  /* =========================================================
     LOGO PREVIEW
  ========================================================= */

  useEffect(() => {
    if (!logo) {
      return;
    }

    const preview = URL.createObjectURL(logo);

    setLogoPreview(preview);

    return () => URL.revokeObjectURL(preview);
  }, [logo]);

  /* =========================================================
     AUTO COLOR EXTRACTION
  ========================================================= */

  const extractColors = async (file: File) => {
    const image = new Image();

    image.crossOrigin = "Anonymous";

    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const paletteData = ColorThief.getPaletteSync(image, {
        colorCount: 6,
      });

      if (!paletteData) {
        return;
      }

      const extractedPalette = paletteData.map((color) => color.hex());

      setPalette(extractedPalette);

      setAccent(extractedPalette[0]);

      setBgFrom(extractedPalette[1] || extractedPalette[0]);

      setBgTo(
        extractedPalette[2] || extractedPalette[1] || extractedPalette[0],
      );
    };
  };

  /* =========================================================
     ARRAY HELPERS
  ========================================================= */

  const addDeliverable = () => {
    if (!deliverableInput.trim()) {
      return;
    }

    setDeliverables((prev) => [...prev, deliverableInput.trim()]);

    setDeliverableInput("");
  };

  const addTag = () => {
    if (!tagInput.trim()) {
      return;
    }

    setTags((prev) => [...prev, tagInput.trim()]);

    setTagInput("");
  };

  /* =========================================================
     SUBMIT
  ========================================================= */
  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        name,
        slug,
        category,
        tagline,
        description,
        accent,
        bg: `from-[${bgFrom}] to-[${bgTo}]`,
        deliverables,
        serviceType,
        featured,
        published,
        displayOrder,
        tags,
        logo,
      };

      if (isEditMode && id) {
        await updatePortfolioCard(id, payload);
      } else {
        await createPortfolioCard(payload);
      }

      navigate("/admin");
    } catch (err) {
      console.error("Portfolio save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading portfolio card...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TOP */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-white/40 uppercase tracking-[0.3em] text-sm mb-3">
              Portfolio CMS
            </p>

            <h1 className="text-5xl font-bold">
              {isEditMode ? "Edit Portfolio Card" : "Create Portfolio Card"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition"
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-white text-black font-semibold"
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Portfolio"
                  : "Create Portfolio"}
            </button>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_420px] gap-8">
          {/* LEFT */}
          <div className="space-y-8">
            {/* BASIC INFO */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold mb-8">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Project Name"
                  value={name}
                  onChange={setName}
                  placeholder="Tea Castle"
                />

                <Input
                  label="Slug"
                  value={slug}
                  onChange={setSlug}
                  placeholder="tea-castle"
                />

                <Input
                  label="Category"
                  value={category}
                  onChange={setCategory}
                  placeholder="Food & Beverage"
                />

                <div>
                  <label className="text-sm text-white/40 block mb-2">
                    Service Type
                  </label>

                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 outline-none"
                  >
                    {SERVICE_TYPES.map((service) => (
                      <option key={service} value={service}>
                        {service.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Input
                  label="Tagline"
                  value={tagline}
                  onChange={setTagline}
                  placeholder="A Journey-Worthy Brand Experience"
                />
              </div>

              <div className="mt-6">
                <label className="text-sm text-white/40 block mb-2">
                  Description
                </label>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 outline-none resize-none"
                />
              </div>
            </div>

            {/* DELIVERABLES */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold mb-6">Deliverables</h2>

              <div className="flex gap-3">
                <input
                  value={deliverableInput}
                  onChange={(e) => setDeliverableInput(e.target.value)}
                  placeholder="Add deliverable"
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 outline-none"
                />

                <button
                  onClick={addDeliverable}
                  className="px-5 rounded-2xl bg-white text-black font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-5">
                {deliverables.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* TAGS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold mb-6">Tags</h2>

              <div className="flex gap-3">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 outline-none"
                />

                <button
                  onClick={addTag}
                  className="px-5 rounded-2xl bg-white text-black font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-5">
                {tags.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"
                  >
                    #{item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* LOGO */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold mb-6">Logo Upload</h2>

              {logoPreview && (
                <div
                  className="rounded-3xl overflow-hidden mb-6 border border-white/10"
                  style={{
                    background: `linear-gradient(
    135deg,
    ${bgFrom},
    ${bgTo}
  )`,
                  }}
                >
                  <div className="h-72 flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  setLogo(file);

                  extractColors(file);
                }}
                className="w-full"
              />
            </div>

            {/* COLORS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold mb-6">Brand Colors</h2>

              {/* MANUAL PICKERS */}
              <div className="space-y-6">
                <AdvancedColorPicker
                  label="Accent Color"
                  value={accent}
                  onChange={setAccent}
                  palette={palette}
                />

                <AdvancedColorPicker
                  label="Background From"
                  value={bgFrom}
                  onChange={setBgFrom}
                  palette={palette}
                />

                <AdvancedColorPicker
                  label="Background To"
                  value={bgTo}
                  onChange={setBgTo}
                  palette={palette}
                />
              </div>

              {/* LIVE PREVIEW */}
              <div
                className="mt-8 rounded-3xl border border-white/10 p-8"
                style={{
                  background: `linear-gradient(
    135deg,
    ${bgFrom},
    ${bgTo} 
  )`,
                }}
              >
                <div
                  className="text-4xl font-bold"
                  style={{
                    color: accent,
                  }}
                >
                  {name || "Preview"}
                </div>

                <p className="text-white/70 mt-3">
                  {tagline || "Live branding preview"}
                </p>

                <div className="flex gap-3 mt-6">
                  <div
                    className="w-14 h-14 rounded-2xl border border-white/10"
                    style={{
                      background: accent,
                    }}
                  />

                  <div
                    className="w-14 h-14 rounded-2xl border border-white/10"
                    style={{
                      background: `linear-gradient(
    135deg,
    ${bgFrom},
    ${bgTo}
  )`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* SETTINGS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold mb-6">Controls</h2>

              <div className="space-y-5">
                <label className="flex items-center justify-between">
                  <span>Featured</span>

                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span>Published</span>

                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                </label>

                <div>
                  <label className="text-sm text-white/40 block mb-2">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   REUSABLE INPUT
========================================================= */

const Input = ({ label, value, onChange, placeholder }: any) => {
  return (
    <div>
      <label className="text-sm text-white/40 block mb-2">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 outline-none"
      />
    </div>
  );
};

/* =========================================================
   ADVANCED COLOR PICKER
========================================================= */

const AdvancedColorPicker = ({ label, value, onChange, palette }: any) => {
  const [hexInput, setHexInput] = useState(value);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const isValidHex = (hex: string) => /^#([0-9A-Fa-f]{6})$/.test(hex);

  const commitHex = (nextValue: string) => {
    if (!isValidHex(nextValue)) {
      setHexInput(value);

      return;
    }

    const normalized = nextValue.toLowerCase();

    setHexInput(normalized);

    onChange(normalized);
  };

  return (
    <div className="relative">
      <label className="text-sm text-white/40 block mb-3">{label}</label>

      <div className="flex items-center gap-3">
        <input
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={() => commitHex(hexInput)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitHex(hexInput);
            }
          }}
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 outline-none"
        />

        <input
          type="color"
          value={isValidHex(value) ? value : "#000000"}
          onChange={(e) => commitHex(e.target.value)}
          className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-transparent"
        />

        <button
          type="button"
          onClick={() => setIsPaletteOpen((prev) => !prev)}
          className="px-5 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition"
        >
          Pick
        </button>
      </div>

      {isPaletteOpen && (
        <div className="absolute left-0 right-0 mt-3 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-3 z-10">
          {palette.length > 0 ? (
            <div className="grid grid-cols-6 gap-2">
              {palette.map((color: string) => (
                <button
                  key={`${label}-${color}`}
                  type="button"
                  onClick={() => {
                    onChange(color);

                    setHexInput(color);

                    setIsPaletteOpen(false);
                  }}
                  className="h-10 rounded-xl border border-white/10 hover:scale-105 transition-transform"
                  style={{ background: color }}
                  aria-label={`Use ${color}`}
                  title={color}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40 px-1 py-1">
              Upload a logo to extract brand colors.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
