import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";
import { getProductDetail } from "../controller/getProductDetails.controller.js";


const router = Router()

router.post("/checkout",verifyJWT,getProductDetail)

export default router;