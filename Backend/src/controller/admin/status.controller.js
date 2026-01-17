import { getUserInfo } from "../../admin/userstatus.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const get_user_info = asyncHandler(async (req, res) => {
  const data = await getUserInfo();
  return res.status(200).json(
    new ApiResponse(200, data, "User info fetched successfully")
  );
});

export { get_user_info };