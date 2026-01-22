import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Cart from "../models/cart.model.js";

export const updateCartQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { product_id, quantity, size, color } = req.body;

  if (!product_id || quantity === undefined) {
    throw new ApiError(400, "Product ID and quantity are required");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find the item in cart (match by product_id, and optionally size/color)
  const itemIndex = cart.items.findIndex((item) => {
    if (item.isCombo) return false;
    if (item.product_id !== product_id) return false;
    // If size/color provided, match them too
    if (size !== undefined && item.size !== size) return false;
    if (color !== undefined && item.color !== color) return false;
    return true;
  });

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;

  await cart.save();

  // Populate product details for response
  await cart.populate('items.product', 'name images_uri');

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart quantity updated successfully"));
});
