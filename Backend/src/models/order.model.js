import mongoose from "mongoose";
const { Schema } = mongoose;

// 🔹 Combo sub-item schema (for combo orders)
const comboSubItemSchema = new Schema(
  {
    product_id: String,
    name: String,
    size: String,
    color: String,
    quantity: Number,
    price: Number,
  },
  { _id: false }
);

// 🔹 Order Item = snapshot of cart item
const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  product_id: String,
  productName: String,
  productImage: String,
  size: String,
  color: String,
  quantity: Number,
  price: Number,
  // Combo-specific fields
  isCombo: {
    type: Boolean,
    default: false,
  },
  comboName: String,
  combo_items: [comboSubItemSchema],
  // Price breakdown
  subtotal: Number,
  discount: Number,
  discount_percentage: Number,
});

// 🔹 Embedded address snapshot
const addressSchema = {
  title: String, // Mr / Ms
  fullName: String,
 

  country: {
    type: String,
    default: "India",
  },

  streetAddress: String,
  house: String,

  pincode: String,
  city: String,
  state: String,

  mobile: String,
  alternateMobile: String,
  email: String,

};

const orderSchema = new Schema(
  {
    order_id: {
      type: String,
      unique: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
    },

    customerEmail: {
      type: String,
    },

    customerPhone: {
      type: String,
    },

    items: [orderItemSchema],

    deliveryAddress: [addressSchema],

    // Delivery info
    deliveryType: {
      type: String,
      enum: ["fixed", "midnight", "express", "standard"],
      default: "standard",
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    handlingCharge: {
      type: Number,
      default: 0,
    },

    deliverySlot: {
      type: String,
    },

    deliveryPincode: {
      type: String,
    },
    
    totalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      // required: true,
      default:null
    },
    
    order_status:{
      type:String,
        enum: [
        "PLACED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
        "CREATED"
      ],
      default: "CREATED",
    },

    status: {
      type: String,
      enum: ["PENDING", "PAYMENT_FAILED", "PAID", "CANCELLED"],
      default: "PENDING",
    },

    paymentInfo: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
