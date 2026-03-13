// backend/models/NavigationConfig.js
import mongoose from "mongoose";

const dropdownItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const navItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, default: "" },
  order: { type: Number, default: 0 },
  isDropdown: { type: Boolean, default: false },
  dropdownItems: [dropdownItemSchema],
});

const navigationConfigSchema = new mongoose.Schema(
  {
    brandText: { type: String, default: "Digital Social Dreams" },
    logoUrl: { type: String, default: "" },
    navItems: [navItemSchema],
    ctaLabel: { type: String, default: "Get Started" },
    ctaHref: { type: String, default: "#contact" },
  },
  { timestamps: true }
);

export const NavigationConfig = mongoose.model("NavigationConfig", navigationConfigSchema);