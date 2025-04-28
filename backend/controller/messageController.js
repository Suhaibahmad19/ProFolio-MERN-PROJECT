import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, subject, message } = req.body;

  if (!senderName || !subject || !message) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }
  const data = await Message.create({
    senderName,
    subject,
    message,
  });
  res.status(201).json({
    success: true,
    message: "Message Sent Successfully",
    data,
  });
});
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const messageToDelete = await Message.findById(id);
  if (!messageToDelete) {
    return next(new ErrorHandler("Message not found", 400));
  }
  await messageToDelete.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});
