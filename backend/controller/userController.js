import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtTokens.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

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

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfolioURL: req.body.portfolioURL,
    githubURL: req.body.githubURL,
    linkedInURL: req.body.linkedInURL,
    instagramURL: req.body.instagramURL,
    twitterURL: req.body.twitterURL,
    facebookURL: req.body.facebookURL,
    youtubeURL: req.body.youtubeURL,
  };

  if (req.files && req.files.avatar) {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);
    const cloudinaryAvatar = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath,
      {
        folder: "AVATARS",
      }
    );
    newUserData.avatar = {
      public_id: cloudinaryAvatar.public_id,
      URL: cloudinaryAvatar.secure_url,
    };
  }
  if (req.files && req.files.resume) {
    const user = await User.findById(req.user.id);
    const imageId = user.resume.public_id;
    await cloudinary.uploader.destroy(imageId);
    const cloudinaryresume = await cloudinary.uploader.upload(
      req.files.resume.tempFilePath,
      {
        folder: "resumeS",
      }
    );
    newUserData.resume = {
      public_id: cloudinaryresume.public_id,
      URL: cloudinaryresume.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

export const getProfileForPortfolio = catchAsyncErrors(
  async (req, res, next) => {
    const id = "6815289299a6b924d4e43c75";
    const user = await User.findById(id);
    if (!user) {
      return next(new errorHandler("User not found", 400));
    }
    res.status(200).json({
      success: true,
      user,
    });
  }
);

export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return next(new errorHandler("Please enter all fields", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new errorHandler("New password and confirm password do not match", 400)
    );
  }
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new errorHandler("Old password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();

  generateToken(user, "Password changed successfully", 200, res);
});
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new errorHandler("Please enter your email", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new errorHandler("User not found", 400));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  console.log(
    "User after forgotPassword save:",
    user.resetPasswordToken,
    user.resetPasswordExpire
  ); // Log resetToken and expire
  const resetUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n ${resetUrl} \n\n If you have not requested this email, then ignore it. `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new errorHandler(error.message, 400));
  }
});
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  console.log("Token from URL:", token); // Log token from URL
  const resetPasswordTokenFromURL = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  console.log("Hashed token from URL:", resetPasswordTokenFromURL); // Log hashed token
  const user = await User.findOne({
    resetPasswordToken: resetPasswordTokenFromURL,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log("User found (or not):", user); // Log the user object

  if (!user) {
    return next(
      new errorHandler("Reset password token is invalid or has expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new errorHandler("Password and confirm password do not match", 400)
    );
  }
  user.password = req.body.password;
  user.markModified("password");
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  generateToken(user, "Password reset successfully", 200, res);
});
