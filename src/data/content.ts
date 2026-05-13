// ============================================================
// Point5 Media Productions — All site content data
// ============================================================

export const COMPANY = {
  name: "POINT5MEDIA",
  fullName: "Point 5 Media Productions",
  tagline: "Creative minds building impactful digital experience.",
  email: "point5media2022@gmail.com",
  phones: ["+91 73554 15186", "+91 83183 36283"],
  address: "Plot No. 575/A, Manas Nagar Extension Durgakund, Varanasi, Uttar Pradesh – 221005, India",
  hours: "Monday – Saturday: 8:00 AM – 10:00 PM",
  heroDescription:
    "a multidisciplinary creative consultancy and a results-driven digital marketing agency that assists brands in growing, connecting, and thriving in the digital world. We specialize in creating engaging campaigns and building strong social media brands that bring ideas to life.",
  aboutDescription:
    "At Point 5 Media Productions, we believe that every story deserves to be seen, felt, and remembered. We are a creative agency crafting high-impact visual content — from brand reels, ad films, and corporate shoots to event highlights and wedding films — designed to captivate, engage, and convert.\n\nOver the last 3 years, we've partnered with 50+ brands and individuals, transforming their ideas into visually stunning experiences. Our portfolio proudly includes projects with Uttar Pradesh Police, the Indian Army (39 GTC), YouTube documentaries, podcasts, and a diverse range of commercial and creative ventures.",
  socials: {
    whatsapp: "https://wa.me/917355415186",
    twitter: "https://x.com/sumedhapathak96",
    linkedin: "https://www.linkedin.com/company/point-5-media-productions/",
    instagram: "https://www.instagram.com/point.5media/",
    facebook: "https://www.facebook.com/profile.php?id=61556667503604",
  },
};

export const FOUNDERS = [
  {
    name: "Sumedha Pathak",
    role: "Founder & CEO",
    image: "/team/sumedha.webp",
    bio: "Sumedha is the visionary behind Point 5 Media, leading strategy, content direction, and brand partnerships with a passion for impactful storytelling.",
  },
  {
    name: "Akash Gupta",
    role: "Co-Founder",
    image: "/team/akash.webp",
    bio: "Akash drives creative production and technical execution, bringing brands to life through cinematic visuals and innovative digital experiences.",
  },
];

export const BRAND_LOGOS = [
  { name: "Swarnaavya", src: "/brands/swarnaavya.png" },
  { name: "Magadh Delight", src: "/brands/magadh-delight.png" },
  { name: "Gungun Green Properties", src: "/brands/gungun-green.png" },
  { name: "Kashi Yatra", src: "/brands/kashi-yatra.png" },
  { name: "The Paan Banarasi", src: "/brands/paan-banarasi.png" },
  { name: "The Tea Castle", src: "/brands/tea-castle.png" },
  { name: "Mahajan Greens", src: "/brands/mahajan-greens.png" },
  { name: "Sarvaga Fashions", src: "/brands/sarvaga-fashions.png" },
];

export const TESTIMONIALS = [
  {
    quote: "Our social media presence has improved significantly with Point 5 Media. Their content planning and execution are smooth and effective.",
    author: "Panchsheel Multi speciality Hospital",
    avatar: "https://point5media.com/wp-content/uploads/2023/11/nimo-home-9-testimonial-1.png",
    rating: 5,
  },
  {
    quote: "Great experience with Point 5 Media. They understand our brand well and consistently create engaging content.",
    author: "Swarnaavya",
    avatar: "https://point5media.com/wp-content/uploads/2023/11/nimo-home-9-testimonial-2.png",
    rating: 5,
  },
  {
    quote: "Point 5 Media manages our social media creatively and keeps our page active and engaging. Highly recommended.",
    author: "Taste Factory",
    avatar: "https://point5media.com/wp-content/uploads/2023/11/nimo-home-9-testimonial-3.png",
    rating: 5,
  },
  {
    quote: "Professional team that helped us generate quality leads through well-planned campaigns and consistent content.",
    author: "Gungun Green Properties",
    avatar: "https://point5media.com/wp-content/uploads/2023/11/nimo-home-9-testimonial-1.png",
    rating: 5,
  },
  {
    quote: "Point 5 Media handled our event promotions excellently, helping us reach a larger audience smoothly and professionally.",
    author: "Neeraj Sharma, Aura Beauty Expo Startup Founder",
    avatar: "https://point5media.com/wp-content/uploads/2023/11/nimo-home-9-testimonial-3.png",
    rating: 5,
  },
  {
    quote: "They helped grow our hotel's social media with professional visuals, engaging content, and consistent management.",
    author: "Hotel Broadway Benares",
    avatar: "https://point5media.com/wp-content/uploads/2023/11/nimo-home-9-testimonial-2.png",
    rating: 5,
  },
];

