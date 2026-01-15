import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";

import { createOrder, updatePaymentMethod } from "../controller/order.controller.js";
import { createPaymentOrder } from "../utils/razorpay.js";
import { verifyPayment } from "../utils/razorpay.js";
import { razorpayWebhook } from "../utils/razorpay.js";
import { markPaymentFailed } from "../utils/razorpay.js";

const router = Router()

router.post("/checkout",verifyJWT,createOrder)
router.patch(
  "/:orderId/payment-method",
  verifyJWT,
  updatePaymentMethod
);

router.post("/payment", verifyJWT, createPaymentOrder);
router.post("/verify-payment", verifyJWT, verifyPayment);

// webhook (NO auth)
router.post("/webhook", razorpayWebhook);

router.post("/makePaymentFailed",makePaymentFailed)

export default router;