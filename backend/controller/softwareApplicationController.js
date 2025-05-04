import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import { softwareApplication } from "../models/softwareApplicationSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("SVG/Icon of softwareis required", 400));
  }
  const { svg } = req.files;
  const { name } = req.body;
  if (!name) {
    return next(new errorHandler("Name of software is required", 400));
  }
  const cloudinarysvg = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "Softwares",
  });
  if (!cloudinarysvg || cloudinarysvg.error) {
    console.log("Cloudinary error", cloudinarysvg.error || "Unknown Error");
  }
  const application = await softwareApplication.create({
    name,
    svg: {
      public_id: cloudinarysvg.public_id,
      url: cloudinarysvg.secure_url,
    },
  });
  if (!application) {
    return next(new errorHandler("Error addinging software application", 400));
  }
  res.status(200).json({
    success: true,
    message: "Software application added successfully",
    application,
  });
});
export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await softwareApplication.find();
  if (!applications) {
    return next(new errorHandler("No applications found", 400));
  }
  res.status(200).json({
    success: true,
    applications,
  });
});
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await softwareApplication.findById(id);

  if (!application) {
    return next(new errorHandler("Software application not found", 400));
  }
  const cloudinarysvgid = application.svg.public_id;
  const cloudinarysvg = await cloudinary.uploader.destroy(cloudinarysvgid);
  if (!cloudinarysvg || cloudinarysvg.error) {
    console.log("Cloudinary error", cloudinarysvg.error || "Unknown Error");
  }
  res.status(200).json({
    success: true,
    message: "Software application deleted successfully",
  });
});
