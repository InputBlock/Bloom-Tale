import { uploadImage, deleteImage } from "../../service/image.service.js";
import AboutSection from "../../models/aboutSection.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// Get active about section (public)
export const getAboutSection = asyncHandler(async (req, res) => {
  let section = await AboutSection.findOne({ isActive: true });
  
  // Return default values if no section exists
  if (!section) {
    section = {
      images: [],
      badge_number: "7+",
      badge_text: "Years of Excellence",
      title_line1: "We Create Beautiful",
      title_line2: "Floral Experiences",
      description: "At Bloom Tale, every bouquet tells a story. We believe in the power of flowers to express emotions, celebrate moments, and bring joy to everyday life. Our artisans carefully select each stem to create arrangements that are as unique as the occasions they celebrate.",
      features: [
        { icon: "Leaf", text: "Farm Fresh" },
        { icon: "Heart", text: "Handcrafted" },
        { icon: "Award", text: "Premium Quality" }
      ]
    };
  }
  
  return res.status(200).json(
    new ApiResponse(200, section, "About section fetched successfully")
  );
});

// Get all about sections (admin)
export const getAllAboutSections = asyncHandler(async (req, res) => {
  const sections = await AboutSection.find().sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(200, sections, "About sections fetched successfully")
  );
});

// Create about section (admin)
export const createAboutSection = asyncHandler(async (req, res) => {
  const { 
    badge_number, 
    badge_text, 
    title_line1, 
    title_line2, 
    description,
    features 
  } = req.body;

  // Handle multiple image uploads
  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const uploadResult = await uploadImage(
          file.buffer,
          file.originalname,
          "bloomtale-about"
        );
        images.push({
          url: uploadResult.url,
          fileId: uploadResult.fileId,
          alt: file.originalname.split('.')[0]
        });
      } catch (uploadError) {
        // Continue without this image
      }
    }
  }

  // Parse features if sent as string
  let parsedFeatures = features;
  if (typeof features === 'string') {
    try {
      parsedFeatures = JSON.parse(features);
    } catch (e) {
      parsedFeatures = [
        { icon: "Leaf", text: "Farm Fresh" },
        { icon: "Heart", text: "Handcrafted" },
        { icon: "Award", text: "Premium Quality" }
      ];
    }
  }
  
  // Default features if not provided
  if (!parsedFeatures || !Array.isArray(parsedFeatures) || parsedFeatures.length === 0) {
    parsedFeatures = [
      { icon: "Leaf", text: "Farm Fresh" },
      { icon: "Heart", text: "Handcrafted" },
      { icon: "Award", text: "Premium Quality" }
    ];
  }

  const newSection = new AboutSection({
    images,
    badge_number: badge_number || "7+",
    badge_text: badge_text || "Years of Excellence",
    title_line1: title_line1 || "We Create Beautiful",
    title_line2: title_line2 || "Floral Experiences",
    description: description || "At Bloom Tale, every bouquet tells a story.",
    features: parsedFeatures,
    isActive: true
  });

  const savedSection = await newSection.save();
  return res.status(201).json(
    new ApiResponse(201, savedSection, "About section created successfully")
  );
});

// Update about section (admin)
export const updateAboutSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    badge_number, 
    badge_text, 
    title_line1, 
    title_line2, 
    description,
    features,
    deleteImages // Array of fileIds to delete
  } = req.body;

  const section = await AboutSection.findById(id);
  if (!section) {
    throw new ApiError(404, "About section not found");
  }

  // Delete specified images
  if (deleteImages) {
    try {
      const toDelete = typeof deleteImages === 'string' ? JSON.parse(deleteImages) : deleteImages;
      for (const fileId of toDelete) {
        await deleteImage(fileId);
        section.images = section.images.filter(img => img.fileId !== fileId);
      }
    } catch (deleteError) {
      // Continue even if delete fails
    }
  }

  // Upload new images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const uploadResult = await uploadImage(
          file.buffer,
          file.originalname,
          "bloomtale-about"
        );
        section.images.push({
          url: uploadResult.url,
          fileId: uploadResult.fileId,
          alt: file.originalname.split('.')[0]
        });
      } catch (uploadError) {
        // Continue without this image
      }
    }
  }

  // Update text fields (allow empty strings, use !== undefined check)
  if (badge_number !== undefined) section.badge_number = badge_number;
  if (badge_text !== undefined) section.badge_text = badge_text;
  if (title_line1 !== undefined) section.title_line1 = title_line1;
  if (title_line2 !== undefined) section.title_line2 = title_line2;
  if (description !== undefined) section.description = description;
  
  if (features) {
    section.features = typeof features === 'string' ? JSON.parse(features) : features;
  }

  // Ensure section is active after update
  section.isActive = true;

  const updatedSection = await section.save();
  return res.status(200).json(
    new ApiResponse(200, updatedSection, "About section updated successfully")
  );
});

// Delete about section (admin)
export const deleteAboutSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const section = await AboutSection.findById(id);
  if (!section) {
    throw new ApiError(404, "About section not found");
  }

  // Delete all images from storage
  for (const image of section.images) {
    await deleteImage(image.fileId);
  }

  await AboutSection.findByIdAndDelete(id);
  return res.status(200).json(
    new ApiResponse(200, null, "About section deleted successfully")
  );
});

// Set active about section (admin)
export const setActiveAboutSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const section = await AboutSection.findById(id);
  if (!section) {
    throw new ApiError(404, "About section not found");
  }

  section.isActive = true;
  await section.save(); // Pre-save hook will deactivate others

  return res.status(200).json(
    new ApiResponse(200, section, "About section set as active")
  );
});
