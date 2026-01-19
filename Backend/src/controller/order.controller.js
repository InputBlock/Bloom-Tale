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
  const { address, deliveryType: reqDeliveryType, deliveryFee: reqDeliveryFee, deliverySlot: reqDeliverySlot } = req.body;

  const user = await User.findById(userId);
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

  //  Calculate totals and get delivery info from cart items
  let totalAmount = 0;
  let cartDeliveryType = "standard";
  let cartDeliveryFee = 0;
  let cartDeliverySlot = null;
  let cartPincode = null;

  cart.items.forEach((item) => {
    if (item.isCombo) {
      totalAmount += item.price; // combo final price
    } else {
      totalAmount += item.price * item.quantity;
    }
    // Get delivery info from first item that has it
    if (item.deliveryType && cartDeliveryType === "standard") {
      cartDeliveryType = item.deliveryType;
    }
    if (item.delivery_charge && cartDeliveryFee === 0) {
      cartDeliveryFee = item.delivery_charge;
    }
    if (item.deliverySlot && !cartDeliverySlot) {
      cartDeliverySlot = item.deliverySlot;
    }
    if (item.delivery_pincode && !cartPincode) {
      cartPincode = item.delivery_pincode;
    }
  });

  // Use request body values if provided, otherwise use cart values
  const finalDeliveryType = reqDeliveryType || cartDeliveryType || "standard";
  const finalDeliveryFee = reqDeliveryFee !== undefined ? reqDeliveryFee : cartDeliveryFee;
  const finalDeliverySlot = reqDeliverySlot || cartDeliverySlot;

  await User.findByIdAndUpdate(userId, {
    $set: { addresses: [address] },
  });

  // 📦 Create order (CART → ORDER snapshot)
  const order = await Order.create({
    order_id: generateOrderId(),
    user: userId,
    customerName: user.fullName || address.fullName || "N/A",
    customerEmail: user.email || address.email || "N/A",
    customerPhone: address.mobile || user.mobile || "N/A",
    items: cart.items.map((item) => ({
      product: item.product,
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      isCombo: item.isCombo,
      combo_items: item.isCombo ? item.combo_items : undefined,
      subtotal: item.subtotal,
      discount: item.discount,
      discount_percentage: item.discount_percentage,
    })),
    deliveryAddress: address,
    deliveryType: finalDeliveryType,
    deliveryFee: finalDeliveryFee,
    deliverySlot: finalDeliverySlot,
    totalAmount,
    status: "PENDING", // payment not done yet
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
