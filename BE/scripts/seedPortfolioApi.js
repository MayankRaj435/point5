
// scripts/seedPortfolioViaApi.js

import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const API_BASE = "http://localhost:5000/api";
const ADMIN_EMAIL = "umeshaditya72@gmail.com";
const ADMIN_PASSWORD = "Aditya123!";

/* =========================================================
   LOGIN + COOKIE EXTRACTION
========================================================= */

async function login() {
  console.log("🔐 Logging in...");

  const response = await axios.post(
    `${API_BASE}/admin/signin`,
    {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
    {
      withCredentials: true,
    }
  );

  const cookies = response.headers["set-cookie"];

  if (!cookies?.length) {
    throw new Error("❌ No auth cookie received");
  }

  console.log("✅ Authenticated");

  return cookies.map((c) => c.split(";")[0]).join("; ");
}

/* =========================================================
   PORTFOLIO DATA
========================================================= */

const portfolioCards = [
   {
    slug: "tea-castle-social",
    name: "Tea Castle Social Media",
    category: "Social Media",
    tagline: "Building a Consistent Digital Presence",
    description:
      "We handled Tea Castle's social media strategy, content planning, reels, and engagement campaigns to boost online visibility and audience interaction.",
    logo: "tea-castle.png",
    accent: "#7A9E3B",
    bg: "from-[#0d1508] to-[#0d0d0d]",
    deliverables: [
      "Instagram Management",
      "Content Strategy",
      "Reels Production",
      "Creative Posts",
      "Monthly Analytics",
    ],
    serviceType: "SOCIAL_MEDIA_MANAGEMENT",
    featured: true,
    published: true,
    displayOrder: 5,
    tags: ["social-media", "instagram", "tea"],
  },

  {
    slug: "mahajan-greens-social",
    name: "Mahajan Greens Social Campaigns",
    category: "Hospitality",
    tagline: "Driving Engagement Through Storytelling",
    description:
      "We created engaging social campaigns and event promotions for Mahajan Greens across Instagram and Facebook.",
    logo: "mahajan-greens.png",
    accent: "#C9A84C",
    bg: "from-[#0d1508] to-[#0d0d0d]",
    deliverables: [
      "Instagram Strategy",
      "Event Promotions",
      "Story Designs",
      "Short-form Videos",
      "Creative Direction",
    ],
    serviceType: "SOCIAL_MEDIA_MANAGEMENT",
    featured: true,
    published: true,
    displayOrder: 6,
    tags: ["social-media", "events", "hospitality"],
  },

  // =========================
  // DIGITAL MARKETING
  // =========================

  {
    slug: "sarvaga-growth-campaign",
    name: "Sarvaga Growth Campaign",
    category: "Fashion Marketing",
    tagline: "Performance-Driven Digital Campaigns",
    description:
      "We executed SEO, Meta Ads, and targeted marketing campaigns for Sarvaga Fashions to increase reach and conversions.",
    logo: "sarvaga-fashions.png",
    accent: "#9B59B6",
    bg: "from-[#150a1a] to-[#0d0d0d]",
    deliverables: [
      "SEO Optimization",
      "Meta Ads",
      "Audience Targeting",
      "Campaign Analytics",
      "Performance Reports",
    ],
    serviceType: "DIGITAL_MARKETING",
    featured: true,
    published: true,
    displayOrder: 7,
    tags: ["digital-marketing", "fashion", "meta-ads"],
  },

  {
    slug: "paan-banarasi-digital",
    name: "The Paan Banarasi Marketing",
    category: "Food Marketing",
    tagline: "Boosting Reach with Smart Advertising",
    description:
      "We managed paid campaigns and local SEO for The Paan Banarasi to improve visibility and customer acquisition.",
    logo: "paan-banarasi.png",
    accent: "#6B9E2A",
    bg: "from-[#0a1505] to-[#0d0d0d]",
    deliverables: [
      "Google Ads",
      "Meta Campaigns",
      "SEO",
      "Creative Ad Copies",
      "Local Reach Strategy",
    ],
    serviceType: "DIGITAL_MARKETING",
    featured: true,
    published: true,
    displayOrder: 8,
    tags: ["digital-marketing", "food", "seo"],
  },

  // =========================
  // BRAND PRODUCT SHOOTS
  // =========================

  {
    slug: "swarnaavya-product-shoot",
    name: "Swarnaavya Product Shoot",
    category: "Jewellery Photography",
    tagline: "Luxury Product Visuals That Sell",
    description:
      "We produced premium jewellery product shoots for Swarnaavya, focused on elegance, texture, and luxury storytelling.",
    logo: "swarnaavya.png",
    accent: "#C9A84C",
    bg: "from-[#1a1508] to-[#0d0d0d]",
    deliverables: [
      "Product Photography",
      "Creative Direction",
      "Lighting Setup",
      "Luxury Retouching",
      "Social Media Assets",
    ],
    serviceType: "BRAND_PRODUCT_SHOOTS",
    featured: true,
    published: true,
    displayOrder: 9,
    tags: ["product-shoot", "luxury", "jewellery"],
  },

  {
    slug: "tea-castle-product-campaign",
    name: "Tea Castle Product Campaign",
    category: "Food & Beverage",
    tagline: "Capturing Products with Character",
    description:
      "We created commercial product visuals for Tea Castle's beverages and café products for online promotions and campaigns.",
    logo: "tea-castle.png",
    accent: "#7A9E3B",
    bg: "from-[#0d1508] to-[#0d0d0d]",
    deliverables: [
      "Commercial Photography",
      "Food Styling",
      "Creative Direction",
      "Ad Creatives",
      "Campaign Assets",
    ],
    serviceType: "BRAND_PRODUCT_SHOOTS",
    featured: true,
    published: true,
    displayOrder: 10,
    tags: ["product-shoot", "food", "commercial"],
  },

  // =========================
  // WEDDING
  // =========================

  {
    slug: "mahajan-wedding-story",
    name: "Mahajan Wedding Story",
    category: "Wedding",
    tagline: "Capturing Moments That Last Forever",
    description:
      "We documented a premium wedding experience with cinematic storytelling, candid photography, and emotional visual narratives.",
    logo: "mahajan-greens.png",
    accent: "#C9A84C",
    bg: "from-[#0d1508] to-[#0d0d0d]",
    deliverables: [
      "Wedding Photography",
      "Wedding Films",
      "Cinematic Reels",
      "Drone Coverage",
      "Highlight Edits",
    ],
    serviceType: "WEDDING",
    featured: true,
    published: true,
    displayOrder: 11,
    tags: ["wedding", "cinematic", "events"],
  },

  // =========================
  // EVENT PHOTOGRAPHY
  // =========================

  {
    slug: "mahajan-events-coverage",
    name: "Mahajan Events Coverage",
    category: "Corporate Events",
    tagline: "Professional Event Documentation",
    description:
      "We captured premium event experiences through professional photography and cinematic aftermovies.",
    logo: "mahajan-greens.png",
    accent: "#C9A84C",
    bg: "from-[#0d1508] to-[#0d0d0d]",
    deliverables: [
      "Event Photography",
      "Aftermovies",
      "Drone Coverage",
      "Highlight Reels",
      "Social Clips",
    ],
    serviceType: "EVENT_PHOTOGRAPHY_VIDEOGRAPHY",
    featured: true,
    published: true,
    displayOrder: 12,
    tags: ["events", "videography", "corporate"],
  },

  // =========================
  // WEBSITE DEVELOPMENT
  // =========================

  {
    slug: "kashiyatra-website",
    name: "Kashiyatra Website Experience",
    category: "Travel Website",
    tagline: "Modern Websites Built for Conversion",
    description:
      "We designed and developed a responsive travel website for Kashiyatra Tours with booking-focused UX and immersive visuals.",
    logo: "kashi-yatra.png",
    accent: "#C98B2A",
    bg: "from-[#1a1005] to-[#0d0d0d]",
    deliverables: [
      "UI/UX Design",
      "Frontend Development",
      "Responsive Design",
      "SEO Optimization",
      "Website Management",
    ],
    serviceType: "WEBSITE_DEVELOPMENT_MANAGEMENT",
    featured: true,
    published: true,
    displayOrder: 13,
    tags: ["website", "travel", "development"],
  },

  {
    slug: "sarvaga-fashion-website",
    name: "Sarvaga Fashion Website",
    category: "Fashion E-Commerce",
    tagline: "Digital Storefronts That Feel Premium",
    description:
      "We developed a premium responsive fashion website experience tailored for modern customers and high engagement.",
    logo: "sarvaga-fashions.png",
    accent: "#9B59B6",
    bg: "from-[#150a1a] to-[#0d0d0d]",
    deliverables: [
      "E-Commerce Design",
      "Responsive Frontend",
      "CMS Integration",
      "Performance Optimization",
      "Website Maintenance",
    ],
    serviceType: "WEBSITE_DEVELOPMENT_MANAGEMENT",
    featured: true,
    published: true,
    displayOrder: 14,
    tags: ["website", "fashion", "ecommerce"],
  },
];

/* =========================================================
   API SEEDING
========================================================= */

async function seedPortfolio() {
  const cookie = await login();

  for (const card of portfolioCards) {
    try {
      console.log(`🚀 Uploading: ${card.name}`);

      const formData = new FormData();

      formData.append("slug", card.slug);
      formData.append("name", card.name);
      formData.append("category", card.category);
      formData.append("tagline", card.tagline);
      formData.append("description", card.description);
      formData.append("serviceType", card.serviceType);
      formData.append("accent", card.accent);
      formData.append("bg", card.bg);
      formData.append("featured", String(card.featured));
      formData.append("published", String(card.published));
      formData.append("displayOrder", String(card.displayOrder));

      formData.append("tags", JSON.stringify(card.tags));
      formData.append(
        "deliverables",
        JSON.stringify(card.deliverables)
      );

      const logoPath = path.join(
        process.cwd(),
        "seed-assets",
        "portfolio",
        card.logo
      );

      formData.append("logo", fs.createReadStream(logoPath));

      const response = await axios.post(
        `${API_BASE}/portfolio`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Cookie: cookie,
          },
          maxBodyLength: Infinity,
        }
      );

      console.log(
        `✅ Created: ${response.data.card.name}`
      );
    } catch (error) {
      console.error(
        `❌ Failed: ${card.name}`,
        error?.response?.data || error.message
      );
    }
  }

  console.log("🎉 Portfolio API seeding completed.");
}

seedPortfolio();
