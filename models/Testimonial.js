import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    image: { type: String, default: "" }, // optional image URL
    rating: { type: Number, min: 1, max: 5 }, // optional
    source: { type: String, default: "website" }, // optional (e.g. "website form")
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }, // moderation
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);