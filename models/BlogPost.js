import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // e.g. "seo-ai-strategies"
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // full text / HTML / markdown
    category: { type: String, default: "" },
    tags: [{ type: String }],
    author: { type: String, default: "" },
    date: { type: String, default: "" }, // e.g. "Oct 24, 2023"
    readTime: { type: String, default: "" }, // e.g. "5 min read"
    image: { type: String, default: "" }, // main cover image URL
    seoTitle: { type: String, default: "" }, // meta title for this post
    seoDescription: { type: String, default: "" }, // meta description
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);