import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "First name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: 10,
    maxLength: 15,
  },
  aboutMe: {
    type: String,
    required: [true, "About me is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: [true],
    },
    URL: {
      type: String,
      required: [true],
    },
  },
  resume: {
    public_id: {
      type: String,
      required: [true],
    },
    URL: {
      type: String,
      required: [true],
    },
  },
  portfolioURL: String,
  githubURL: String,
  linkedInURL: String,
  instagramURL: String,
  twitterURL: String,
  facebookURL: String,
  youtubeURL: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
export const User = mongoose.model("User", userSchema);
