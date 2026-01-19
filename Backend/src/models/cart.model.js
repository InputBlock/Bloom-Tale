import mongoose from "mongoose";
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: false, // Not required for combo items
  },
  product_id: {
    type: String, // PRO2 or COMBO_xxx
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    required: false, // Not required for combo items
  },
  price: {
    type: Number, // price at time of add
    required: true,
  },
  // Combo-specific fields
  isCombo: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: false, // Name for combo packages
  },
  combo_items: {
    type: Array,
    required: false, // Array of items in the combo
  },
  delivery_pincode: {
    type: String,
    required: false,
  },
  delivery_charge: {
    type: Number,
    required: false,
  },
  subtotal: {
    type: Number,
    required: false,
  },
  discount: {
    type: Number,
    required: false,
  },
  discount_percentage: {
    type: Number,
    required: false,
  },
});

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
