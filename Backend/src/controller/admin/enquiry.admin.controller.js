import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Enquiry } from "../../models/enquiryForm.model.js";

// Get all enquiries with pagination
export const getAllEnquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const status = req.query.status; // Filter by status: pending, resolved
  const skip = (page - 1) * limit;

  const query = {};
  if (status && ["pending", "resolved"].includes(status)) {
    query.status = status;
  }

  const [enquiries, total] = await Promise.all([
    Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Enquiry.countDocuments(query)
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      enquiries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalEnquiries: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }, "Enquiries fetched successfully")
  );
});

// Get single enquiry by ID
export const getEnquiryById = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;

  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  return res.status(200).json(
    new ApiResponse(200, enquiry, "Enquiry fetched successfully")
  );
});

// Update enquiry status (mark as resolved/pending)
export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "resolved"].includes(status)) {
    throw new ApiError(400, "Valid status (pending/resolved) is required");
  }

  const enquiry = await Enquiry.findByIdAndUpdate(
    enquiryId,
    { status },
    { new: true }
  );

  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  return res.status(200).json(
    new ApiResponse(200, enquiry, `Enquiry marked as ${status}`)
  );
});

// Delete enquiry
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;

  const enquiry = await Enquiry.findByIdAndDelete(enquiryId);
  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { deleted: true }, "Enquiry deleted successfully")
  );
});

// Get enquiry stats
export const getEnquiryStats = asyncHandler(async (req, res) => {
  const [total, pending, resolved] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "pending" }),
    Enquiry.countDocuments({ status: "resolved" })
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalEnquiries: total,
      pendingEnquiries: pending,
      resolvedEnquiries: resolved
    }, "Enquiry stats fetched successfully")
  );
});
