import { Router } from "express";
import { 
  checkDelivery, 
  getAllZones, 
  getZoneById, 
  createZone, 
  updateZone, 
  addPincodes, 
  removePincodes, 
  deleteZone 
} from "../controller/delivery.controller.js";
import { verifyAdminJWT } from "../middlewares/verifyAdminJwt.middleware.js";

const router = Router();

// Public route - check delivery by pincode (frontend needs this)
router.get("/check", checkDelivery);

// Public route - get all zones (frontend may need for display)
router.get("/zones", getAllZones);
router.get("/zones/:zoneId", getZoneById);

// Admin-only routes - require authentication
router.post("/zones", verifyAdminJWT, createZone);
router.put("/zones/:zoneId", verifyAdminJWT, updateZone);
router.post("/zones/:zoneId/pincodes", verifyAdminJWT, addPincodes);
router.delete("/zones/:zoneId/pincodes", verifyAdminJWT, removePincodes);
router.delete("/zones/:zoneId", verifyAdminJWT, deleteZone);

export default router;
