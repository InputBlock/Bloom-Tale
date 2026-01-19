import DeliveryZone from "../models/deliveryZone.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Check delivery availability by pincode
export const checkDelivery = asyncHandler(async (req, res) => {
  const { pincode } = req.query;

  if (!pincode || pincode.length !== 6) {
    throw new ApiError(400, "Valid 6-digit pincode is required");
  }

  const zone = await DeliveryZone.findOne({ 
    pincodes: pincode, 
    isActive: true 
  });

  if (!zone) {
    return res.status(200).json(
      new ApiResponse(200, { 
        available: false, 
        message: "Delivery not available in this area yet" 
      }, "Pincode checked")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, {
      available: true,
      zone: {
        id: zone.zone_id,
        name: zone.name,
        pricing: zone.pricing
      }
    }, "Delivery available")
  );
});

// Get all zones (admin)
export const getAllZones = asyncHandler(async (req, res) => {
  const zones = await DeliveryZone.find().sort({ zone_id: 1 });

  return res.status(200).json(
    new ApiResponse(200, {
      total: zones.length,
      zones: zones.map(z => ({
        id: z.zone_id,
        name: z.name,
        description: z.description,
        pincodeCount: z.pincodes.length,
        pricing: z.pricing,
        isActive: z.isActive,
      }))
    }, "Zones fetched")
  );
});

// Get zone details with pincodes (admin)
export const getZoneById = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;

  const zone = await DeliveryZone.findOne({ zone_id: zoneId });

  if (!zone) {
    throw new ApiError(404, "Zone not found");
  }

  return res.status(200).json(
    new ApiResponse(200, zone, "Zone details fetched")
  );
});

// Create new zone (admin)
export const createZone = asyncHandler(async (req, res) => {
  const { zone_id, name, description, pincodes, pricing } = req.body;

  if (!zone_id || !name || !pricing) {
    throw new ApiError(400, "Zone ID, name, and pricing are required");
  }

  const existing = await DeliveryZone.findOne({ zone_id });
  if (existing) {
    throw new ApiError(400, "Zone with this ID already exists");
  }

  const zone = await DeliveryZone.create({
    zone_id,
    name,
    description,
    pincodes: pincodes || [],
    pricing,
    isActive: true,
  });

  return res.status(201).json(
    new ApiResponse(201, zone, "Zone created successfully")
  );
});

// Update zone (admin)
export const updateZone = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;
  const { name, description, pricing, isActive } = req.body;

  const zone = await DeliveryZone.findOne({ zone_id: zoneId });

  if (!zone) {
    throw new ApiError(404, "Zone not found");
  }

  if (name) zone.name = name;
  if (description !== undefined) zone.description = description;
  if (pricing) zone.pricing = pricing;
  if (isActive !== undefined) zone.isActive = isActive;

  await zone.save();

  return res.status(200).json(
    new ApiResponse(200, zone, "Zone updated successfully")
  );
});

// Add pincodes to zone (admin)
export const addPincodes = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;
  const { pincodes } = req.body;

  if (!pincodes || !Array.isArray(pincodes)) {
    throw new ApiError(400, "Pincodes array is required");
  }

  const zone = await DeliveryZone.findOne({ zone_id: zoneId });

  if (!zone) {
    throw new ApiError(404, "Zone not found");
  }

  // Remove duplicates and add new pincodes
  const existingSet = new Set(zone.pincodes);
  const newPincodes = pincodes.filter(p => !existingSet.has(p));
  zone.pincodes.push(...newPincodes);

  await zone.save();

  return res.status(200).json(
    new ApiResponse(200, { 
      added: newPincodes.length, 
      total: zone.pincodes.length 
    }, `${newPincodes.length} pincodes added`)
  );
});

// Remove pincodes from zone (admin)
export const removePincodes = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;
  const { pincodes } = req.body;

  if (!pincodes || !Array.isArray(pincodes)) {
    throw new ApiError(400, "Pincodes array is required");
  }

  const zone = await DeliveryZone.findOne({ zone_id: zoneId });

  if (!zone) {
    throw new ApiError(404, "Zone not found");
  }

  const removeSet = new Set(pincodes);
  zone.pincodes = zone.pincodes.filter(p => !removeSet.has(p));

  await zone.save();

  return res.status(200).json(
    new ApiResponse(200, { 
      removed: pincodes.length, 
      total: zone.pincodes.length 
    }, `Pincodes removed`)
  );
});

// Delete zone (admin)
export const deleteZone = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;

  const zone = await DeliveryZone.findOneAndDelete({ zone_id: zoneId });

  if (!zone) {
    throw new ApiError(404, "Zone not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { deleted: true }, "Zone deleted successfully")
  );
});
