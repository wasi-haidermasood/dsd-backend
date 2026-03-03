import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    results: { type: String, required: true },
    description: { type: String, required: true },
    metrics: [{ type: String }],
    tags: [{ type: String }],
  },
  { _id: false }
);

const portfolioConfigSchema = new mongoose.Schema(
  {
    headingMain: { type: String, required: true },    // "Success"
    headingAccent: { type: String, required: true },  // "Stories"
    description: { type: String, required: true },
    ctaTitle: { type: String, required: true },
    ctaDescription: { type: String, required: true },
    ctaButtonText: { type: String, required: true },
    projects: [projectSchema],
  },
  { timestamps: true }
);

export const PortfolioConfig = mongoose.model(
  "PortfolioConfig",
  portfolioConfigSchema
);