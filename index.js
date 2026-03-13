import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";
import { ServicesConfig } from "./models/ServicesConfig.js";
import express from "express";
import { BlogPost } from "./models/BlogPost.js";
import { BlogSettings } from "./models/BlogSettings.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Hero } from "./models/Hero.js";
import { PortfolioConfig } from "./models/PortfolioConfig.js";
import { Testimonial } from "./models/Testimonial.js";
import { TeamConfig } from "./models/TeamConfig.js";
import { LogosConfig } from "./models/LogosConfig.js";
import { ContactConfig } from "./models/ContactConfig.js";
import { FooterConfig } from "./models/FooterConfig.js";
import { Page } from "./models/Page.js";
import { NavigationConfig } from "./models/NavigationConfig.js";
import { SiteConfig } from "./models/SiteConfig.js";
import { HowWeWorkConfig } from "./models/HowWeWorkConfig.js";
import { FaqConfig } from "./models/FaqConfig.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const app = express();

// Allow your Vite frontend to call this backend
const allowedOrigins = [
  "http://localhost:8080",
  "https://digitalsocialdreams.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin), false);
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Helpers ────────────────────────────────────────────────────────────────────

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");

// ── Auth middleware ────────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ── Public Routes ──────────────────────────────────────────────────────────────

// Simple test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /api/hero - public
app.get("/api/hero", async (req, res) => {
  try {
    let hero = await Hero.findOne();

    if (!hero) {
      hero = await Hero.create({
        heading:
          "The Ultimate Development Agency\nWe drive [rotating] for your business",
        description:
          "Transform your digital presence with data-driven strategies.\n" +
          "We create experiences that convert visitors into customers.",
        buttons: [
          { label: "Get Started", href: "#contact" },
          { label: "View Work", href: "#portfolio" },
        ],
        products: [
          {
            title: "Project One",
            link: "",
            thumbnail:
              "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
          },
          {
            title: "Project Two",
            link: "",
            thumbnail:
              "https://aceternity.com/images/products/thumbnails/new/cursor.png",
          },
          {
            title: "Project Three",
            link: "",
            thumbnail:
              "https://aceternity.com/images/products/thumbnails/new/rogue.png",
          },
        ],
        trustText: "Trusted by leading brands",
        trustLogos: [
          { name: "Google", url: "https://cdn.simpleicons.org/google/white" },
          {
            name: "Microsoft",
            url: "https://cdn.simpleicons.org/microsoft/white",
          },
          {
            name: "Spotify",
            url: "https://cdn.simpleicons.org/spotify/white",
          },
          { name: "Slack", url: "https://cdn.simpleicons.org/slack/white" },
        ],
        widgets: {
          showAvailabilityWidget: true,
          availabilityText: "Available for new projects",
          showStatsWidget: true,
          stats: [
            { value: "500+", label: "Projects" },
            { value: "98%", label: "Satisfaction" },
            { value: "10+", label: "Years" },
          ],
          animateStats: true,
          showVideoWidget: true,
          videoThumbnail: "",
          videoUrl: "",
          autoPlayVideo: false,
          showTestimonialWidget: true,
          testimonials: [
            {
              name: "Sarah Johnson",
              role: "CEO",
              company: "TechStart",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              text: "They transformed our business completely. Best decision we ever made.",
              rating: 5,
            },
            {
              name: "Michael Chen",
              role: "Founder",
              company: "GrowthLabs",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              text: "Professional, creative, and delivered beyond expectations.",
              rating: 5,
            },
          ],
          testimonialTypingEffect: true,
          testimonialAutoRotate: true,
          testimonialRotateInterval: 6000,
          showRotatingWords: true,
          rotatingWords: [
            { text: "Growth", color: "#FACC15" },
            { text: "Success", color: "#22C55E" },
            { text: "Results", color: "#3B82F6" },
            { text: "Impact", color: "#A855F7" },
          ],
          rotatingWordsInterval: 3000,
          animateTrustLogos: true,
          trustLogosSpeed: 20,
          showBackgroundEffects: true,
          showScrollIndicator: true,
          typography: {
            headingFont: "Inter",
            headingWeight: "700",
            headingSize: "default",
            headingColor: "#FFFFFF",
            descriptionFont: "Inter",
            descriptionColor: "rgba(255,255,255,0.6)",
            highlightBgColor: "#FACC15",
            highlightTextColor: "#111827",
            highlightPadding: "0 8px",
            highlightRadius: "6px",
            highlightRotation: -1,
            boldColor: "#FFFFFF",
            italicColor: "#FACC15",
          },
        },
      });
    }

    res.json(hero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching hero data" });
  }
});

// Update hero content
app.put("/api/hero", async (req, res) => {
  try {
    const {
      heading,
      description,
      buttons,
      products,
      trustText,
      trustLogos,
      widgets,
    } = req.body;

    let hero = await Hero.findOne();

    if (hero) {
      hero.heading = heading ?? hero.heading;
      hero.description = description ?? hero.description;
      hero.buttons = buttons ?? hero.buttons;
      hero.products = products ?? hero.products;
      hero.trustText = trustText ?? hero.trustText;
      hero.trustLogos = trustLogos ?? hero.trustLogos;
      hero.widgets = widgets ?? hero.widgets;
      await hero.save();
    } else {
      hero = await Hero.create({
        heading,
        description,
        buttons,
        products,
        trustText,
        trustLogos,
        widgets,
      });
    }

    res.json(hero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching hero data" });
  }
});

// GET /api/services - public, for frontend
app.get("/api/services", async (req, res) => {
  try {
    let config = await ServicesConfig.findOne();

    if (!config) {
      config = await ServicesConfig.create({
        badge: "Our Services",
        heading: "Complete Digital Marketing Solutions",
        description:
          "We drive growth and revenue through data-driven strategies across all digital channels.",
        primaryButtonLabel: "Get Started Now",
        primaryButtonHref: "#contact",
        secondaryButtonLabel: "View Case Study",
        secondaryButtonHref: "#portfolio",

        ctaTitle: "Ready to Transform Your Digital Presence?",
        ctaDescription:
          "Let's discuss how our digital marketing services can drive growth for your business.",
        ctaPrimaryButtonLabel: "Start Your Project Today",
        ctaPrimaryButtonHref: "#contact",
        ctaSecondaryButtonLabel: "Free Strategy Session",
        ctaSecondaryButtonHref: "#contact",
        services: [
          {
            key: "seo",
            label: "SEO",
            badge: "Search Engine Optimization",
            title: "Dominate Search Rankings",
            description:
              "Increase your organic visibility and drive qualified traffic with our comprehensive SEO strategies.",
            features: [
              "Technical SEO audit & optimization",
              "Keyword research & content strategy",
              "Local SEO & Google My Business",
              "Ongoing performance monitoring",
            ],
            results: [
              { value: "200%+", label: "Traffic Growth" },
              { value: "24/7", label: "Monitoring" },
              { value: "Page 1", label: "Google Rankings" },
              { value: "90 Days", label: "Visible Results" },
            ],
            image: "",
            order: 0,
          },
        ],
      });
    }

    config.services.sort((a, b) => a.order - b.order);

    res.json(config);
  } catch (err) {
    console.error("GET /api/services error:", err);
    res.status(500).json({ message: "Error fetching services config" });
  }
});

// ---------- BLOG SETTINGS PUBLIC ROUTE ----------

app.get("/api/blog/settings", async (req, res) => {
  try {
    let settings = await BlogSettings.findOne();

    if (!settings) {
      settings = await BlogSettings.create({
        pageTitle: "Blog | Digital Social Dreams",
        pageDescription:
          "Read the latest insights on digital marketing, SEO, development, and growth strategies.",
        badge: "Articles & Resources",
        heading: "Our Latest Insights",
        highlightedWord: "Insights",
        description:
          "Explore our latest articles on digital marketing, SEO, development and growth strategies designed to scale your business.",
        accentColor: "#FACC15",
        accentColorDark: "#D97706",
        badgeBgColor: "#FEF9C3",
        badgeBorderColor: "#FDE68A",
        badgeTextColor: "#CA8A04",
        emptyStateTitle: "No articles found",
        emptyStateDescription:
          "We are currently brewing up some amazing content. Check back soon for our latest updates and insights.",
        cardBorderRadius: "2rem",
        cardHoverScale: 1.02,
        showReadTime: true,
        showCategory: true,
        showAuthor: true,
        postsPerRow: 3,
        gap: "2.5rem",
      });
    }

    res.json(settings);
  } catch (err) {
    console.error("GET /api/blog/settings error:", err);
    res.status(500).json({ message: "Error fetching blog settings" });
  }
});

// ---------- BLOG SETTINGS ADMIN ROUTE ----------

app.put("/api/blog/settings", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const settings = await BlogSettings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    res.json(settings);
  } catch (err) {
    console.error("PUT /api/blog/settings error:", err);
    res.status(500).json({ message: "Error updating blog settings" });
  }
});

// 2) Get all published blog posts (for homepage + /blog list)
app.get("/api/blog", async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: "published" }).sort({
      createdAt: -1,
    });

    const response = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      author: post.author,
      date: post.date,
      readTime: post.readTime,
      image: post.image,
      slug: post.slug,
    }));

    res.json(response);
  } catch (err) {
    console.error("GET /api/blog error:", err);
    res.status(500).json({ message: "Error fetching blog posts" });
  }
});

