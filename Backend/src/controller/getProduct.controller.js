import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.js";

import mongoose from "mongoose";


export const getProducts = asyncHandler(async (req, res) => {
  const { category, subcategory } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;

  const products = await Product.find(filter);

  if (!products.length) {
    throw new ApiError(404, "No products found");
  }

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});


export const getBestSellerProducts = asyncHandler(async (req, res) => {
  const { category, subcategory } = req.query;

  const filter = { bestSeller: true };

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;

  const products = await Product.find(filter);

  if (!products.length) {
    throw new ApiError(404, "No bestseller products found");
  }

  return res.status(200).json(
    new ApiResponse(200, products, "Bestseller products fetched")
  );
});

// Get all active products for public display
export const getActiveProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ is_active: true });

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});
