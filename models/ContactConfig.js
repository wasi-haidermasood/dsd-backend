import mongoose from "mongoose";

const contactCardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true }, // "email" | "phone" | "address" | "hours" | "other"
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const contactConfigSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    subheading: { type: String, required: true },

    contactCards: [contactCardSchema], // email, phone, addresses, hours...

    services: [{ type: String }], // dropdown options for "Service Interest"

    whatsappNumber: { type: String, default: "" },

    benefitsTitle: { type: String, default: "" },
    benefitsList: [{ type: String }], // "What you get" bullet points

    qrTitle: { type: String, default: "" },
    qrDescription: { type: String, default: "" },
    qrImageUrl: { type: String, default: "" },
    qrBenefits: [{ type: String }], // bullet points in QR block
  },
  { timestamps: true }
);

export const ContactConfig = mongoose.model("ContactConfig", contactConfigSchema);