// 3) Get single published blog post by slug
app.get("/api/blog/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await BlogPost.findOne({ slug, status: "published" });

    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("GET /api/blog/:slug error:", err);
    res.status(500).json({ message: "Error fetching blog post" });
  }
});

// ---------- PAGES PUBLIC ROUTES ----------

// GET /api/pages - public, minimal list of published pages
app.get("/api/pages", async (req, res) => {
  try {
    const pages = await Page.find({ status: "published" })
      .sort({ order: 1, createdAt: -1 })
      .select("title slug showInFooter footerLabel order");

    res.json(pages);
  } catch (err) {
    console.error("GET /api/pages error:", err);
    res.status(500).json({ message: "Error fetching pages" });
  }
});

// GET /api/pages/:slug - public single page by slug
app.get("/api/pages/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug, status: "published" });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (err) {
    console.error("GET /api/pages/:slug error:", err);
    res.status(500).json({ message: "Error fetching page" });
  }
});

// ── Auth Routes ────────────────────────────────────────────────────────────────

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// TEMPORARY: reset password for an existing admin
app.post("/api/auth/reset-password-dev", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "email and newPassword are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("reset-password-dev error:", err);
    res.status(500).json({ message: "Error updating password" });
  }
});

// ── Protected (Admin) Routes ───────────────────────────────────────────────────

// Update hero content (protected by auth)
app.put("/api/hero", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const hero = await Hero.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    res.json(hero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating hero data" });
  }
});

// PUT /api/services - protected (admin only)
app.put("/api/services", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const config = await ServicesConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    config.services.sort((a, b) => a.order - b.order);
    res.json(config);
  } catch (err) {
    console.error("PUT /api/services error:", err);
    res.status(500).json({ message: "Error updating services config" });
  }
});

// ---------- BLOG ADMIN ROUTES (protected) ----------

