import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { address, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  //  Calculate totals
  let totalAmount = 0;
  cart.items.forEach(item => {
    totalAmount += item.price * item.quantity;
  });



  // 💾 Save address to user if required

    await User.findByIdAndUpdate(userId, {
      $push: { addresses: address },
    });
  

  // 📦 Create order (CART → ORDER snapshot)
  const order = await Order.create({
    user: userId,
    items: cart.items.map(item => ({
      product: item.product,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
    deliveryAddress: address,
    totalAmount,
    paymentMethod,
    status: paymentMethod === "COD" ? "PAID" : "PENDING",
  });

  // 🧹 Clear cart
  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [] }
  );

  return res.status(201).json(
    new ApiResponse(201, order, "Order created successfully")
  );
});
