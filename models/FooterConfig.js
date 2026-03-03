import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true }, // e.g. "facebook", "twitter"
    label: { type: String, required: true },    // e.g. "Facebook"
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const navLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const footerConfigSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
    brandDescription: { type: String, required: true },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactAddress: { type: String, default: "" },

    socialLinks: [socialLinkSchema],   // social icons row
    servicesLinks: [navLinkSchema],    // "Our Services" column
    companyLinks: [navLinkSchema],     // "Company" column

    newsletterTitle: { type: String, default: "" },
    newsletterText: { type: String, default: "" },
    newsletterPlaceholder: { type: String, default: "" },
    newsletterButtonLabel: { type: String, default: "" },

    resourcesTitle: { type: String, default: "" },
    resourcesItems: [{ type: String }], // bullet list

    bottomCopyrightText: { type: String, default: "" },
    bottomLinks: [navLinkSchema],       // Privacy, Terms, Sitemap
  },
  { timestamps: true }
);

export const FooterConfig = mongoose.model("FooterConfig", footerConfigSchema);