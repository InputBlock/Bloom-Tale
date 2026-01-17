import mongoose from "mongoose";

const HeroSectionSchema = new mongoose.Schema(
  {
    media_uri: {
      type: String,
      required: true
      // image or video URL from ImageKit
    },

    media_fileId: {
      type: String,
      required: true
      // ImageKit fileId for deletion
    },

    surprise_text: {
      type: String,
      required: true
      // "Surprise Your Valentine!"
    },

    sub_text: {
      type: String,
      required: true
      // "Let us arrange a smile."
    },

    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("HeroSection", HeroSectionSchema);
