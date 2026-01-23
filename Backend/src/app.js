
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import compression from "compression"
// import { generalLimiter, authLimiter, cartLimiter, orderLimiter } from "./middlewares/rateLimiter.middleware.js"

const app = express()

// Security headers
app.use(helmet())

// Compression for responses
app.use(compression())

// Trust proxy (for rate limiting behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

// CORS configuration
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    process.env.ADMIN_CORS_ORIGIN,
    // Auto-include www variant if main origin doesn't have www
    process.env.CORS_ORIGIN?.replace('https://', 'https://www.'),
    process.env.CORS_ORIGIN?.replace('https://www.', 'https://'),
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

// Rate limiting disabled for testing
// app.use(generalLimiter)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Server is running ");
});

import authRoutes from "./route/auth.route.js"
import adminRoutes from "./route/admin.route.js"

// Rate limiting disabled for testing
app.use("/api/v1", authRoutes);
app.use("/api/v1/admin", adminRoutes);


import productRoutes from "./route/product.route.js"
app.use("/api/v1/getProductDetail",productRoutes)

import cartRoutes from "./route/cart.route.js"
// Rate limiting disabled for testing
app.use("/api/v1/cart", cartRoutes)

import getProductRoutes from "./route/getProduct.route.js"
app.use("/api/v1/getProduct",getProductRoutes)
app.use("/api/v1/getList", getProductRoutes)

import orderRoutes from "./route/order.route.js"
// Rate limiting disabled for testing
app.use("/api/v1/order", orderRoutes)

import testimonialRoutes from "./route/testimonial.route.js"
app.use("/api/v1/testimonial", testimonialRoutes)

import enquiry from "./route/enquiryForm.route.js"
app.use("/api/v1/enquiry",enquiry)

import deliveryRoutes from "./route/delivery.route.js"
app.use("/api/v1/delivery", deliveryRoutes)

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