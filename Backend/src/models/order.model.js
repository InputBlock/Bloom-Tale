import mongoose from "mongoose";
const { Schema } = mongoose;

// 🔹 Order Item = snapshot of cart item
const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  product_id: String,
  productName: String,
  productImage: String,
  quantity: Number,
  price: Number,
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

    items: [orderItemSchema],

    deliveryAddress: [addressSchema],

    
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
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED"
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
