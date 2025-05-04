import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return next(new errorHandler("User not authenticated", 401)); // Use 401 for unauthorized
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return next(new errorHandler("User not authenticated", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new errorHandler("User not authenticated", 401)); // Use 401 for invalid token
  }
});
