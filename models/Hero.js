import mongoose from "mongoose";

const buttonSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true }, // can be "#contact", "/admin", "https://..."
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, default: "" },
  thumbnail: { type: String, required: true },
});

const heroSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    buttons: [buttonSchema],
    products: [productSchema],
  },
  { timestamps: true }
);

export const Hero = mongoose.model("Hero", heroSchema);