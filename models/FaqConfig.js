import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const faqConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },

    badge: { type: String, default: "Got Questions?" },
    heading: { type: String, default: "Frequently Asked Questions" },
    highlightedWord: { type: String, default: "Questions" },
    description: {
      type: String,
      default:
        "Everything you need to know about our services, process, and how we drive growth.",
    },

    faqs: [faqItemSchema],

    ctaTitle: {
      type: String,
      default: "Ready to transform your brand?",
    },
    ctaDescription: {
      type: String,
      default:
        "Let's discuss how our tailored digital marketing services and custom development can drive exponential growth for your business.",
    },
    ctaButtonLabel: {
      type: String,
      default: "Start Your Project",
    },
    ctaButtonHref: {
      type: String,
      default: "/contact",
    },
  },
  { timestamps: true }
);

export const FaqConfig = mongoose.model("FaqConfig", faqConfigSchema);