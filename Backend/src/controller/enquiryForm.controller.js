import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enquiry } from "../models/enquiryForm.model.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, service } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email and message are required");
  }

  const enquiry = await Enquiry.create({
    name,email,phone,subject,message,service,
  })

  return res.status(200).json(new ApiResponse(
    200,
    enquiry,
    "enquiry submitted"
  ))
});
