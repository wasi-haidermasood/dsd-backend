// backend/models/Page.js
import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    
    // Content type: 'html' for rich text, 'react' for React code
    contentType: {
      type: String,
      enum: ["html", "react"],
      default: "html",
    },
    
    content: { type: String, required: true }, // HTML or React code
    
    // For React pages - additional options
    hasNavigation: { type: Boolean, default: true },
    hasFooter: { type: Boolean, default: true },
    backgroundColor: { type: String, default: "#FFFFFF" },
    
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoImage: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    showInFooter: { type: Boolean, default: false },
    footerLabel: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Page = mongoose.model("Page", pageSchema);