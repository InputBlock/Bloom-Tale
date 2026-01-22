import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";

import { createOrder, getMyAddresses, getOrderSummary, updatePaymentMethod, confirmCODOrder } from "../controller/order.controller.js";
import { createPaymentOrder } from "../utils/razorpay.js";
import { verifyPayment } from "../utils/razorpay.js";
import { razorpayWebhook } from "../utils/razorpay.js";
import { markPaymentFailed } from "../utils/razorpay.js";
import { getMyOrder } from "../controller/getMyOrder.controller.js";

const router = Router()

router.post("/checkout",verifyJWT,createOrder)
router.post("/getaddress",verifyJWT,getMyAddresses)

router.patch(
  "/:orderId/payment-method",
  verifyJWT,
  updatePaymentMethod
);

// COD confirmation - clears cart after user confirms
router.post("/:orderId/confirm-cod", verifyJWT, confirmCODOrder);

router.post("/payment", verifyJWT, createPaymentOrder);
router.post("/verify-payment", verifyJWT, verifyPayment);

// webhook (NO auth - Razorpay server-to-server call)
router.post("/webhook", razorpayWebhook);

// Mark payment as failed - requires auth to prevent abuse
router.post("/markPaymentFailed", verifyJWT, markPaymentFailed);

router.get("/:orderId/orderSummary",verifyJWT,getOrderSummary)

router.get("/myOrder",verifyJWT,getMyOrder)

export default router;