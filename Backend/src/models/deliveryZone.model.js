import mongoose from "mongoose";

const deliveryZoneSchema = new mongoose.Schema(
  {
    zone_id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pincodes: [{
      type: String,
      index: true,
    }],
    pricing: {
      nextDay: { type: Number, required: true },
      sameDay: { type: Number, required: true },
      express: { type: Number, required: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster pincode lookups
deliveryZoneSchema.index({ pincodes: 1 });

export default mongoose.model("DeliveryZone", deliveryZoneSchema);
