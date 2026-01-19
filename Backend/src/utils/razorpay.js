import crypto from "crypto";
import Order from "../models/order.model.js";
import  Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * STEP 1: Create Razorpay Order
 * Called on Payment Page
 */
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user._id;

  console.log("🔹 createPaymentOrder called with orderId:", orderId);

  const order = await Order.findById(orderId);
  if (!order) {
    console.log("❌ Order not found for ID:", orderId);
    throw new ApiError(404, "Order not found");
  }

  console.log("🔹 Order found:", { 
    orderId: order._id, 
    paymentMethod: order.paymentMethod, 
    status: order.status 
  });

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  if (order.status === "PAID") {
    throw new ApiError(400, "Order already paid");
  }

  if (order.paymentMethod !== "ONLINE") {
    console.log("❌ Payment method is not ONLINE:", order.paymentMethod);
    throw new ApiError(400, `Invalid payment method: ${order.paymentMethod}. Expected ONLINE.`);
  }

  // 🟢 Create Razorpay order only once
  if (order.paymentInfo?.orderId) {
    return res.json(
      new ApiResponse(200, order.paymentInfo, "Payment already initiated")
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100, // in paise
    currency: "INR",
    receipt: order._id.toString(),
  });

  order.paymentInfo = { orderId: razorpayOrder.id };
  await order.save();

  return res.json(
    new ApiResponse(200, razorpayOrder, "Razorpay order created")
  );
});

/**
 * STEP 2: Verify payment (called from frontend handler)
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.status === "PAID") {
    return res.json(new ApiResponse(200, null, "Order already paid"));
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Payment verification failed");
  }

  order.status = "PAID";
  order.order_status="PLACED"
  order.paymentInfo.paymentId = razorpay_payment_id;
  order.paymentInfo.signature = razorpay_signature;

  await order.save();

  return res.json(new ApiResponse(200, null, "Payment verified successfully"));
});



export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = req.body.event;
  const payment = req.body.payload.payment.entity;

  const order = await Order.findOne({
    "paymentInfo.orderId": payment.order_id,
  });

  if (!order) {
    return res.json({ ok: true });
  }

  // Handle payment success
  if (event === "payment.captured" && order.status !== "PAID") {
    order.status = "PAID";
    order.paymentInfo.paymentId = payment.id;
    await order.save();
  }

  // Handle payment failure
  if (event === "payment.failed" && order.status !== "PAID") {
    order.status = "PAYMENT_FAILED";
    order.paymentInfo.paymentId = payment.id;
    await order.save();
  }

  res.json({ ok: true });
};


//For payment failure
export const markPaymentFailed = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user._id;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // security
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  // already paid → ignore
  if (order.status === "PAID") {
    return res.json({ success: true });
  }

  order.status = "PAYMENT_FAILED";
  await order.save();

  return res.json({
    success: true,
    message: "Payment marked as failed",
  });
});
