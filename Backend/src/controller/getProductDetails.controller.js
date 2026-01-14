import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.js";

import mongoose from "mongoose";


export const getProductDetail = asyncHandler(async (req,res)=>{
    const {product_id} = req.params;

    if(!product_id) throw new ApiError(400,"Product id is required")
    
    const product = await Product.findOne({product_id });


    if(!product) throw new ApiError(400,"Product not found");

    

    return res.status(200).json(
        new ApiResponse(200,product,"Product fetched successfully")
    )
    
})