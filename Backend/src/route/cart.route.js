import { Router } from "express";
import { addToCart } from "../controller/addToCart.controller.js";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";
import { getCart } from "../controller/getCart.controller.js";

const router = Router()

router.post("/addToCart",verifyJWT,addToCart)
router.post("/getCart",verifyJWT,getCart)


export default router;