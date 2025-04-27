import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  resetpasswordToken: String,
  resetpasswordExpire: Date,
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

export const User = mongoose.model("User", userSchema);
