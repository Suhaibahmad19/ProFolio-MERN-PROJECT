import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import { Skill } from "../models/skillSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("SVG/Icon of skills required", 400));
  }
  const { svg } = req.files;
  const { title, proficiency } = req.body;
  if (!title || !proficiency) {
    return next(new errorHandler("All fields are required", 400));
  }
  const cloudinarysvg = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "skills_svg",
  });
  if (!cloudinarysvg || cloudinarysvg.error) {
    console.log("Cloudinary error", cloudinarysvg.error || "Unknown Error");
  }
  const application = await Skill.create({
    title,
    svg: {
      public_id: cloudinarysvg.public_id,
      url: cloudinarysvg.secure_url,
    },
    proficiency,
  });
  if (!application) {
    return next(new errorHandler("Error addinging software application", 400));
  }
  res.status(200).json({
    success: true,
    message: "Skill added successfully",
    application,
  });
});
export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);

  if (!skill) {
    return next(new errorHandler("Skill not found", 400));
  }

  const { proficiency } = req.body;
  skill = await Skill.findByIdAndUpdate(
    id,
    { proficiency },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  if (!skill) {
    return next(new errorHandler("Error updating skill", 400));
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
  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
});