// List all posts (draft + published)
app.get("/api/admin/blog", authMiddleware, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });

    const response = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      category: post.category,
      author: post.author,
      status: post.status,
      createdAt: post.createdAt,
    }));

    res.json(response);
  } catch (err) {
    console.error("GET /api/admin/blog error:", err);
    res.status(500).json({ message: "Error fetching admin blog posts" });
  }
});

// Get a single post by ID (for editing)
app.get("/api/admin/blog/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error("GET /api/admin/blog/:id error:", err);
    res.status(500).json({ message: "Error fetching blog post" });
  }
});

// Create new post
app.post("/api/blog", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.excerpt || !data.content) {
      return res
        .status(400)
        .json({ message: "title, excerpt and content are required" });
    }

    let slug =
      data.slug && data.slug.trim()
        ? data.slug.trim().toLowerCase()
        : slugify(data.title);

    // Make slug unique
    let existing = await BlogPost.findOne({ slug });
    let suffix = 2;
    const baseSlug = slug;
    while (existing) {
      slug = `${baseSlug}-${suffix++}`;
      existing = await BlogPost.findOne({ slug });
    }

    const tags =
      Array.isArray(data.tags) && data.tags.length
        ? data.tags
        : typeof data.tagsString === "string"
        ? data.tagsString
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    const post = await BlogPost.create({
      ...data,
      slug,
      tags,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("POST /api/blog error:", err);
    res.status(500).json({ message: "Error creating blog post" });
  }
});

// Update post
app.put("/api/blog/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.slug) {
      data.slug = data.slug.trim().toLowerCase();
    } else if (data.title) {
      data.slug = slugify(data.title);
    }

    // Ensure slug unique except current
    if (data.slug) {
      const existing = await BlogPost.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Slug already in use, choose another" });
      }
    }

    const tags =
      Array.isArray(data.tags) && data.tags.length
        ? data.tags
        : typeof data.tagsString === "string"
        ? data.tagsString
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined;

    const updated = await BlogPost.findByIdAndUpdate(
      id,
      { ...data, ...(tags ? { tags } : {}) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/blog/:id error:", err);
    res.status(500).json({ message: "Error updating blog post" });
  }
});

// Delete post
app.delete("/api/blog/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json({ message: "Blog post deleted" });
  } catch (err) {
    console.error("DELETE /api/blog/:id error:", err);
    res.status(500).json({ message: "Error deleting blog post" });
  }
});

// ---------- PAGES ADMIN ROUTES (protected) ----------

// GET /api/admin/pages - list all pages (draft + published)
app.get("/api/admin/pages", authMiddleware, async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(
      pages.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        status: p.status,
        contentType: p.contentType || "html",
        hasNavigation: p.hasNavigation !== false,
        hasFooter: p.hasFooter !== false,
        backgroundColor: p.backgroundColor || "#FFFFFF",
        showInFooter: p.showInFooter,
        footerLabel: p.footerLabel,
        updatedAt: p.updatedAt,
      }))
    );
  } catch (err) {
    console.error("GET /api/admin/pages error:", err);
    res.status(500).json({ message: "Error fetching pages" });
  }
});

// GET /api/admin/pages/:id - get single page by id
app.get("/api/admin/pages/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (err) {
    console.error("GET /api/admin/pages/:id error:", err);
    res.status(500).json({ message: "Error fetching page" });
  }
});

// POST /api/pages - create page
app.post("/api/pages", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Slug logic
    let slug =
      data.slug && data.slug.trim()
        ? data.slug.trim().toLowerCase()
        : slugify(data.title);

    // Ensure slug unique
    let existing = await Page.findOne({ slug });
    let suffix = 2;
    const baseSlug = slug;
    while (existing) {
      slug = `${baseSlug}-${suffix++}`;
      existing = await Page.findOne({ slug });
    }

    const page = await Page.create({
      title: data.title,
      slug,
      contentType: data.contentType || "html",
      content: data.content,
      hasNavigation: data.hasNavigation !== false,
      hasFooter: data.hasFooter !== false,
      backgroundColor: data.backgroundColor || "#FFFFFF",
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      seoImage: data.seoImage || "",
      status: data.status || "published",
      showInFooter: !!data.showInFooter,
      footerLabel: data.footerLabel || data.title,
      order: typeof data.order === "number" ? data.order : 0,
    });

    res.status(201).json(page);
  } catch (err) {
    console.error("POST /api/pages error:", err);
    res.status(500).json({ message: "Error creating page" });
  }
});

// PUT /api/pages/:id - update page
app.put("/api/pages/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.slug) {
      data.slug = data.slug.trim().toLowerCase();
      // ensure unique except self
      const existing = await Page.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Slug already in use, choose another" });
      }
    } else if (data.title) {
      data.slug = slugify(data.title);
      const existing = await Page.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        data.slug = `${data.slug}-${Date.now().toString(36)}`;
      }
    }

    const updateData = {
      ...data,
      showInFooter: !!data.showInFooter,
    };

    // Explicitly handle boolean fields that could be false
    if (typeof data.hasNavigation === "boolean") {
      updateData.hasNavigation = data.hasNavigation;
    }
    if (typeof data.hasFooter === "boolean") {
      updateData.hasFooter = data.hasFooter;
    }
    if (data.contentType) {
      updateData.contentType = data.contentType;
    }
    if (typeof data.backgroundColor === "string") {
      updateData.backgroundColor = data.backgroundColor;
    }
    if (typeof data.seoImage === "string") {
      updateData.seoImage = data.seoImage;
    }

    const updated = await Page.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/pages/:id error:", err);
    res.status(500).json({ message: "Error updating page" });
  }
});

// DELETE /api/pages/:id
app.delete("/api/pages/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Page.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json({ message: "Page deleted" });
  } catch (err) {
    console.error("DELETE /api/pages/:id error:", err);
    res.status(500).json({ message: "Error deleting page" });
  }
});

