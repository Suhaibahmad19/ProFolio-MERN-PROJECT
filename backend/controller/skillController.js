import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import { Skill } from "../models/skillSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("PNG or JPEG icon of skill required", 400)); // Updated message
  }
  const { svg } = req.files; // Still using 'svg' as the field name
  const { title, proficiency } = req.body;
  if (!title || !proficiency) {
    return next(new errorHandler("All fields are required", 400));
  }
  const cloudinarysvg = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "skills_icons",
  });
  if (!cloudinarysvg || cloudinarysvg.error) {
    console.log("Cloudinary error", cloudinarysvg.error || "Unknown Error");
  }
  const application = await Skill.create({
    title: title,
    svg: {
      public_id: cloudinarysvg.public_id,
      url: cloudinarysvg.secure_url,
    },
    proficiency,
  });
  if (!application) {
    return next(new errorHandler("Error adding skill", 400)); // Updated message
  }
  res.status(200).json({
    success: true,
    message: "Skill added successfully",
    application,
  });
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  console.log("Updating skill ID:", id);
  console.log("Request Body:", req.body);

  const { proficiency } = req.body; // Ensure you are extracting 'proficiency'

  const skill = await Skill.findByIdAndUpdate(
    id,
    { proficiency: proficiency }, // Explicitly set the field to update
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  console.log("Result after findByIdAndUpdate:", skill); // Log the result

  if (!skill) {
    return next(new errorHandler("Skill not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    skill,
  });
});

export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const skills = await Skill.find();
  if (!skills || skills.length === 0) {
    return next(new errorHandler("No skills found", 400));
  }
  res.status(200).json({
    success: true,
    skills,
  });
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);

  if (!skill) {
    return next(new errorHandler("Skill not found", 400));
  }
  const cloudinarysvgid = skill.svg.public_id;
  const cloudinarysvg = await cloudinary.uploader.destroy(cloudinarysvgid);
  if (!cloudinarysvg || cloudinarysvg.error) {
    console.log("Cloudinary error", cloudinarysvg.error || "Unknown Error");
  }
  await skill.deleteOne();
  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
});
