import WhatOurCustomerSay from "../models/whatourcustomersay.js"
import User from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const testimonialcomment = asyncHandler(async (req, res) => {
  const userId = req.user._id // From JWT middleware
  const { testimonial, rating } = req.body

  if (!testimonial || !rating) {
    throw new ApiError(400, "Testimonial and rating are required")
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5")
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  // Get user name and profile picture (with fallbacks)
  const userName = user.name || user.username || user.email.split("@")[0]
  const profilePicture = user.metadata?.picture || user.metadata?.google_profile?.picture || ""

  // Find or create customer testimonial document
  let customerSay = await WhatOurCustomerSay.findOne({ user: userId })

  if (!customerSay) {
    customerSay = await WhatOurCustomerSay.create({
      user: userId,
      profile_picture: profilePicture,
      name: userName,
      testimonials: [{ testimonial, rating }],
    })
  } else {
    customerSay.testimonials.push({ testimonial, rating })
    await customerSay.save()
  }

  return res
    .status(201)
    .json(new ApiResponse(201, customerSay, "Testimonial added successfully"))
})

// Get all testimonials (public - for frontend display)
const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await WhatOurCustomerSay.find()
    .sort({ createdAt: -1 })
    .limit(20)

  // Flatten testimonials for easier frontend use
  const formattedTestimonials = []
  testimonials.forEach((doc) => {
    doc.testimonials.forEach((item) => {
      formattedTestimonials.push({
        _id: item._id,
        name: doc.name,
        profile_picture: doc.profile_picture,
        testimonial: item.testimonial,
        rating: item.rating,
        createdAt: item.createdAt,
      })
    })
  })

  // Sort by date and limit
  formattedTestimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return res
    .status(200)
    .json(new ApiResponse(200, formattedTestimonials.slice(0, 10), "Testimonials fetched successfully"))
})

// Get user's own testimonials
const getMyTestimonials = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const customerSay = await WhatOurCustomerSay.findOne({ user: userId })

  if (!customerSay) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No testimonials found"))
  }

  return res
    .status(200)
    .json(new ApiResponse(200, customerSay, "Your testimonials fetched successfully"))
})

// Delete a testimonial
const deleteTestimonial = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { testimonialId } = req.params

  const customerSay = await WhatOurCustomerSay.findOne({ user: userId })

  if (!customerSay) {
    throw new ApiError(404, "No testimonials found")
  }

  const testimonialIndex = customerSay.testimonials.findIndex(
    (t) => t._id.toString() === testimonialId
  )

  if (testimonialIndex === -1) {
    throw new ApiError(404, "Testimonial not found")
  }

  customerSay.testimonials.splice(testimonialIndex, 1)
  await customerSay.save()

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Testimonial deleted successfully"))
})

export { testimonialcomment, getAllTestimonials, getMyTestimonials, deleteTestimonial }