import mongoose from "mongoose";

const blogSettingsSchema = new mongoose.Schema(
  {
    pageTitle: { type: String, required: true },
    pageDescription: { type: String, required: true },
  },
  { timestamps: true }
);

export const BlogSettings = mongoose.model(
  "BlogSettings",
  blogSettingsSchema
);