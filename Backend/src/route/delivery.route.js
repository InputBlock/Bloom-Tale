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

const router = Router();

// Public route - check delivery by pincode
router.get("/check", checkDelivery);

// Admin routes
router.get("/zones", getAllZones);
router.get("/zones/:zoneId", getZoneById);
router.post("/zones", createZone);
router.put("/zones/:zoneId", updateZone);
router.post("/zones/:zoneId/pincodes", addPincodes);
router.delete("/zones/:zoneId/pincodes", removePincodes);
router.delete("/zones/:zoneId", deleteZone);

export default router;
