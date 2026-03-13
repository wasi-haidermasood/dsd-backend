import mongoose from "mongoose";

const buttonSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, default: "" },
  thumbnail: { type: String, required: true },
});

const trustLogoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const statSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "" },
  company: { type: String, default: "" },
  avatar: { type: String, default: "" },
  text: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
});

const rotatingPhraseSchema = new mongoose.Schema({
  text: { type: String, required: true },
  color: { type: String, default: "#FACC15" },
});

const typographySchema = new mongoose.Schema({
  headingFont: { type: String, default: "Inter" },
  headingWeight: { type: String, default: "700" },
  headingSize: { type: String, default: "default" },
  headingColor: { type: String, default: "#FFFFFF" },
  descriptionFont: { type: String, default: "Inter" },
  descriptionSize: { type: String, default: "default" },
  descriptionColor: { type: String, default: "rgba(255,255,255,0.6)" },
  highlightBgColor: { type: String, default: "#FACC15" },
  highlightTextColor: { type: String, default: "#111827" },
  highlightRadius: { type: String, default: "6px" },
  highlightRotation: { type: Number, default: -1 },
  boldColor: { type: String, default: "#FFFFFF" },
  italicColor: { type: String, default: "#FACC15" },
});

const widgetsSchema = new mongoose.Schema({
  showAvailabilityWidget: { type: Boolean, default: true },
  availabilityText: { type: String, default: "Available for new projects" },
  showStatsWidget: { type: Boolean, default: true },
  stats: [statSchema],
  animateStats: { type: Boolean, default: true },
  showVideoWidget: { type: Boolean, default: true },
  videoThumbnail: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  autoPlayVideo: { type: Boolean, default: false },
  showTestimonialWidget: { type: Boolean, default: true },
  testimonials: [testimonialSchema],
  testimonialTypingEffect: { type: Boolean, default: true },
  testimonialAutoRotate: { type: Boolean, default: true },
  testimonialRotateInterval: { type: Number, default: 6000 },
  showRotatingPhrases: { type: Boolean, default: false },
  rotatingPhrases: [rotatingPhraseSchema],
  rotatingPhrasesInterval: { type: Number, default: 3000 },
  animateTrustLogos: { type: Boolean, default: true },
  trustLogosSpeed: { type: Number, default: 20 },
  showBackgroundEffects: { type: Boolean, default: true },
  showScrollIndicator: { type: Boolean, default: true },
  typography: { type: typographySchema, default: () => ({}) },
});

const heroSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    buttons: [buttonSchema],
    products: [productSchema],
    trustText: { type: String, default: "Trusted by leading brands" },
    trustLogos: [trustLogoSchema],
    widgets: { type: widgetsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Hero = mongoose.model("Hero", heroSchema);