// ---------- PORTFOLIO / SUCCESS STORIES ----------

// Public GET: portfolio config
app.get("/api/portfolio", async (req, res) => {
  try {
    let config = await PortfolioConfig.findOne();

    if (!config) {
      config = await PortfolioConfig.create({
        headingMain: "Success",
        headingAccent: "Stories",
        description:
          "Real results for real businesses. See how we've helped companies like yours achieve breakthrough growth and dominate their markets.",
        ctaTitle: "Ready to Be Our Next Success Story?",
        ctaDescription:
          "Join hundreds of businesses that have transformed their digital presence and achieved remarkable growth with our proven strategies.",
        ctaButtonText: "Start Your Success Story",
        projects: [
          {
            title: "E-commerce Growth Strategy",
            category: "SEO & PPC",
            results: "450% ROI Increase",
            description:
              "Transformed an online retailer's digital presence through comprehensive SEO optimization and targeted PPC campaigns, resulting in 300% increase in organic traffic.",
            metrics: ["300% Organic Traffic", "450% ROI", "85% Lead Quality"],
            tags: ["SEO", "Google Ads", "Conversion Optimization"],
          },
          {
            title: "SaaS Lead Generation",
            category: "Content Marketing",
            results: "5x Lead Generation",
            description:
              "Developed and executed a content marketing strategy for B2B SaaS company, generating qualified leads through thought leadership and SEO-optimized content.",
            metrics: [
              "500% Lead Increase",
              "40% Conversion Rate",
              "200k+ Impressions",
            ],
            tags: ["Content Strategy", "Lead Generation", "B2B Marketing"],
          },
          {
            title: "Local Business Domination",
            category: "Local SEO",
            results: "#1 Local Rankings",
            description:
              "Achieved #1 local search rankings for multiple keywords, increased foot traffic by 200%, and established dominant local online presence.",
            metrics: ["#1 Local Rankings", "200% Foot Traffic", "50+ Reviews"],
            tags: [
              "Local SEO",
              "Google My Business",
              "Reputation Management",
            ],
          },
          {
            title: "Social Media Revolution",
            category: "Social Media",
            results: "1M+ Engagement",
            description:
              "Built engaged community of 100k+ followers, generated viral content campaigns, and drove significant brand awareness and sales through social platforms.",
            metrics: [
              "100k+ Followers",
              "1M+ Engagement",
              "25% Sales Increase",
            ],
            tags: ["Social Media", "Community Building", "Viral Marketing"],
          },
          {
            title: "Brand Awareness Campaign",
            category: "Brand Strategy",
            results: "3x Brand Recognition",
            description:
              "Developed comprehensive brand strategy that increased market recognition and established strong brand identity across digital channels.",
            metrics: ["300% Recognition", "50% Recall", "10M+ Reach"],
            tags: ["Brand Strategy", "Awareness", "Market Positioning"],
          },
          {
            title: "Conversion Rate Optimization",
            category: "CRO",
            results: "220% Conversion Boost",
            description:
              "Implemented data-driven CRO strategies that significantly improved website conversion rates and customer acquisition efficiency.",
            metrics: ["220% Conversions", "35% Lower CPA", "60% Faster Load"],
            tags: ["CRO", "UX Optimization", "A/B Testing"],
          },
          {
            title: "Email Marketing Automation",
            category: "Email Marketing",
            results: "8x ROI Achieved",
            description:
              "Created automated email marketing funnels that nurtured leads and drove consistent revenue through personalized customer journeys.",
            metrics: ["800% ROI", "45% Open Rate", "15% Click Rate"],
            tags: ["Email Automation", "Lead Nurturing", "Personalization"],
          },
          {
            title: "Influencer Partnership Program",
            category: "Influencer Marketing",
            results: "15x Social ROI",
            description:
              "Built and managed influencer partnership program that generated massive social proof and drove qualified traffic to client websites.",
            metrics: ["1500% Social ROI", "500+ Influencers", "2M+ Reach"],
            tags: ["Influencer Marketing", "Partnerships", "Social Proof"],
          },
        ],
      });
    }

    res.json(config);
  } catch (err) {
    console.error("GET /api/portfolio error:", err);
    res.status(500).json({ message: "Error fetching portfolio config" });
  }
});

// Admin PUT: update portfolio config
app.put("/api/portfolio", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const config = await PortfolioConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    res.json(config);
  } catch (err) {
    console.error("PUT /api/portfolio error:", err);
    res.status(500).json({ message: "Error updating portfolio config" });
  }
});

// ---------- TESTIMONIALS PUBLIC ROUTES ----------

// Get approved testimonials (for homepage)
app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.json(testimonials);
  } catch (err) {
    console.error("GET /api/testimonials error:", err);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
});

// Public submit testimonial (name + comment required, image optional)
app.post("/api/testimonials", async (req, res) => {
  try {
    const { name, comment, image, rating } = req.body;

    if (!name || !comment) {
      return res
        .status(400)
        .json({ message: "Name and comment are required" });
    }

    const testimonial = await Testimonial.create({
      name,
      comment,
      image: image || "",
      rating: rating || undefined,
      source: "website",
      status: "pending",
    });

    res.status(201).json({
      message: "Thank you for your review! It will appear once approved.",
      testimonial,
    });
  } catch (err) {
    console.error("POST /api/testimonials error:", err);
    res.status(500).json({ message: "Error submitting testimonial" });
  }
});

// ---------- TESTIMONIALS ADMIN ROUTES ----------

// List all testimonials (any status)
app.get("/api/admin/testimonials", authMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error("GET /api/admin/testimonials error:", err);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
});

