// backend/models/Page.js
import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // e.g. "privacy-policy"
    content: { type: String, required: true }, // plain text or HTML

    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    // For footer / menus
    showInFooter: { type: Boolean, default: false },
    footerLabel: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Page = mongoose.model("Page", pageSchema);