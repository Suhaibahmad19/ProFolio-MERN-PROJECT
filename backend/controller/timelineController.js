import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineSchema.js";

export const postTimeline = catchAsyncErrors(async (req, res, next) => {
  const { title, description, from, to } = req.body;
  const timeline = await Timeline.create({
    title,
    description,
    timeline: {
      from,
      to,
    },
  });
  if (!timeline) {
    return next(new errorHandler("Timeline not created", 400));
  }
  res.status(201).json({
    success: true,
    timeline,
  });
});

export const getAllTimeline = catchAsyncErrors(async (req, res, next) => {
  const timelines = await Timeline.find();
  if (!timelines) {
    return next(new errorHandler("No timelines found", 400));
  }
  res.status(200).json({
    success: true,
    timelines,
  });
});

export const deleteTimeline = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const timeline = await Timeline.findByIdAndDelete(id);
  if (!timeline) {
    return next(new errorHandler("Timeline not found", 400));
  }
  await timeline.deleteOne();

  res.status(200).json({
    success: true,
    message: "Timeline deleted successfully",
  });
});
