import { User } from "../models/user.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.token;

  if (!token) {
    return next(new errorHandler("User not authenticated", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});
