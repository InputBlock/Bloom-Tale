import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Generate unique order ID (e.g., A1B2C3D4)
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${timestamp.slice(-4)}${random}`;
};

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { address } = req.body;

  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, "User not found");
  }


  if (!address) {
    throw new ApiError(400, "Delivery address is required");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  //  Calculate totals
  let totalAmount = 0;
  cart.items.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

 await User.findByIdAndUpdate(userId, {
    $set: { addresses: [address] }
  });


  // 📦 Create order (CART → ORDER snapshot)
  const order = await Order.create({
    order_id: generateOrderId(),
    user: userId,
    customerName: address.fullName || user.username || "N/A",
    customerEmail: user.email || address.email || "N/A",
    items: cart.items.map((item) => ({
      product: item.product,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
    deliveryAddress: address,
    totalAmount,
    status: "PENDING", // payment not done yet
    order_status: "CREATED", // order fulfillment status
    paymentMethod: null,
  });

  // // 🧹 Clear cart
  // await Cart.findOneAndUpdate({ user: userId }, { items: [] });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

export const getMyAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("addresses");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user.addresses || [], "Addresses fetched"));
});

export const updatePaymentMethod = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;
  const { paymentMethod } = req.body;

  // 1️⃣ Validate
  if (!["COD", "ONLINE"].includes(paymentMethod)) {
    throw new ApiError(400, "Invalid payment method");
  }

  // 2️⃣ Get order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // 3️⃣ Ownership check (SECURITY)
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  // 4️⃣ Update payment method
  order.paymentMethod = paymentMethod;

  // If COD → directly mark PAID
  // if (paymentMethod === "COD") {
  //   order.status = "PAID";
  // }

  await order.save();

   // 🧹 Clear cart
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Payment method updated successfully"));
});

export const getOrderSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to view this order");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order Summary Fetched successfully"));
});
//Razorpay => Goto util razorpay.js