export interface Service {
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
}

export const SERVICES: Service[] = [
  {
    slug: "branding",
    title: "Branding",
    shortDesc: "We go beyond logos - building complete visual identities that tell your story and reflect your values. From color palettes to typography, tone of voice to brand guidelines, we shape every element to ensure your brand stands out across every touch.",
    fullDesc:
      "We go beyond logos - building complete visual identities that tell your story and reflect your values. From color palettes to typography, tone of voice to brand guidelines, we shape every element to ensure your brand stands out across every touch.",
    features: [
      "Color Palettes",
      "Typography",
      "Tone of Voice",
      "Brand Guidelines"
    ],
    icon: "Palette",
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    shortDesc: "We manage your social media with a strategic, creative approach tailored to your brand; turning content into powerful storytelling that boosts visibility, engagement, and lasting brand recall.",
    fullDesc:
      "We manage your social media with a strategic, creative approach tailored to your brand; turning content into powerful storytelling that boosts visibility, engagement, and lasting brand recall.",
    features: [
      "Instagram",
      "Facebook",
      "LinkedIn",
      "YouTube",
      "Google My Business"
    ],
    icon: "Share2",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortDesc: "Our digital marketing services blend SEO, Google Ads, and Meta Ads to boost visibility, reach the right audience, and drive measurable, sustainable growth for your brand.",
    fullDesc:
      "Our digital marketing services blend SEO, Google Ads, and Meta Ads to boost visibility, reach the right audience, and drive measurable, sustainable growth for your brand.",
    features: [
      "SEO",
      "Google Ads",
      "Meta Ads"
    ],
    icon: "TrendingUp",
  },
  {
    slug: "brand-product-shoots",
    title: "Brand and Product Shoots",
    shortDesc: "Our brand and product shoots create high-quality, concept-driven visuals that highlight your brand identity and product details — perfect for websites, social media, and marketing campaigns, while boosting brand value and engagement.",
    fullDesc:
      "Our brand and product shoots create high-quality, concept-driven visuals that highlight your brand identity and product details — perfect for websites, social media, and marketing campaigns, while boosting brand value and engagement.",
    features: [],
    icon: "Camera",
  },
  {
    slug: "wedding-photography-videography",
    title: "Wedding Photography / Videography",
    shortDesc: "Our wedding photography and videography capture timeless emotions through candid moments, genuine expressions, and beautifully composed visuals — preserving every detail of your special day with care and creativity.",
    fullDesc:
      "Our wedding photography and videography capture timeless emotions through candid moments, genuine expressions, and beautifully composed visuals — preserving every detail of your special day with care and creativity.",
    features: [],
    icon: "Heart",
  },
  {
    slug: "event-photography-videography",
    title: "Event Photography / Videography",
    shortDesc: "Our event photography and videography capture key moments and energy with professional, creative coverage — delivering compelling visuals that reflect the true essence of your event.",
    fullDesc:
      "Our event photography and videography capture key moments and energy with professional, creative coverage — delivering compelling visuals that reflect the true essence of your event.",
    features: [],
    icon: "Video",
  },
  {
    slug: "website-development-management",
    title: "Website Development and Management",
    shortDesc: "Our website development and management services deliver responsive, user-friendly websites that look great, work seamlessly, and support your brand's growth.",
    fullDesc:
      "Our website development and management services deliver responsive, user-friendly websites that look great, work seamlessly, and support your brand's growth.",
    features: [],
    icon: "Monitor",
  },
];

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Brand Discovery & Strategy",
    duration: "3-5 days",
    desc: "We begin by understanding your brand identity, target audience, goals, and platforms. Through in-depth discussions, we define the tone, messaging, and outcomes your social media presence should achieve.",
  },
  {
    num: "02",
    title: "Content Ideation & Planning",
    duration: "1 week",
    desc: "Our team develops platform-specific content ideas aligned with trends, algorithms, and audience behavior. We create a structured content plan including reels, posts, stories, and campaigns that drive engagement and growth.",
  },
  {
    num: "03",
    title: "Creative Development",
    duration: "4-7 days",
    desc: "We craft captions, hooks, visual directions, and content formats that match your brand language. From storytelling reels to promotional creatives, every piece is designed to stop the scroll.",
  },
  {
    num: "04",
    title: "Content Production",
    duration: "1 week",
    desc: "Using high-quality visuals, on-site shoots, or creative assets, we produce engaging content tailored for Instagram, YouTube, LinkedIn, and other platforms — ensuring consistency and impact.",
  },
  {
    num: "05",
    title: "Editing & Optimization",
    duration: "1 week",
    desc: "Content is edited with platform-specific pacing, subtitles, effects, and music. We optimize formats, timings, and visuals to boost reach, retention, and interaction.",
  },
  {
    num: "06",
    title: "Publishing, Monitoring & Growth Support",
    duration: "3-5 days",
    desc: "We assist with scheduling, posting strategies, hashtag research, and performance tracking. Insights are analyzed to refine content and ensure continuous improvement and audience growth.",
  },
];