// Update testimonial (including status)
app.put("/api/admin/testimonials/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await Testimonial.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/testimonials/:id error:", err);
    res.status(500).json({ message: "Error updating testimonial" });
  }
});

// Delete testimonial
app.delete("/api/admin/testimonials/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/testimonials/:id error:", err);
    res.status(500).json({ message: "Error deleting testimonial" });
  }
});

// ---------- HOW WE WORK PUBLIC ROUTES ----------

app.get("/api/how-we-work", async (req, res) => {
  try {
    let config = await HowWeWorkConfig.findOne();

    if (!config) {
      config = await HowWeWorkConfig.create({
        enabled: true,
        badge: "The Process",
        heading: "Our Strategy for",
        rotatingWords: ["Success", "Growth", "Impact", "Results"],
        description:
          "We translate complex challenges into",
        highlightedText: "elegant solutions",
        descriptionSuffix: "through a proven four-step methodology.",
        cornerImages: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop",
            order: 0,
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop",
            order: 1,
          },
        ],
        steps: [
          {
            stepId: "01",
            title: "Discovery",
            subtitle: "Uncovering Truths",
            description:
              "We dive deep into your brand's DNA. Through market audits and competitor analysis, we build a strategy based on hard data, not guesswork.",
            tags: ["Market Audit", "User Research", "Data Analysis"],
            image:
              "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
            order: 0,
          },
          {
            stepId: "02",
            title: "Strategy",
            subtitle: "The Master Plan",
            description:
              "Every pixel has a purpose. We blueprint the user journey, define technical requirements, and create a roadmap that guarantees a scalable future.",
            tags: ["Wireframing", "Architecture", "Roadmap"],
            image:
              "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop",
            order: 1,
          },
          {
            stepId: "03",
            title: "Creation",
            subtitle: "Design & Build",
            description:
              "Where magic happens. Our designers craft world-class visuals while developers write clean, high-performance code to bring the vision to life.",
            tags: ["UI/UX Design", "Development", "Animation"],
            image:
              "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop",
            order: 2,
          },
          {
            stepId: "04",
            title: "Launch",
            subtitle: "Scale & Dominate",
            description:
              "Launch is just Day 1. We monitor real-time performance, optimize for conversions, and help you scale your digital presence to new heights.",
            tags: ["QA Testing", "Deployment", "Growth"],
            image:
              "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop",
            order: 3,
          },
        ],
      });
    }

    res.json(config);
  } catch (err) {
    console.error("GET /api/how-we-work error:", err);
    res.status(500).json({ message: "Error fetching how we work config" });
  }
});

// ---------- HOW WE WORK ADMIN ROUTES ----------

app.put("/api/how-we-work", authMiddleware, async (req, res) => {
  try {
    const {
      enabled,
      badge,
      heading,
      rotatingWords,
      description,
      highlightedText,
      descriptionSuffix,
      cornerImages,
      steps,
    } = req.body;

    const config = await HowWeWorkConfig.findOneAndUpdate(
      {},
      {
        enabled,
        badge,
        heading,
        rotatingWords,
        description,
        highlightedText,
        descriptionSuffix,
        cornerImages,
        steps,
      },
      { new: true, upsert: true }
    );

    res.json(config);
  } catch (err) {
    console.error("PUT /api/how-we-work error:", err);
    res.status(500).json({ message: "Error updating how we work config" });
  }
});


// ---------- FAQ PUBLIC ROUTES ----------
app.get("/api/faqs", async (req, res) => {
  try {
    let config = await FaqConfig.findOne();

    if (!config) {
      config = await FaqConfig.create({
        enabled: true,
        badge: "Got Questions?",
        heading: "Frequently Asked Questions",
        highlightedWord: "Questions",
        description:
          "Everything you need to know about our services, process, and how we drive growth.",
        faqs: [
          {
            question: "What services does DigitalSocialDreams offer?",
            answer:
              "We offer a comprehensive suite of digital marketing services, including Search Engine Optimization (SEO), Pay-Per-Click (PPC) Advertising, Social Media Management, Custom Web Development (including Shopify & WordPress), and strategic brand consulting.",
            order: 0,
          },
          {
            question: "How long does it take to see results?",
            answer:
              "Timelines vary depending on the service. Paid advertising (PPC) can generate traffic immediately, while organic strategies like SEO typically take 3 to 6 months to show significant, sustainable growth. We focus on long-term ROI rather than quick, fleeting wins.",
            order: 1,
          },
        ],
        ctaTitle: "Ready to transform your brand?",
        ctaDescription:
          "Let's discuss how our tailored digital marketing services and custom development can drive exponential growth for your business.",
        ctaButtonLabel: "Start Your Project",
        ctaButtonHref: "/contact",
      });
    }

    const faqs = [...config.faqs].sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      enabled: config.enabled,
      badge: config.badge,
      heading: config.heading,
      highlightedWord: config.highlightedWord,
      description: config.description,
      faqs,
      ctaTitle: config.ctaTitle,
      ctaDescription: config.ctaDescription,
      ctaButtonLabel: config.ctaButtonLabel,
      ctaButtonHref: config.ctaButtonHref,
    });
  } catch (err) {
    console.error("GET /api/faqs error:", err);
    res.status(500).json({ message: "Error fetching FAQ config" });
  }
});

// ---------- FAQ ADMIN ROUTES ----------
app.put("/api/faqs", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const config = await FaqConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    const faqs = [...config.faqs].sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      enabled: config.enabled,
      badge: config.badge,
      heading: config.heading,
      highlightedWord: config.highlightedWord,
      description: config.description,
      faqs,
      ctaTitle: config.ctaTitle,
      ctaDescription: config.ctaDescription,
      ctaButtonLabel: config.ctaButtonLabel,
      ctaButtonHref: config.ctaButtonHref,
    });
  } catch (err) {
    console.error("PUT /api/faqs error:", err);
    res.status(500).json({ message: "Error updating FAQ config" });
  }
});

