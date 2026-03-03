import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. "seo", "social-media"
    label: { type: String, required: true }, // tab label
    badge: { type: String, required: true }, // small subtitle
    title: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    results: [resultSchema],
    image: { type: String, default: "" }, // Cloudinary URL etc.
    order: { type: Number, default: 0 },
      // NEW: optional per-service buttons
    primaryButtonLabel: { type: String },
    primaryButtonHref: { type: String },
    secondaryButtonLabel: { type: String },
    secondaryButtonHref: { type: String },
  },
  { _id: false }
);

const servicesConfigSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },

    // NEW: service card buttons (for each tab)
    primaryButtonLabel: { type: String, default: "Get Started Now" },
    primaryButtonHref: { type: String, default: "#contact" },
    secondaryButtonLabel: { type: String, default: "View Case Study" },
    secondaryButtonHref: { type: String, default: "#portfolio" },

    // NEW: bottom CTA section
    ctaTitle: {
      type: String,
      default: "Ready to Transform Your Digital Presence?",
    },
    ctaDescription: {
      type: String,
      default:
        "Let's discuss how our digital marketing services can drive growth for your business.",
    },
    ctaPrimaryButtonLabel: {
      type: String,
      default: "Start Your Project Today",
    },
    ctaPrimaryButtonHref: { type: String, default: "#contact" },
    ctaSecondaryButtonLabel: {
      type: String,
      default: "Free Strategy Session",
    },
    ctaSecondaryButtonHref: { type: String, default: "#contact" },

    services: [serviceSchema],
  },
  { timestamps: true }
);

export const ServicesConfig = mongoose.model(
  "ServicesConfig",
  servicesConfigSchema
);