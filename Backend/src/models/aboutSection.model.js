import mongoose from "mongoose";

const AboutSectionSchema = new mongoose.Schema(
  {
    // Images - simple array, no validation
    images: {
      type: Array,
      default: []
    },

    badge_number: {
      type: String,
      default: "7+"
    },
    badge_text: {
      type: String,
      default: "Years of Excellence"
    },
    title_line1: {
      type: String,
      default: "We Create Beautiful"
    },
    title_line2: {
      type: String,
      default: "Floral Experiences"
    },
    description: {
      type: String,
      default: "At Bloom Tale, every bouquet tells a story."
    },
    
    // Features - simple array, no validation
    features: {
      type: Array,
      default: [
        { icon: "Leaf", text: "Farm Fresh" },
        { icon: "Heart", text: "Handcrafted" },
        { icon: "Award", text: "Premium Quality" }
      ]
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("AboutSection", AboutSectionSchema);
