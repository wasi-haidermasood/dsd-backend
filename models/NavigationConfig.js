// backend/models/NavigationConfig.js
import mongoose from "mongoose";

const navItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true }, // "#services", "/blog", "https://..."
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const navigationConfigSchema = new mongoose.Schema(
  {
    brandText: { type: String, required: true },
    logoUrl: { type: String, default: "" },

    navItems: [navItemSchema],

    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
  },
  { timestamps: true }
);

export const NavigationConfig = mongoose.model(
  "NavigationConfig",
  navigationConfigSchema
);