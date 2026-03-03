import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    expertise: { type: String, required: true },
    description: { type: String, required: true },
    profileImage: { type: String, default: "" }, // URL
    order: { type: Number, default: 0 },

    // Additional details for modal (all optional)
    detailsText: { type: String, default: "" },

    experienceYears: { type: String, default: "" },   // e.g. "4+"
    experienceLevel: { type: String, default: "" },   // e.g. "Senior"
    projects: { type: String, default: "" },          // e.g. "200+"

    skills: [{ type: String }],           // list of skills
    certifications: [{ type: String }],   // list of certifications
    achievements: [{ type: String }],     // list of achievements
  },
  { _id: false }
);

const teamConfigSchema = new mongoose.Schema(
  {
    members: [teamMemberSchema],
  },
  { timestamps: true }
);

export const TeamConfig = mongoose.model("TeamConfig", teamConfigSchema);