/**
 * CHANGE BY FARAAZ FOR DELETING OPTION ADD TO CART BECAUSE BACKEND PERSON TAUFIQUE DIDNT WROTE THAT
 * 
 * Controller to remove item from cart
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Cart from "../models/cart.model.js";

export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { product_id } = req.body;

  // Validate input
  if (!product_id) {
    throw new ApiError(400, "Product ID is required");
  }

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find the item index in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product_id === product_id
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Remove the item from cart
  cart.items.splice(itemIndex, 1);

  // Save the updated cart
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});
