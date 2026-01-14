import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.js";
import Cart from "../models/cart.model.js";

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId })
    .populate("items.product");

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(200, { items: [] }, "Cart is empty")
    );
  }
    let totalAmount = 0;

  cart.items.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

  

  return res.status(200).json(
    new ApiResponse(200, {cart,totalAmount}, "Cart fetched successfully")
  );
});
