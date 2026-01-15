import mongoose from "mongoose";
const { Schema } = mongoose;

// 🔹 Order Item (Snapshot)
const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },

  product_id: {
    type: String,
    required: true
  },

  product_name: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  price: {
    type: Number,
    required: true
  },

  tax: {
    type: Number,
    default: 0
  },

  item_total: {
    type: Number,
    required: true
  }
}, { _id: false });

// 🔹 Address Snapshot (Single Object, not array)
const addressSchema = new Schema({
  title: String,
  fullName: String,

  country: {
    type: String,
    default: "India"
  },

  streetAddress: String,
  house: String,

  pincode: String,
  city: String,
  state: String,

  mobile: String,
  alternateMobile: String,
  email: String,

  addressTag: String
}, { _id: false });

const orderSchema = new Schema(
  {
    // 🔹 Order identity
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // 🔹 Items snapshot
    items: {
      type: [orderItemSchema],
      required: true,
      validate: v => v.length > 0
    },

    // 🔹 Single address snapshot
    deliveryAddress: {
      type: addressSchema,
      required: true
    },

    // 🔹 Pricing breakdown
    pricing: {
      subtotal: {
        type: Number,
        required: true
      },
      taxTotal: {
        type: Number,
        required: true
      },
      discount: {
        type: Number,
        default: 0
      },
      totalAmount: {
        type: Number,
        required: true
      }
    },

    // 🔹 Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true
    },

    paymentInfo: {
      provider: String,          // Razorpay / Stripe
      orderId: String,
      paymentId: String,
      signature: String,
      status: {
        type: String,
        enum: ["PENDING", "AUTHORIZED", "PAID", "FAILED", "REFUNDED"],
        default: "PENDING"
      },
      paidAt: Date
    },

    // 🔹 Order lifecycle
    status: {
      type: String,
      enum: [
        "CREATED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED"
      ],
      default: "CREATED",
      index: true
    },

    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now
        },
        reason: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
