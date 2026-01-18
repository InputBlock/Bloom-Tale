import { getUserInfo, getUserById, deleteUser, getUserStats } from "../../admin/userstatus.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const get_user_info = asyncHandler(async (req, res) => {
  const data = await getUserInfo();
  return res.status(200).json(
    new ApiResponse(200, data, "User info fetched successfully")
  );
});

const get_user_by_id = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const data = await getUserById(userId);
  return res.status(200).json(
    new ApiResponse(200, data, "User details fetched successfully")
  );
});

const delete_user = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const data = await deleteUser(userId);
  return res.status(200).json(
    new ApiResponse(200, data, "User deleted successfully")
  );
});

const get_user_stats = asyncHandler(async (req, res) => {
  const data = await getUserStats();
  return res.status(200).json(
    new ApiResponse(200, data, "User stats fetched successfully")
  );
});

export { get_user_info, get_user_by_id, delete_user, get_user_stats };