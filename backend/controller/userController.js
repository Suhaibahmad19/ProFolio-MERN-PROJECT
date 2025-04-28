import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtTokens.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("Avatar and resume is required", 400));
  }

  const { avatar, resume } = req.files;
  const cloudinaryAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "AVATARS",
    }
  );
  if (!cloudinaryAvatar || cloudinaryAvatar.error) {
    consol.log("Cloudinary error", cloudinaryAvatar.error || "Unknown Error");
  }
  const cloudinaryResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    {
      folder: "RESUMES",
    }
  );

  const {
    name,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    linkedInURL,
    instagramURL,
    twitterURL,
    facebookURL,
    youtubeURL,
  } = req.body;

  const user = await User.create({
    name,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    linkedInURL,
    instagramURL,
    twitterURL,
    facebookURL,
    youtubeURL,
    avatar: {
      public_id: cloudinaryAvatar.public_id,
      URL: cloudinaryAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResume.public_id,
      URL: cloudinaryResume.secure_url,
    },
  });
  generateToken(user, "User registered successfully", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new errorHandler("recived Please enter email and password", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorHandler("searched Invalid email or password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new errorHandler("Invalid email or password", 400));
  }
  generateToken(user, "User logged in successfully", 200, res);
});