export const MISSION_CARDS = [
  {
    title: "Our Mission",
    desc: "To help brands stand out online, tell their story, and drive measurable success through digital creativity and smart strategy.",
    icon: "Target",
  },
  {
    title: "Our Vision",
    desc: "To inspire innovation through design, technology, and storytelling — making every digital interaction meaningful.",
    icon: "Eye",
  },
  {
    title: "Collaborate with Us",
    desc: "Let's build something extraordinary — from stunning visuals to interactive modern creative innovative experiences.",
    icon: "Handshake",
  },
];

export const WHY_CHOOSE_US = [
  { title: "Seamless Collaboration", desc: "Transparent communication and feedback loops at every stage of the project.", icon: "Users" },
  { title: "Creative Ideas", desc: "Fresh, innovative approaches tailored to make your brand unforgettable.", icon: "Lightbulb" },
  { title: "2+ Years Experience", desc: "Over 2 years of experience delivering innovative digital solutions.", stat: "99+ Happy clients", icon: "Award" },
  { title: "7 Day Turnaround", desc: "Fast delivery without compromising on quality or creativity.", icon: "Clock" },
];

export const FUN_FACTS = [
  { value: 95, suffix: "%", label: "Customer satisfaction" },
  { value: 2, suffix: "+", label: "Years of experience" },
  { value: 22, suffix: "+", label: "Projects completed" },
];

export const FAQS = [
  {
    question: "What services does Point 5 Media offer?",
    answer: "Branding • Social Media Management • Digital Marketing • Product and Model Shoots • Wedding Photography • Event Photography / Videography",
  },
  {
    question: "What is digital marketing?",
    answer:
      "Digital marketing refers to promoting products or services to consumers who use internet-enabled devices like computers, smartphones, and tablets. It focuses on engaging potential and existing customers through platforms such as search engines, social media, email, websites, and mobile apps. At Point 5 Media, our dedicated team of digital marketing experts helps your brand connect with audiences across the globe.",
  },
  {
    question: "How do you create engaging content?",
    answer:
      "The real answer to this question lies in delivering meaningful value. At Point 5 Media, we uncover what truly matters to your audience and turn it into a compelling promise that builds an emotional bond. Through fresh, innovative storytelling, we create content that inspires, engages, and leaves a lasting impression.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "We've seen clear evidence that our clients' organic reach begins to grow soon after partnering with us. While paid digital campaigns can deliver instant results, strategies like content marketing and SEO require consistency and patience. These long-term efforts typically take a few months to show measurable impact — but the results are sustainable and rewarding.",
  },
];

export const HERO_BG = "https://point5media.com/wp-content/uploads/2024/04/Point5-Media-Productions-Main-Banner.jpg";
