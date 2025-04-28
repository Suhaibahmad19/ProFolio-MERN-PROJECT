import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const projects = await Project.find();
  if (!projects) {
    return next(new errorHandler("No projects found", 400));
  }
  res.status(200).json({
    success: true,
    projects,
  });
});
export const addProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("SVG/Icon of softwareis required", 400));
  }
  const { image } = req.files;
  const {
    title,
    description,
    githublink,
    projectlink,
    technologies,
    stack,
    deployed,
  } = req.body;

  if (
    !title ||
    !description ||
    !githublink ||
    !projectlink ||
    !technologies ||
    !stack ||
    !deployed
  ) {
    return next(new errorHandler("Please fill all the fields", 400));
  }
  const cloudinaryimage = await cloudinary.uploader.upload(image.tempFilePath, {
    folder: "project_images",
  });
  if (!cloudinaryimage || cloudinaryimage.error) {
    console.log("Cloudinary error", cloudinaryimage.error || "Unknown Error");
    return next(new errorHandler("Image upload failed", 400));
  }

  const project = await Project.create({
    title,
    description,
    githublink,
    projectlink,
    technologies,
    stack,
    deployed,
    image: {
      public_id: cloudinaryimage.public_id,
      url: cloudinaryimage.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Project added successfully",
    project,
  });
});

export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const newProject = {
    title: req.body.title,
    description: req.body.description,
    githublink: req.body.githublink,
    projectlink: req.body.projectlink,
    technologies: req.body.technologies,
    stack: req.body.stack,
    deployed: req.body.deployed,
  };
  if (req.files && req.files.image) {
    const image = req.files.image;
    const project = await Project.findById(req.params.id);
    const imageId = project.image.public_id;
    await cloudinary.uploader.destroy(imageId);
    const cloudinaryImage = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "project_images",
      }
    );
    newProject.image = {
      public_id: cloudinaryImage.public_id,
      url: cloudinaryImage.secure_url,
    };
  }
  project = await Project.findByIdAndUpdate(req.params.id, newProject, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const [id] = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new errorHandler("Project not found", 400));
  }
  const imageId = project.image.public_id;
  await cloudinary.uploader.destroy(imageId);
  await Project.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
export const getProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new errorHandler("Project not found", 400));
  }
  res.status(200).json({
    success: true,
    project,
  });
});
