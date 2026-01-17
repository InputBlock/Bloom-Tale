
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//Configurations set
app.use(cors({
    origin:[process.env.CORS_ORIGIN, process.env.ADMIN_CORS_ORIGIN],
    credentials:true
}))

//  Apply general rate limiting to all requests
// app.use(generalLimiter)

app.use(express.json({limit:"16kb"}))  //we accept json data
// app.use(express.urlencoded())       data is from url's
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Server is running ");
});

import authRoutes from "./route/auth.route.js"
import adminRoutes from "./route/admin.route.js"

// Apply strict auth rate limiting to login/register routes
app.use("/api/v1", authRoutes);
app.use("/api/v1/admin", adminRoutes);


import productRoutes from "./route/product.route.js"
app.use("/api/v1/getProductDetail",productRoutes)

import cartRoutes from "./route/cart.route.js"
//  Apply cart rate limiting
app.use("/api/v1/cart", cartRoutes)

import getProductRoutes from "./route/getProduct.route.js"
app.use("/api/v1/getProduct",getProductRoutes)
app.use("/api/v1/getList", getProductRoutes)

import orderRoutes from "./route/order.route.js"
//  Apply order rate limiting
app.use("/api/v1/order", orderRoutes)

import testimonialRoutes from "./route/testimonial.route.js"
app.use("/api/v1/testimonial", testimonialRoutes)

import enquiry from "./route/enquiryForm.route.js"
app.use("/api/v1/enquiry",enquiry)

// Global error handler - MUST be after all routes
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export {app}