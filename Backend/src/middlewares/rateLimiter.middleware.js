import rateLimit from "express-rate-limit";

// General API Rate Limiter - 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Strict Auth Rate Limiter - For login/register (5 attempts per 15 min)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes per IP
  message: {
    success: false,
    statusCode: 429,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
});

// OTP Rate Limiter - For OTP requests (3 per 10 min)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, 
  message: {
    success: false,
    statusCode: 429,
    message: "Too many OTP requests, please try again after 10 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Cart Rate Limiter - 30 requests per minute
export const cartLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many cart operations, please slow down",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Order/Payment Rate Limiter - 10 per minute
export const orderLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many order requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
