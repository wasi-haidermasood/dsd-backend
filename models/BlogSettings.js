// models/BlogSettings.js
import mongoose from "mongoose";

const blogSettingsSchema = new mongoose.Schema(
  {
    // SEO
    pageTitle: { type: String, default: "Blog | Digital Social Dreams" },
    pageDescription: { 
      type: String, 
      default: "Read the latest insights on digital marketing, SEO, development, and growth strategies." 
    },
    
    // Header Section
    badge: { type: String, default: "Articles & Resources" },
    heading: { type: String, default: "Our Latest Insights" },
    highlightedWord: { type: String, default: "Insights" },
    description: { 
      type: String, 
      default: "Explore our latest articles on digital marketing, SEO, development and growth strategies designed to scale your business." 
    },
    
    // Colors & Styling
    accentColor: { type: String, default: "#FACC15" },
    accentColorDark: { type: String, default: "#D97706" },
    badgeBgColor: { type: String, default: "#FEF9C3" },
    badgeBorderColor: { type: String, default: "#FDE68A" },
    badgeTextColor: { type: String, default: "#CA8A04" },
    
    // Empty State
    emptyStateTitle: { type: String, default: "No articles found" },
    emptyStateDescription: { 
      type: String, 
      default: "We are currently brewing up some amazing content. Check back soon for our latest updates and insights." 
    },
    
    // Card Styling
    cardBorderRadius: { type: String, default: "2rem" },
    cardHoverScale: { type: Number, default: 1.02 },
    showReadTime: { type: Boolean, default: true },
    showCategory: { type: Boolean, default: true },
    showAuthor: { type: Boolean, default: true },
    
    // Layout
    postsPerRow: { type: Number, default: 3 },
    gap: { type: String, default: "2.5rem" },
  },
  { timestamps: true }
);

export const BlogSettings = mongoose.model("BlogSettings", blogSettingsSchema);