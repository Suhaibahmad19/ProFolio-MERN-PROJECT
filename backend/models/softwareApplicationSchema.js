import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  svg: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  proficiency: String,
});

export const softwareApplication = mongoose.model(
  "SoftwareApplication",
  softwareApplicationSchema
);