// ---------- TEAM PUBLIC ROUTES ----------

app.get("/api/team", async (req, res) => {
  try {
    let config = await TeamConfig.findOne();

    if (!config) {
      config = await TeamConfig.create({ members: [] });
    }

    const members = [...config.members].sort((a, b) => a.order - b.order);

    res.json({ members });
  } catch (err) {
    console.error("GET /api/team error:", err);
    res.status(500).json({ message: "Error fetching team" });
  }
});

// ---------- TEAM ADMIN ROUTES ----------

app.put("/api/team", authMiddleware, async (req, res) => {
  try {
    const { members } = req.body;

    if (!Array.isArray(members)) {
      return res.status(400).json({ message: "members must be an array" });
    }

    const config = await TeamConfig.findOneAndUpdate(
      {},
      { members },
      { new: true, upsert: true }
    );

    const sorted = [...config.members].sort((a, b) => a.order - b.order);

    res.json({ members: sorted });
  } catch (err) {
    console.error("PUT /api/team error:", err);
    res.status(500).json({ message: "Error updating team" });
  }
});

// ---------- LOGOS PUBLIC ROUTES ----------

app.get("/api/logos", async (req, res) => {
  try {
    let config = await LogosConfig.findOne();

    if (!config) {
      config = await LogosConfig.create({
        logos: [],
        logoSize: 64,
        scrollSpeed: 15,
      });
    }

    const logos = [...config.logos].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    res.json({
      logos,
      logoSize: config.logoSize,
      scrollSpeed: config.scrollSpeed,
    });
  } catch (err) {
    console.error("GET /api/logos error:", err);
    res.status(500).json({ message: "Error fetching logos" });
  }
});

// ---------- LOGOS ADMIN ROUTES ----------

app.put("/api/logos", authMiddleware, async (req, res) => {
  try {
    const { logos, logoSize, scrollSpeed } = req.body;

    if (!Array.isArray(logos)) {
      return res.status(400).json({ message: "logos must be an array" });
    }

    const config = await LogosConfig.findOneAndUpdate(
      {},
      {
        logos,
        ...(typeof logoSize === "number" ? { logoSize } : {}),
        ...(typeof scrollSpeed === "number" ? { scrollSpeed } : {}),
      },
      { new: true, upsert: true }
    );

    const sorted = [...config.logos].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    res.json({
      logos: sorted,
      logoSize: config.logoSize,
      scrollSpeed: config.scrollSpeed,
    });
  } catch (err) {
    console.error("PUT /api/logos error:", err);
    res.status(500).json({ message: "Error updating logos" });
  }
});

// ---------- CONTACT PUBLIC ROUTES ----------

app.get("/api/contact", async (req, res) => {
  try {
    let config = await ContactConfig.findOne();

    if (!config) {
      config = await ContactConfig.create({
        heading: "Let's Connect",
        subheading:
          "Ready to transform your digital presence? Get in touch for a free consultation and discover how we can accelerate your business growth.",

        contactCards: [
          {
            id: "email",
            type: "email",
            title: "Email Us",
            content: "support@digitalsocialdreams.com",
            description: "Get a response within 24 hours",
            order: 0,
          },
          {
            id: "phone",
            type: "phone",
            title: "Call Us",
            content: "0311-7672500",
            description: "Always On. Always Ready. 24/7",
            order: 1,
          },
          {
            id: "address-lahore",
            type: "address",
            title: "Visit Us - Lahore",
            content:
              "Main Canal Road, Laalpul Near Shell Petrol Pump, Lahore",
            description: "Lahore, Pakistan",
            order: 2,
          },
          {
            id: "address-dubai",
            type: "address",
            title: "Visit Us - Dubai",
            content: "Dubai Office Address Here",
            description: "Dubai, UAE",
            order: 3,
          },
          {
            id: "hours",
            type: "hours",
            title: "Business Hours",
            content: "Monday - Saturday",
            description: "8:00 AM - 9:00 PM PKT",
            order: 4,
          },
        ],

        services: [
          "Search Engine Optimization",
          "Social Media Marketing",
          "Web Development",
          "Pay-Per-Click Advertising",
          "Analytics & Reporting",
          "Brand Strategy & Design",
          "Complete Digital Marketing",
        ],

        whatsappNumber: "03117672500",

        benefitsTitle: "What You Get",
        benefitsList: [
          "Free 30-minute strategy consultation",
          "Custom digital marketing audit",
          "Personalized growth recommendations",
          "No obligation proposal",
        ],

        qrTitle: "Chat on WhatsApp",
        qrDescription:
          "Prefer instant messaging? Scan the QR code with your phone's camera or click the button below to start a conversation with us directly on WhatsApp.",
        qrImageUrl: "",
        qrBenefits: [
          "Instant responses",
          "File sharing support",
          "Voice messages",
          "24/7 availability",
        ],
      });
    }

    const cards = [...config.contactCards].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    res.json({
      heading: config.heading,
      subheading: config.subheading,
      contactCards: cards,
      services: config.services,
      whatsappNumber: config.whatsappNumber,
      benefitsTitle: config.benefitsTitle,
      benefitsList: config.benefitsList,
      qrTitle: config.qrTitle,
      qrDescription: config.qrDescription,
      qrImageUrl: config.qrImageUrl,
      qrBenefits: config.qrBenefits,
    });
  } catch (err) {
    console.error("GET /api/contact error:", err);
    res.status(500).json({ message: "Error fetching contact config" });
  }
});

