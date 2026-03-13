// models/HowWeWorkConfig.js
import mongoose from "mongoose";

const processStepSchema = new mongoose.Schema({
  stepId: { type: String, default: "01" },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" },
  tags: [{ type: String }],
  image: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const cornerImageSchema = new mongoose.Schema({
  imageUrl: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const howWeWorkConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    badge: { type: String, default: "The Process" },
    heading: { type: String, default: "Our Strategy for" },
    rotatingWords: [{ type: String }],
    description: { type: String, default: "" },
    highlightedText: { type: String, default: "elegant solutions" },
    descriptionSuffix: {
      type: String,
      default: "through a proven four-step methodology.",
    },
    cornerImages: [cornerImageSchema],
    steps: [processStepSchema],
  },
  { timestamps: true }
);

export const HowWeWorkConfig = mongoose.model(
  "HowWeWorkConfig",
  howWeWorkConfigSchema
);