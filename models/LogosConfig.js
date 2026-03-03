import mongoose from "mongoose";

const logoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    href: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const logosConfigSchema = new mongoose.Schema(
  {
    logos: [logoSchema],
    logoSize: { type: Number, default: 64 },     // height in px
    scrollSpeed: { type: Number, default: 15 },  // seconds for 1 loop
  },
  { timestamps: true }
);

export const LogosConfig = mongoose.model("LogosConfig", logosConfigSchema);