// ---------- CONTACT ADMIN ROUTES ----------

app.put("/api/contact", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const config = await ContactConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    const cards = [...config.contactCards].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    res.json({
      heading: config.heading,
      subheading: config.subheading,
      contactCards: cards,
      services: config.services,
      whatsappNumber: config.whatsappNumber,
      benefitsTitle: config.benefitsTitle,
      benefitsList: config.benefitsList,
      qrTitle: config.qrTitle,
      qrDescription: config.qrDescription,
      qrImageUrl: config.qrImageUrl,
      qrBenefits: config.qrBenefits,
    });
  } catch (err) {
    console.error("PUT /api/contact error:", err);
    res.status(500).json({ message: "Error updating contact config" });
  }
});

// ---------- FOOTER PUBLIC ROUTES ----------
app.get("/api/footer", async (req, res) => {
  try {
    let config = await FooterConfig.findOne();

    if (!config) {
      config = await FooterConfig.create({
        brandName: "Digital Social Dreams",
        brandDescription:
          "Transforming businesses through innovative digital marketing strategies. Your success is our mission.",
        contactEmail: "support@digitalsocialdreams.com",
        contactPhone: "0311-7672500",
        contactAddress: "Lahore, Pakistan",

        socialLinks: [
          {
            platform: "facebook",
            label: "Facebook",
            href: "https://web.facebook.com/p/Digital-Social-Dreams-61556582524397",
            order: 0,
          },
          {
            platform: "twitter",
            label: "Twitter",
            href: "https://twitter.com/",
            order: 1,
          },
          {
            platform: "instagram",
            label: "Instagram",
            href: "https://www.instagram.com/digitalsocialdreams/",
            order: 2,
          },
          {
            platform: "linkedin",
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/ayyan-anjum-5399642b0",
            order: 3,
          },
        ],

        servicesLinks: [
          {
            label: "Search Engine Optimization",
            href: "#services",
            order: 0,
          },
          { label: "Social Media Marketing", href: "#services", order: 1 },
          { label: "Web Development", href: "#services", order: 2 },
          {
            label: "Pay-Per-Click Advertising",
            href: "#services",
            order: 3,
          },
          { label: "Analytics & Reporting", href: "#services", order: 4 },
          { label: "Brand Strategy & Design", href: "#services", order: 5 },
        ],

        companyLinks: [
          { label: "About Us", href: "#about", order: 0 },
          { label: "Our Portfolio", href: "#portfolio", order: 1 },
          { label: "Success Stories", href: "#portfolio", order: 2 },
          { label: "Contact Us", href: "#contact", order: 3 },
          { label: "Free Consultation", href: "#contact", order: 4 },
        ],

        newsletterTitle: "Stay Updated",
        newsletterText:
          "Get the latest digital marketing insights and growth strategies delivered to your inbox.",
        newsletterPlaceholder: "Enter your email",
        newsletterButtonLabel: "Subscribe",

        resourcesTitle: "Free Resources",
        resourcesItems: [
          "Digital Marketing Checklist",
          "SEO Audit Template",
          "Social Media Calendar",
        ],

        bottomCopyrightText:
          "© {year} DigitalSocialDreams. All rights reserved.",
        bottomLinks: [
          { label: "Privacy Policy", href: "#", order: 0 },
          { label: "Terms of Service", href: "#", order: 1 },
          { label: "Sitemap", href: "#", order: 2 },
        ],
      });
    }

    const socialLinks = [...config.socialLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const servicesLinks = [...config.servicesLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const companyLinks = [...config.companyLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const bottomLinks = [...config.bottomLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    res.json({
      brandName: config.brandName,
      brandDescription: config.brandDescription,
      contactEmail: config.contactEmail,
      contactPhone: config.contactPhone,
      contactAddress: config.contactAddress,
      socialLinks,
      servicesLinks,
      companyLinks,
      newsletterTitle: config.newsletterTitle,
      newsletterText: config.newsletterText,
      newsletterPlaceholder: config.newsletterPlaceholder,
      newsletterButtonLabel: config.newsletterButtonLabel,
      resourcesTitle: config.resourcesTitle,
      resourcesItems: config.resourcesItems,
      bottomCopyrightText: config.bottomCopyrightText,
      bottomLinks,
    });
  } catch (err) {
    console.error("GET /api/footer error:", err);
    res.status(500).json({ message: "Error fetching footer config" });
  }
});

// ---------- FOOTER ADMIN ROUTES ----------
app.put("/api/footer", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const config = await FooterConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    const socialLinks = [...config.socialLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const servicesLinks = [...config.servicesLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const companyLinks = [...config.companyLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const bottomLinks = [...config.bottomLinks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    res.json({
      brandName: config.brandName,
      brandDescription: config.brandDescription,
      contactEmail: config.contactEmail,
      contactPhone: config.contactPhone,
      contactAddress: config.contactAddress,
      socialLinks,
      servicesLinks,
      companyLinks,
      newsletterTitle: config.newsletterTitle,
      newsletterText: config.newsletterText,
      newsletterPlaceholder: config.newsletterPlaceholder,
      newsletterButtonLabel: config.newsletterButtonLabel,
      resourcesTitle: config.resourcesTitle,
      resourcesItems: config.resourcesItems,
      bottomCopyrightText: config.bottomCopyrightText,
      bottomLinks,
    });
  } catch (err) {
    console.error("PUT /api/footer error:", err);
    res.status(500).json({ message: "Error updating footer config" });
  }
});

// Add to your server.js

// ---------- NAVIGATION PUBLIC ROUTES ----------
app.get("/api/navigation", async (req, res) => {
  try {
    let config = await NavigationConfig.findOne();

    if (!config) {
      config = await NavigationConfig.create({
        brandText: "Digital Social Dreams",
        logoUrl: "",
        navItems: [
          { label: "Home", href: "#home", order: 0, isDropdown: false, dropdownItems: [] },
          { 
            label: "Services", 
            href: "#services", 
            order: 1, 
            isDropdown: true, 
            dropdownItems: [
              { label: "SEO", href: "/services/seo", description: "Search Engine Optimization", icon: "Search", order: 0 },
              { label: "Web Development", href: "/services/web-development", description: "Custom websites & apps", icon: "Code", order: 1 },
              { label: "Social Media", href: "/services/social-media", description: "Social media marketing", icon: "Share2", order: 2 },
              { label: "PPC Advertising", href: "/services/ppc", description: "Pay-per-click campaigns", icon: "Target", order: 3 },
            ]
          },
          { label: "Portfolio", href: "#portfolio", order: 2, isDropdown: false, dropdownItems: [] },
          { label: "About", href: "#about", order: 3, isDropdown: false, dropdownItems: [] },
          { label: "Blog", href: "/blog", order: 4, isDropdown: false, dropdownItems: [] },
          { label: "Contact", href: "/contact", order: 5, isDropdown: false, dropdownItems: [] },
        ],
        ctaLabel: "Get Started",
        ctaHref: "#contact",
      });
    }

    // Sort nav items and dropdown items
    const navItems = [...config.navItems]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({
        ...item.toObject(),
        dropdownItems: item.dropdownItems 
          ? [...item.dropdownItems].sort((a, b) => (a.order || 0) - (b.order || 0))
          : []
      }));

    res.json({
      brandText: config.brandText,
      logoUrl: config.logoUrl,
      navItems,
      ctaLabel: config.ctaLabel,
      ctaHref: config.ctaHref,
    });
  } catch (err) {
    console.error("GET /api/navigation error:", err);
    res.status(500).json({ message: "Error fetching navigation config" });
  }
});

// ---------- NAVIGATION ADMIN ROUTES ----------
app.put("/api/navigation", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const config = await NavigationConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    const navItems = [...config.navItems]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({
        ...item.toObject(),
        dropdownItems: item.dropdownItems 
          ? [...item.dropdownItems].sort((a, b) => (a.order || 0) - (b.order || 0))
          : []
      }));

    res.json({
      brandText: config.brandText,
      logoUrl: config.logoUrl,
      navItems,
      ctaLabel: config.ctaLabel,
      ctaHref: config.ctaHref,
    });
  } catch (err) {
    console.error("PUT /api/navigation error:", err);
    res.status(500).json({ message: "Error updating navigation config" });
  }
});

// ---------- SITE CONFIG PUBLIC ROUTES ----------

app.get("/api/site", async (req, res) => {
  try {
    let config = await SiteConfig.findOne();

    if (!config) {
      config = await SiteConfig.create({
        siteName: "DigitalSocialDreams",
        siteUrl: "https://digitalsocialdreams.com",

        metaTitle:
          "DigitalSocialDreams - Digital Marketing Agency | SEO, Social Media & Web Development",
        metaDescription:
          "Transform your business with DigitalSocialDreams. Expert digital marketing services including SEO, social media marketing, web development, and PPC advertising. Drive growth and maximize ROI.",
        metaKeywords:
          "digital marketing, SEO, social media marketing, web development, PPC advertising, content marketing, brand strategy, digital agency",
        metaAuthor: "DigitalSocialDreams",
        canonicalUrl: "https://digitalsocialdreams.com",

        ogTitle: "DigitalSocialDreams - Digital Marketing Agency",
        ogDescription:
          "Transform your business with expert digital marketing services. SEO, social media, web development & more.",
        ogImage: "https://digitalsocialdreams.com/og-image.jpg",
        ogUrl: "https://digitalsocialdreams.com",

        twitterTitle: "DigitalSocialDreams - Digital Marketing Agency",
        twitterDescription:
          "Transform your business with expert digital marketing services. SEO, social media, web development & more.",
        twitterImage: "https://digitalsocialdreams.com/og-image.jpg",

        organizationSchemaJson: JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "DigitalSocialDreams",
            description:
              "Digital marketing agency specializing in SEO, social media marketing, web development, and PPC advertising",
            url: "https://digitalsocialdreams.com",
            logo: "https://digitalsocialdreams.com/logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-XXX-XXX-XXXX",
              contactType: "customer service",
            },
            sameAs: [
              "https://facebook.com/digitalsocialdreams",
              "https://twitter.com/wasimarketing",
              "https://linkedin.com/company/wasi-marketing-solutions",
            ],
          },
          null,
          2
        ),
        faqSchemaJson: JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What services does your digital marketing agency offer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We provide a full range of digital marketing services including SEO, social media marketing, Google Ads, content creation, and website design to help businesses grow their online presence and increase sales.",
                },
              },
              {
                "@type": "Question",
                name: "How can digital marketing help my business?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Digital marketing helps your business reach the right audience, build brand awareness, and generate leads through strategic online campaigns that deliver measurable results.",
                },
              },
            ],
          },
          null,
          2
        ),
      });
    }

    res.json(config);
  } catch (err) {
    console.error("GET /api/site error:", err);
    res.status(500).json({ message: "Error fetching site config" });
  }
});

// ---------- SITE CONFIG ADMIN ROUTES ----------

app.put("/api/site", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const config = await SiteConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    res.json(config);
  } catch (err) {
    console.error("PUT /api/site error:", err);
    res.status(500).json({ message: "Error updating site config" });
  }
});

// ── Database & Server Start ────────────────────────────────────────────────────

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/agency";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });