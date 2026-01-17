import { uploadImage, deleteImage } from "../../service/image.service.js";
import HeroSection from "../../models/contentstatus.js";

// Create hero section
const add_hero_section = async (req, res) => {
  try {
    const { surprise_text, sub_text, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Media file is required" });
    }

    // Upload to ImageKit
    const uploadResult = await uploadImage(
      req.file.buffer,
      req.file.originalname,
      "bloomtalehero"
    );

    const newHeroSection = new HeroSection({
      media_uri: uploadResult.url,
      media_fileId: uploadResult.fileId,
      surprise_text,
      sub_text,
      description,
    });

    const savedSection = await newHeroSection.save();
    return res.status(201).json(savedSection);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all hero sections
const get_hero_sections = async (req, res) => {
  try {
    const sections = await HeroSection.find().sort({ createdAt: -1 });
    return res.status(200).json(sections);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update hero section
const update_hero_section = async (req, res) => {
  try {
    const { id } = req.params;
    const { surprise_text, sub_text, description } = req.body;

    const section = await HeroSection.findById(id);
    if (!section) {
      return res.status(404).json({ error: "Hero section not found" });
    }

    // If new file uploaded, delete old and upload new
    if (req.file) {
      await deleteImage(section.media_fileId);
      const uploadResult = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        "bloomtalehero"
      );
      section.media_uri = uploadResult.url;
      section.media_fileId = uploadResult.fileId;
    }

    if (surprise_text) section.surprise_text = surprise_text;
    if (sub_text) section.sub_text = sub_text;
    if (description) section.description = description;

    const updatedSection = await section.save();
    return res.status(200).json(updatedSection);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete hero section
const delete_hero_section = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await HeroSection.findById(id);
    if (!section) {
      return res.status(404).json({ error: "Hero section not found" });
    }

    // Delete from ImageKit
    await deleteImage(section.media_fileId);

    await HeroSection.findByIdAndDelete(id);
    return res.status(200).json({ message: "Hero section deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export {
  add_hero_section,
  get_hero_sections,
  update_hero_section,
  delete_hero_section,
};