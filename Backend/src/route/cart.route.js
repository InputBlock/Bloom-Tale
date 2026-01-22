import { Router } from "express";
import { addToCart } from "../controller/addToCart.controller.js";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";
import { getCart } from "../controller/getCart.controller.js";
import { addComboToCart } from "../controller/addComboToCart.controller.js";
// CHANGE BY FARAAZ FOR DELETING OPTION ADD TO CART BECAUSE BACKEND PERSON TAUFIQUE DIDNT WROTE THAT
import { removeFromCart } from "../controller/removeFromCart.controller.js";
import { updateCartQuantity } from "../controller/updateCartQuantity.controller.js";

const router = Router()

router.post("/addToCart",verifyJWT,addToCart)
router.post("/addComboToCart",verifyJWT,addComboToCart)
router.post("/getCart",verifyJWT,getCart)
// CHANGE BY FARAAZ FOR DELETING OPTION ADD TO CART BECAUSE BACKEND PERSON TAUFIQUE DIDNT WROTE THAT
router.post("/removeFromCart",verifyJWT,removeFromCart)
router.post("/updateQuantity",verifyJWT,updateCartQuantity)


export default router;