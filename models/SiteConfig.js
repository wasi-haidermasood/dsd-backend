// backend/models/SiteConfig.js
import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true },
    siteUrl: { type: String, required: true },

    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String, default: "" },
    metaAuthor: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },

    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    ogUrl: { type: String, default: "" },

    twitterTitle: { type: String, default: "" },
    twitterDescription: { type: String, default: "" },
    twitterImage: { type: String, default: "" },

    // store JSON as plain text, admin will paste valid JSON here
    organizationSchemaJson: { type: String, default: "" },
    faqSchemaJson: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);