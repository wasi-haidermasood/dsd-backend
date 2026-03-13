import mongoose from "mongoose";

const serviceResultSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  badge: { type: String, default: "" },
  tagline: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  results: [serviceResultSchema],
  image: { type: String, default: "" },
  accentColor: { type: String, default: "#FACC15" },
  primaryButtonLabel: { type: String, default: "Get Started" },
  primaryButtonHref: { type: String, default: "#contact" },
  secondaryButtonLabel: { type: String, default: "Learn More" },
  secondaryButtonHref: { type: String, default: "" },
});

const servicesConfigSchema = new mongoose.Schema(
  {
    sectionId: { type: String, default: "services" },
    badge: { type: String, default: "Our Services" },
    heading: { type: String, required: true },
    highlightedWord: { type: String, default: "" },
    description: { type: String, required: true },
    services: [serviceSchema],
    ctaTitle: { type: String, default: "" },
    ctaDescription: { type: String, default: "" },
    ctaPrimaryLabel: { type: String, default: "Get Started" },
    ctaPrimaryHref: { type: String, default: "#contact" },
    ctaSecondaryLabel: { type: String, default: "" },
    ctaSecondaryHref: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ServicesConfig = mongoose.model("ServicesConfig", servicesConfigSchema);